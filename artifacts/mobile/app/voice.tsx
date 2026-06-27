import { ChatBubble } from "@/components/ChatBubble";
import { useColors } from "@/hooks/useColors";
import type { Message } from "@/contexts/ChatContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

function PulseRing({ color, delay = 0 }: { color: string; delay?: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.8, { duration: 1200 + delay }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 1200 + delay }),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.pulseRing,
        { borderColor: color, borderWidth: 2 },
        animStyle,
      ]}
    />
  );
}

export default function VoiceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const inputRef = useRef<TextInput>(null);

  function makeId() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 6);
  }

  async function sendViaText(text: string) {
    if (!text.trim() || isThinking) return;
    setTextInput("");
    setIsThinking(true);

    const userMsg: Message = {
      id: makeId(),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    const assistantId = makeId();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const domain = process.env["EXPO_PUBLIC_DOMAIN"];
    try {
      const res = await fetch(`https://${domain}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode: "general",
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6)) as { content?: string };
            if (data.content) {
              accumulated += data.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: accumulated } : m
                )
              );
            }
          } catch {}
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I could not respond. Please try again." }
            : m
        )
      );
    } finally {
      setIsThinking(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  function toggleMic() {
    if (isListening) {
      setIsListening(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setShowTextInput(true);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setIsListening(true);
      setShowTextInput(false);
      setTimeout(() => {
        setIsListening(false);
        setShowTextInput(true);
        inputRef.current?.focus();
      }, 3000);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: colors.border,
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12),
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text
          style={[
            styles.headerTitle,
            { color: colors.foreground, fontFamily: "Inter_700Bold" },
          ]}
        >
          Voice Chat
        </Text>
        <View style={{ width: 34 }} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior="padding" keyboardVerticalOffset={0}>
        {messages.length > 0 ? (
          <FlatList
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => <ChatBubble message={item} />}
            inverted
            contentContainerStyle={styles.messageList}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <View style={styles.micCenter}>
            <View style={styles.micWrapper}>
              {isListening && (
                <>
                  <PulseRing color={colors.primary} delay={0} />
                  <PulseRing color={colors.primary} delay={300} />
                </>
              )}
              <Pressable
                onPress={toggleMic}
                style={[
                  styles.micBtn,
                  {
                    backgroundColor: isListening
                      ? colors.primary
                      : colors.card,
                    borderColor: isListening ? colors.primary : colors.border,
                    shadowColor: colors.primary,
                  },
                ]}
              >
                <Ionicons
                  name={isListening ? "stop" : "mic-outline"}
                  size={36}
                  color={
                    isListening ? colors.primaryForeground : colors.foreground
                  }
                />
              </Pressable>
            </View>

            {isThinking ? (
              <View style={styles.thinkingRow}>
                <ActivityIndicator color={colors.primary} />
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: colors.mutedForeground,
                      fontFamily: "Inter_400Regular",
                    },
                  ]}
                >
                  Thinking...
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.statusText,
                  {
                    color: colors.mutedForeground,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
              >
                {isListening
                  ? "Listening... tap to stop"
                  : "Tap the mic to speak"}
              </Text>
            )}
          </View>
        )}

        <View
          style={[
            styles.inputArea,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom:
                insets.bottom + (Platform.OS === "web" ? 34 : 8),
            },
          ]}
        >
          {showTextInput || messages.length > 0 ? (
            <View style={styles.textRow}>
              <Pressable onPress={toggleMic} style={styles.micSmall}>
                <Ionicons
                  name={isListening ? "stop-circle" : "mic"}
                  size={22}
                  color={isListening ? colors.primary : colors.mutedForeground}
                />
              </Pressable>
              <View
                style={[
                  styles.inputBox,
                  {
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    borderRadius: 24,
                  },
                ]}
              >
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.textInput,
                    {
                      color: colors.foreground,
                      fontFamily: "Inter_400Regular",
                    },
                  ]}
                  placeholder="Type your message..."
                  placeholderTextColor={colors.mutedForeground}
                  value={textInput}
                  onChangeText={setTextInput}
                  multiline
                  maxLength={2000}
                />
                <Pressable
                  onPress={() => sendViaText(textInput)}
                  disabled={!textInput.trim() || isThinking}
                  style={[
                    styles.sendBtn,
                    {
                      backgroundColor:
                        textInput.trim() && !isThinking
                          ? colors.primary
                          : colors.muted,
                      borderRadius: 20,
                    },
                  ]}
                >
                  <Ionicons
                    name="send"
                    size={15}
                    color={
                      textInput.trim() && !isThinking
                        ? colors.primaryForeground
                        : colors.mutedForeground
                    }
                  />
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => setShowTextInput(true)}
              style={styles.typeInstead}
            >
              <Text
                style={[
                  styles.typeText,
                  { color: colors.primary, fontFamily: "Inter_500Medium" },
                ]}
              >
                Type instead
              </Text>
            </Pressable>
          )}
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
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 8,
  },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 18, flex: 1, textAlign: "center" },
  messageList: { paddingVertical: 12, flexGrow: 1, justifyContent: "flex-end" },
  micCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  micWrapper: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  micBtn: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  thinkingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusText: { fontSize: 15, textAlign: "center" },
  inputArea: {
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  textRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  micSmall: { padding: 8 },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    minHeight: 48,
  },
  textInput: { flex: 1, fontSize: 15, maxHeight: 120, lineHeight: 22 },
  sendBtn: { width: 34, height: 34, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  typeInstead: { alignItems: "center", paddingVertical: 12 },
  typeText: { fontSize: 15 },
});
