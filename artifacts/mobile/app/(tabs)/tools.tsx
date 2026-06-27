import { FeatureCard } from "@/components/FeatureCard";
import { useChat } from "@/contexts/ChatContext";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOOL_SECTIONS = [
  {
    title: "Learning & Education",
    tools: [
      {
        icon: "school-outline" as const,
        label: "Study Assistant",
        description: "Get explanations, summaries, and study help",
        color: "#7c3aed",
        mode: "study",
      },
      {
        icon: "book-outline" as const,
        label: "Research Helper",
        description: "Analyze topics and find information",
        color: "#6366f1",
        mode: "research",
      },
      {
        icon: "language-outline" as const,
        label: "Translation",
        description: "Translate between any languages",
        color: "#14b8a6",
        mode: "translation",
      },
    ],
  },
  {
    title: "Productivity",
    tools: [
      {
        icon: "create-outline" as const,
        label: "Writing Assistant",
        description: "Write, edit, and improve your content",
        color: "#ef4444",
        mode: "writing",
      },
      {
        icon: "mail-outline" as const,
        label: "Email Generator",
        description: "Compose professional emails instantly",
        color: "#f97316",
        mode: "email",
      },
      {
        icon: "checkmark-circle-outline" as const,
        label: "Productivity",
        description: "Task planning and workflow optimization",
        color: "#84cc16",
        mode: "productivity",
      },
    ],
  },
  {
    title: "Business & Career",
    tools: [
      {
        icon: "briefcase-outline" as const,
        label: "Business Ideas",
        description: "Startup guidance and business planning",
        color: "#f59e0b",
        mode: "business",
      },
      {
        icon: "trending-up-outline" as const,
        label: "Career Guidance",
        description: "Advance your professional journey",
        color: "#06b6d4",
        mode: "career",
      },
      {
        icon: "megaphone-outline" as const,
        label: "Marketing",
        description: "Brand, content, and campaign ideas",
        color: "#ec4899",
        mode: "marketing",
      },
    ],
  },
  {
    title: "Tech & Creative",
    tools: [
      {
        icon: "code-slash-outline" as const,
        label: "Coding Assistant",
        description: "Debug, review, and write code",
        color: "#10b981",
        mode: "coding",
      },
      {
        icon: "share-social-outline" as const,
        label: "Social Media",
        description: "Create posts and grow your audience",
        color: "#8b5cf6",
        mode: "social",
      },
    ],
  },
  {
    title: "AI Media",
    tools: [
      {
        icon: "image-outline" as const,
        label: "Image Generator",
        description: "Create stunning AI-generated images",
        color: "#a855f7",
        route: "/image-gen",
      },
      {
        icon: "mic-outline" as const,
        label: "Voice Chat",
        description: "Have a voice conversation with AeraX AI",
        color: "#f97316",
        route: "/voice",
      },
    ],
  },
];

export default function ToolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { createConversation } = useChat();

  function handleTool(mode?: string, route?: string) {
    if (route) {
      router.push(route as "/image-gen" | "/voice");
      return;
    }
    if (mode) {
      const labels: Record<string, string> = {
        study: "Study Session",
        research: "Research Session",
        translation: "Translation",
        writing: "Writing Session",
        email: "Email Draft",
        productivity: "Productivity Chat",
        business: "Business Planning",
        career: "Career Guidance",
        marketing: "Marketing Ideas",
        coding: "Coding Session",
        social: "Social Media Content",
      };
      const conv = createConversation(mode, labels[mode] ?? "New Chat");
      router.push(`/chat/${conv.id}`);
    }
  }

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
      <Text
        style={[
          styles.pageTitle,
          { color: colors.foreground, fontFamily: "Inter_700Bold" },
        ]}
      >
        AI Tools
      </Text>
      <Text
        style={[
          styles.pageSub,
          { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
        ]}
      >
        Choose a specialized AI assistant
      </Text>

      {TOOL_SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            {section.title.toUpperCase()}
          </Text>
          <View style={styles.toolsList}>
            {section.tools.map((tool) => (
              <FeatureCard
                key={tool.label}
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
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 24 },
  pageTitle: { fontSize: 26, paddingHorizontal: 4 },
  pageSub: { fontSize: 14, paddingHorizontal: 4, marginTop: -16 },
  section: { gap: 10 },
  sectionTitle: { fontSize: 11, letterSpacing: 1.2, paddingHorizontal: 4 },
  toolsList: { gap: 10 },
});
