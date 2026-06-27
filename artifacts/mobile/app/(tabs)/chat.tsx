import { useChat } from "@/contexts/ChatContext";
import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Conversation } from "@/contexts/ChatContext";

const MODE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  general: "chatbubbles-outline",
  study: "school-outline",
  coding: "code-slash-outline",
  business: "briefcase-outline",
  writing: "create-outline",
  career: "trending-up-outline",
  marketing: "megaphone-outline",
  research: "search-outline",
  translation: "language-outline",
  productivity: "checkmark-circle-outline",
};

const MODE_COLORS: Record<string, string> = {
  general: "#00b4ff",
  study: "#7c3aed",
  coding: "#10b981",
  business: "#f59e0b",
  writing: "#ef4444",
  career: "#06b6d4",
  marketing: "#ec4899",
  research: "#6366f1",
  translation: "#14b8a6",
  productivity: "#84cc16",
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString();
}

export default function ChatListScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { conversations, createConversation, deleteConversation } = useChat();
  const [search, setSearch] = useState("");

  const filtered = search
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  function handleNewChat() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const conv = createConversation("general", "New Chat");
    router.push(`/chat/${conv.id}`);
  }

  function handleDelete(id: string) {
    Alert.alert("Delete conversation?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteConversation(id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  }

  function renderItem({ item }: { item: Conversation }) {
    const icon = MODE_ICONS[item.mode] ?? "chatbubbles-outline";
    const accent = MODE_COLORS[item.mode] ?? colors.primary;
    const lastMsg = item.messages[item.messages.length - 1];

    return (
      <Pressable
        onPress={() => router.push(`/chat/${item.id}`)}
        onLongPress={() => handleDelete(item.id)}
        style={({ pressed }) => [
          styles.item,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={[styles.itemIcon, { backgroundColor: `${accent}22` }]}>
          <Ionicons name={icon} size={20} color={accent} />
        </View>
        <View style={styles.itemInfo}>
          <View style={styles.itemRow}>
            <Text
              style={[
                styles.itemTitle,
                { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.itemTime,
                {
                  color: colors.mutedForeground,
                  fontFamily: "Inter_400Regular",
                },
              ]}
            >
              {formatTime(item.updatedAt)}
            </Text>
          </View>
          <Text
            style={[
              styles.itemPreview,
              {
                color: colors.mutedForeground,
                fontFamily: "Inter_400Regular",
              },
            ]}
            numberOfLines={1}
          >
            {lastMsg ? lastMsg.content : "Start the conversation..."}
          </Text>
          <View style={styles.itemMeta}>
            <View
              style={[
                styles.modePill,
                { backgroundColor: `${accent}22`, borderColor: `${accent}44` },
              ]}
            >
              <Text style={[styles.modeText, { color: accent }]}>
                {item.mode}
              </Text>
            </View>
            <Text
              style={[
                styles.msgCount,
                {
                  color: colors.mutedForeground,
                  fontFamily: "Inter_400Regular",
                },
              ]}
            >
              {item.messages.length} messages
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: colors.border,
            paddingTop:
              insets.top + (Platform.OS === "web" ? 67 : 12),
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            { color: colors.foreground, fontFamily: "Inter_700Bold" },
          ]}
        >
          Conversations
        </Text>
        <Pressable
          onPress={handleNewChat}
          style={({ pressed }) => [
            styles.newBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: 12,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Ionicons name="add" size={22} color={colors.primaryForeground} />
        </Pressable>
      </View>

      <View
        style={[
          styles.searchRow,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Ionicons name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[
            styles.searchInput,
            { color: colors.foreground, fontFamily: "Inter_400Regular" },
          ]}
          placeholder="Search conversations..."
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close" size={16} color={colors.mutedForeground} />
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === "web" ? 34 : 16),
          },
        ]}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="chatbubbles-outline"
              size={48}
              color={colors.mutedForeground}
            />
            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.foreground,
                  fontFamily: "Inter_600SemiBold",
                },
              ]}
            >
              No conversations yet
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
              Tap + to start your first chat
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24 },
  newBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15 },
  list: { padding: 16, gap: 10 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 10,
  },
  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemInfo: { flex: 1, gap: 4 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: { fontSize: 15, flex: 1 },
  itemTime: { fontSize: 12 },
  itemPreview: { fontSize: 13 },
  itemMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  modePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  modeText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  msgCount: { fontSize: 12 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { fontSize: 18 },
  emptySub: { fontSize: 14 },
});
