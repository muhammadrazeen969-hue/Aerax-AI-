import { AeraLogo } from "@/components/AeraLogo";
import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
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

const MISSIONS = [
  "Make AI simple and accessible for everyone",
  "Help people learn faster and work smarter",
  "Empower students, creators, and entrepreneurs",
  "Deliver reliable and useful AI assistance worldwide",
];

const VISIONS = [
  "Build one of the world's most useful AI platforms",
  "Create intelligent tools that improve everyday life",
  "Make advanced technology available to everyone",
  "Continuously innovate and expand AI capabilities",
];

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

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
          About AeraX AI
        </Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 32),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <AeraLogo size="lg" showTagline />
        </View>

        <View
          style={[
            styles.aboutCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text
            style={[
              styles.aboutText,
              { color: colors.foreground, fontFamily: "Inter_400Regular" },
            ]}
          >
            AeraX AI is an advanced artificial intelligence platform designed to
            help users learn, create, solve problems, generate ideas, and
            improve productivity. It provides a fast, modern, and intelligent
            experience for students, professionals, entrepreneurs, and everyday
            users.
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.foreground, fontFamily: "Inter_700Bold" },
            ]}
          >
            Our Mission
          </Text>
          {MISSIONS.map((m) => (
            <View key={m} style={styles.bulletRow}>
              <View
                style={[
                  styles.bulletDot,
                  { backgroundColor: colors.primary },
                ]}
              />
              <Text
                style={[
                  styles.bulletText,
                  { color: colors.foreground, fontFamily: "Inter_400Regular" },
                ]}
              >
                {m}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.foreground, fontFamily: "Inter_700Bold" },
            ]}
          >
            Our Vision
          </Text>
          {VISIONS.map((v) => (
            <View key={v} style={styles.bulletRow}>
              <View
                style={[
                  styles.bulletDot,
                  { backgroundColor: colors.accent },
                ]}
              />
              <Text
                style={[
                  styles.bulletText,
                  { color: colors.foreground, fontFamily: "Inter_400Regular" },
                ]}
              >
                {v}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.foreground, fontFamily: "Inter_700Bold" },
            ]}
          >
            Our Founder
          </Text>
          <Pressable
            onPress={() => router.push("/founder")}
            style={({ pressed }) => [
              styles.founderLink,
              {
                backgroundColor: colors.primary + "18",
                borderColor: colors.primary + "55",
                borderRadius: colors.radius,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Ionicons name="person-circle-outline" size={18} color={colors.primary} />
            <Text
              style={[
                styles.founderLinkText,
                { color: colors.primary, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              View Full Founder Profile
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </Pressable>
          <View
            style={[
              styles.founderCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View
              style={[
                styles.founderAvatar,
                { backgroundColor: colors.primary, borderRadius: 28 },
              ]}
            >
              <Text
                style={[
                  styles.founderInitial,
                  {
                    color: colors.primaryForeground,
                    fontFamily: "Inter_700Bold",
                  },
                ]}
              >
                MR
              </Text>
            </View>
            <View style={styles.founderInfo}>
              <Text
                style={[
                  styles.founderName,
                  { color: colors.foreground, fontFamily: "Inter_700Bold" },
                ]}
              >
                Muhammad Razeen
              </Text>
              <Text
                style={[
                  styles.founderTitle,
                  {
                    color: colors.primary,
                    fontFamily: "Inter_500Medium",
                  },
                ]}
              >
                CEO & Founder of AeraX AI
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.founderBio,
              { color: colors.foreground, fontFamily: "Inter_400Regular" },
            ]}
          >
            Muhammad Razeen is a young entrepreneur and visionary founder who
            created AeraX AI with the goal of making artificial intelligence
            simple, powerful, and accessible for everyone. His vision is to
            build innovative AI products that help people learn, grow, solve
            problems, and achieve success through technology.
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.foreground, fontFamily: "Inter_700Bold" },
            ]}
          >
            Contact
          </Text>
          <View
            style={[
              styles.contactCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            {[
              {
                icon: "mail-outline" as const,
                label: "Primary Email",
                value: "muhammadrazeen969@gmail.com",
              },
              {
                icon: "briefcase-outline" as const,
                label: "Business Email",
                value: "inforezocreative123@gmail.com",
              },
            ].map((item) => (
              <View key={item.label} style={styles.contactRow}>
                <Ionicons name={item.icon} size={18} color={colors.primary} />
                <View>
                  <Text
                    style={[
                      styles.contactLabel,
                      {
                        color: colors.mutedForeground,
                        fontFamily: "Inter_400Regular",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.contactValue,
                      {
                        color: colors.foreground,
                        fontFamily: "Inter_500Medium",
                      },
                    ]}
                  >
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text
          style={[
            styles.version,
            { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
          ]}
        >
          AeraX AI v1.0.0 — Smart AI For Everyone
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  content: { padding: 16, gap: 24 },
  hero: { alignItems: "center", paddingVertical: 16 },
  aboutCard: { padding: 16, borderWidth: 1 },
  aboutText: { fontSize: 15, lineHeight: 24 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 20 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8, flexShrink: 0 },
  bulletText: { fontSize: 15, lineHeight: 22, flex: 1 },
  founderLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    gap: 8,
  },
  founderLinkText: { flex: 1, fontSize: 14 },
  founderCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 14,
  },
  founderAvatar: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  founderInitial: { fontSize: 20 },
  founderInfo: { gap: 3 },
  founderName: { fontSize: 18 },
  founderTitle: { fontSize: 13 },
  founderBio: { fontSize: 15, lineHeight: 24 },
  contactCard: { padding: 16, borderWidth: 1, gap: 14 },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  contactLabel: { fontSize: 12, marginBottom: 2 },
  contactValue: { fontSize: 14 },
  version: { fontSize: 12, textAlign: "center", paddingTop: 8 },
});
