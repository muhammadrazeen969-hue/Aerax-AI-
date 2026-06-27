import { FeatureCard } from "@/components/FeatureCard";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOOLS = [
  {
    icon: "chatbubbles-outline" as const,
    label: "AI Chat",
    description: "Ask anything, get instant answers",
    color: "#00b4ff",
    mode: "general",
  },
  {
    icon: "school-outline" as const,
    label: "Study Assistant",
    description: "Learn faster with AI tutoring",
    color: "#7c3aed",
    mode: "study",
  },
  {
    icon: "code-slash-outline" as const,
    label: "Coding Assistant",
    description: "Debug and write better code",
    color: "#10b981",
    mode: "coding",
  },
  {
    icon: "briefcase-outline" as const,
    label: "Business Ideas",
    description: "Plan and grow your business",
    color: "#f59e0b",
    mode: "business",
  },
  {
    icon: "create-outline" as const,
    label: "Writing",
    description: "Draft and edit any content",
    color: "#ef4444",
    mode: "writing",
  },
  {
    icon: "trending-up-outline" as const,
    label: "Career Guide",
    description: "Advance your professional life",
    color: "#06b6d4",
    mode: "career",
  },
  {
    icon: "image-outline" as const,
    label: "Image Generator",
    description: "Create AI-powered images",
    color: "#8b5cf6",
    route: "/image-gen",
  },
  {
    icon: "mic-outline" as const,
    label: "Voice Chat",
    description: "Talk to AeraX AI out loud",
    color: "#f97316",
    route: "/voice",
  },
] as const;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { conversations, createConversation } = useChat();

  function handleTool(mode?: string, route?: string) {
    if (route) {
      router.push(route as "/image-gen");
      return;
    }
    if (mode) {
      const modeLabels: Record<string, string> = {
        general: "AI Chat",
        study: "Study Assistant",
        coding: "Coding Assistant",
        business: "Business Ideas",
        writing: "Writing Assistant",
        career: "Career Guide",
      };
      const conv = createConversation(mode, modeLabels[mode] ?? "New Chat");
      router.push(`/chat/${conv.id}`);
    }
  }

  const recent = conversations.slice(0, 3);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop:
            insets.top + (Platform.OS === "web" ? 67 : 12),
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 24),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#050d1a", "#0a1628"]}
        style={[StyleSheet.absoluteFill]}
      />

      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.greeting,
              { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
            ]}
          >
            {getGreeting()}
          </Text>
          <Text
            style={[
              styles.userName,
              { color: colors.foreground, fontFamily: "Inter_700Bold" },
            ]}
          >
            {user?.name?.split(" ")[0] ?? "there"}
          </Text>
        </View>
        {user?.isPremium && (
          <View
            style={[
              styles.premiumBadge,
              { backgroundColor: "#f59e0b22", borderColor: "#f59e0b" },
            ]}
          >
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text style={[styles.premiumText, { color: "#f59e0b" }]}>
              {user.isFounder ? "Founder" : "Premium"}
            </Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: colors.primary,
            borderRadius: colors.radius + 4,
          },
        ]}
      >
        <View style={styles.heroContent}>
          <Text
            style={[
              styles.heroTitle,
              { color: colors.primaryForeground, fontFamily: "Inter_700Bold" },
            ]}
          >
            Ask AeraX AI anything
          </Text>
          <Text
            style={[
              styles.heroSub,
              {
                color: `${colors.primaryForeground}cc`,
                fontFamily: "Inter_400Regular",
              },
            ]}
          >
            Smart AI For Everyone
          </Text>
        </View>
        <Pressable
          onPress={() => {
            const conv = createConversation("general", "AI Chat");
            router.push(`/chat/${conv.id}`);
          }}
          style={({ pressed }) => [
            styles.heroBtn,
            {
              backgroundColor: colors.primaryForeground,
              borderRadius: 12,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.heroBtnText,
              { color: colors.primary, fontFamily: "Inter_700Bold" },
            ]}
          >
            Start Chatting Free
          </Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={colors.primary}
          />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
          ]}
        >
          AI Tools
        </Text>
        <View style={styles.toolsGrid}>
          {TOOLS.map((tool) => (
            <View key={tool.label} style={styles.toolItem}>
              <FeatureCard
                icon={tool.icon}
                label={tool.label}
                description={tool.description}
                color={tool.color}
                onPress={() =>
                  handleTool(
                    "mode" in tool ? tool.mode : undefined,
                    "route" in tool ? tool.route : undefined
                  )
                }
              />
            </View>
          ))}
        </View>
      </View>

      {recent.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              Recent Chats
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/chat")}>
              <Text
                style={[
                  styles.seeAll,
                  { color: colors.primary, fontFamily: "Inter_500Medium" },
                ]}
              >
                See all
              </Text>
            </Pressable>
          </View>
          {recent.map((conv) => (
            <Pressable
              key={conv.id}
              onPress={() => router.push(`/chat/${conv.id}`)}
              style={({ pressed }) => [
                styles.recentItem,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.recentIcon,
                  { backgroundColor: `${colors.primary}22` },
                ]}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <View style={styles.recentInfo}>
                <Text
                  style={[
                    styles.recentTitle,
                    {
                      color: colors.foreground,
                      fontFamily: "Inter_500Medium",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {conv.title}
                </Text>
                <Text
                  style={[
                    styles.recentSub,
                    {
                      color: colors.mutedForeground,
                      fontFamily: "Inter_400Regular",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {conv.messages.length > 0
                    ? conv.messages[conv.messages.length - 1].content
                    : "No messages yet"}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.mutedForeground}
              />
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  greeting: { fontSize: 14, marginBottom: 2 },
  userName: { fontSize: 24 },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  premiumText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  heroCard: {
    padding: 20,
    gap: 16,
    overflow: "hidden",
  },
  heroContent: { gap: 4 },
  heroTitle: { fontSize: 22 },
  heroSub: { fontSize: 14 },
  heroBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  heroBtnText: { fontSize: 15 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, paddingHorizontal: 4 },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  seeAll: { fontSize: 14 },
  toolsGrid: { gap: 12 },
  toolItem: {},
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  recentIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recentInfo: { flex: 1, gap: 3 },
  recentTitle: { fontSize: 15 },
  recentSub: { fontSize: 13 },
});
