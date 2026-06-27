import { ChatBubble } from "@/components/ChatBubble";
import { useChat, type Message } from "@/contexts/ChatContext";
import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DOMAIN = process.env["EXPO_PUBLIC_DOMAIN"];
const API_URL = `https://${DOMAIN}/api/ai/chat`;
const FALLBACK = "Sorry, I am temporarily unavailable. Please try again.";

const MODE_LABELS: Record<string, string> = {
  general: "AeraX AI",
  study: "Study Assistant",
  coding: "Coding Assistant",
  business: "Business Assistant",
  writing: "Writing Assistant",
  career: "Career Guide",
  marketing: "Marketing Assistant",
  research: "Research Assistant",
  translation: "Translation",
  productivity: "Productivity",
  email: "Email Assistant",
  social: "Social Media",
};

function parseSSEText(text: string): string {
  let result = "";
  for (const line of text.split("\n")) {
    if (!line.startsWith("data: ")) continue;
    try {
      const data = JSON.parse(line.slice(6)) as {
        content?: string;
        done?: boolean;
        error?: string;
      };
      if (data.error) return data.error;
      if (data.content) result += data.content;
    } catch {}
  }
  return result;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getConversation, updateConversation } = useChat();

  const conv = getConversation(id ?? "");
  const [messages, setMessages] = useState<Message[]>(conv?.messages ?? []);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const saveMessages = useCallback(
    (msgs: Message[]) => {
      if (!id) return;
      const title =
        msgs.find((m) => m.role === "user")?.content.slice(0, 40) ??
        conv?.title ??
        "New Chat";
      updateConversation(id, { messages: msgs, title });
    },
    [id, conv?.title, updateConversation]
  );

  function updateAssistantContent(assistantId: string, content: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === assistantId ? { ...m, content } : m))
    );
  }

  async function streamResponse(
    assistantId: string,
    apiMessages: { role: string; content: string }[],
    mode: string,
    userMessages: Message[],
    assistantMsg: Message
  ) {
    abortRef.current = new AbortController();

    let accumulated = "";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, mode }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        let errText = FALLBACK;
        try {
          const errBody = (await res.json()) as { error?: string };
          if (errBody.error) errText = errBody.error;
        } catch {}
        updateAssistantContent(assistantId, errText);
        const final = [...userMessages, { ...assistantMsg, content: errText }];
        saveMessages(final);
        return;
      }

      const bodyStream = res.body;

      if (bodyStream && typeof bodyStream.getReader === "function") {
        const reader = bodyStream.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          let done = false;
          let value: Uint8Array | undefined;
          try {
            const result = await reader.read();
            done = result.done;
            value = result.value;
          } catch {
            break;
          }
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6)) as {
                content?: string;
                done?: boolean;
                error?: string;
              };
              if (data.error) {
                accumulated = data.error || FALLBACK;
                updateAssistantContent(assistantId, accumulated);
              } else if (data.content) {
                accumulated += data.content;
                updateAssistantContent(assistantId, accumulated);
              }
            } catch {}
          }
        }
      } else {
        const text = await res.text();
        accumulated = parseSSEText(text);
        if (accumulated) {
          updateAssistantContent(assistantId, accumulated);
        }
      }

      if (!accumulated) {
        accumulated = FALLBACK;
        updateAssistantContent(assistantId, accumulated);
      }

      const finalMessages: Message[] = [
        ...userMessages,
        { ...assistantMsg, content: accumulated },
      ];
      saveMessages(finalMessages);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return;
      const errContent =
        __DEV__
          ? `Connection error: ${String(err)}`
          : "Connection error. Please check your internet and try again.";
      updateAssistantContent(assistantId, errContent);
      const final = [...userMessages, { ...assistantMsg, content: errContent }];
      saveMessages(final);
    } finally {
      setIsStreaming(false);
      setStreamingId(null);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = {
      id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);
    inputRef.current?.focus();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    const assistantId = `a_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };

    setMessages([...newMessages, assistantMsg]);
    setStreamingId(assistantId);

    const apiMessages = newMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    await streamResponse(
      assistantId,
      apiMessages,
      conv?.mode ?? "general",
      newMessages,
      assistantMsg
    );
  }

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <ChatBubble message={item} isTyping={item.id === streamingId} />
    ),
    [streamingId]
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const mode = conv?.mode ?? "general";
  const label = MODE_LABELS[mode] ?? "AeraX AI";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12),
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.headerTitle,
              { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {isStreaming && (
            <Text
              style={[
                styles.streamingText,
                {
                  color: colors.mutedForeground,
                  fontFamily: "Inter_400Regular",
                },
              ]}
            >
              Generating...
            </Text>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          inverted
          contentContainerStyle={styles.messageList}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View
                style={[
                  styles.emptyIcon,
                  { backgroundColor: `${colors.primary}22` },
                ]}
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={32}
                  color={colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: colors.foreground,
                    fontFamily: "Inter_600SemiBold",
                  },
                ]}
              >
                Start your conversation
              </Text>
              <Text
                style={[
                  styles.emptySub,
                  {
                    color: colors.mutedForeground,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
              >
                Ask me anything — I am here to help
              </Text>
            </View>
          }
        />

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom:
                insets.bottom + (Platform.OS === "web" ? 34 : 8),
            },
          ]}
        >
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: colors.input,
                borderColor: isStreaming ? colors.primary : colors.border,
                borderRadius: 24,
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              style={[
                styles.textInput,
                { color: colors.foreground, fontFamily: "Inter_400Regular" },
              ]}
              placeholder="Message AeraX AI..."
              placeholderTextColor={colors.mutedForeground}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={4000}
              returnKeyType="default"
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
              editable={!isStreaming}
            />
            <Pressable
              onPress={sendMessage}
              disabled={!input.trim() || isStreaming}
              style={({ pressed }) => [
                styles.sendBtn,
                {
                  backgroundColor:
                    input.trim() && !isStreaming
                      ? colors.primary
                      : colors.muted,
                  borderRadius: 20,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons
                name={isStreaming ? "ellipsis-horizontal" : "send"}
                size={16}
                color={
                  input.trim() && !isStreaming
                    ? colors.primaryForeground
                    : colors.mutedForeground
                }
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  backBtn: { padding: 6 },
  headerCenter: { flex: 1, alignItems: "center", gap: 2 },
  headerTitle: { fontSize: 16 },
  streamingText: { fontSize: 11 },
  headerRight: { width: 34 },
  messageList: {
    paddingVertical: 12,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
    gap: 12,
    transform: [{ scaleY: -1 }],
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 18, textAlign: "center" },
  emptySub: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    lineHeight: 22,
  },
  sendBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    alignSelf: "flex-end",
  },
});
