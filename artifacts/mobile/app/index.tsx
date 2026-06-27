import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const IS_WEB = Platform.OS === "web";

const FEATURES = [
  {
    icon: "chatbubbles-outline" as const,
    title: "AI Chat",
    desc: "Real-time streaming responses to any question — study, business, or casual.",
    color: "#00b4ff",
  },
  {
    icon: "school-outline" as const,
    title: "Study Assistant",
    desc: "Learn faster with AI tutoring that breaks down complex topics clearly.",
    color: "#7c3aed",
  },
  {
    icon: "code-slash-outline" as const,
    title: "Coding Assistant",
    desc: "Debug, write, and review code across all major programming languages.",
    color: "#10b981",
  },
  {
    icon: "image-outline" as const,
    title: "Image Generator",
    desc: "Create stunning AI-generated images from simple text descriptions.",
    color: "#8b5cf6",
  },
  {
    icon: "briefcase-outline" as const,
    title: "Business Tools",
    desc: "Business plans, market analysis, startup guidance, and strategy advice.",
    color: "#f59e0b",
  },
  {
    icon: "create-outline" as const,
    title: "Writing Assistant",
    desc: "Draft, edit, and perfect any content — from emails to essays.",
    color: "#ef4444",
  },
];

function SplashScreen() {
  const colors = useColors();
  const { user, isLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 55,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(glowAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(taglineAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => setSplashDone(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (splashDone && !isLoading) {
      if (user) router.replace("/(tabs)");
      else router.replace("/(auth)/login");
    }
  }, [splashDone, isLoading, user]);

  return (
    <LinearGradient colors={["#000000", "#040c1c", "#071630"]} style={styles.splash}>
      <Animated.View style={[styles.splashContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Animated.View style={[styles.splashGlow, { opacity: glowAnim, shadowColor: colors.primary }]} />
        <View style={[styles.splashCircle, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
          <Text style={styles.splashLetter}>AX</Text>
        </View>
        <Text style={styles.splashName}>AeraX AI</Text>
        <Animated.Text style={[styles.splashTagline, { color: colors.mutedForeground, opacity: taglineAnim }]}>
          Smart AI For Everyone
        </Animated.Text>
      </Animated.View>
      <Animated.View style={[styles.splashDots, { opacity: taglineAnim }]}>
        <View style={[styles.splashDot, { backgroundColor: colors.primary }]} />
        <View style={[styles.splashDot, { backgroundColor: colors.primary, opacity: 0.6 }]} />
        <View style={[styles.splashDot, { backgroundColor: colors.primary, opacity: 0.3 }]} />
      </Animated.View>
    </LinearGradient>
  );
}

function LandingPage() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading]);

  const maxW = Math.min(width, 900);
  const colWidth = width < 600 ? "100%" : width < 900 ? "47%" : "30%";

  return (
    <View style={[styles.landingContainer, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <LinearGradient
          colors={["#000000", "#050d1a", "#071630"]}
          style={styles.landingHeroBg}
        >
          <View style={[styles.landingNav, { paddingTop: insets.top + 16, maxWidth: maxW, alignSelf: "center", width: "100%" }]}>
            <View style={styles.navLogo}>
              <View style={[styles.navLogoIcon, { backgroundColor: colors.primary }]}>
                <Text style={[styles.navLogoText, { color: colors.primaryForeground }]}>AX</Text>
              </View>
              <Text style={[styles.navLogoName, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>AeraX AI</Text>
            </View>
            <View style={styles.navBtns}>
              <Pressable
                onPress={() => router.push("/(auth)/login")}
                style={({ pressed }) => [styles.navBtnOutline, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={[styles.navBtnText, { color: colors.foreground, fontFamily: "Inter_500Medium" }]}>Sign In</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/(auth)/register")}
                style={({ pressed }) => [styles.navBtnFill, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
              >
                <Text style={[styles.navBtnText, { color: colors.primaryForeground, fontFamily: "Inter_600SemiBold" }]}>Get Started</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.hero, { maxWidth: maxW, alignSelf: "center", width: "100%" }]}>
            <View style={[styles.heroBadge, { backgroundColor: `${colors.primary}18`, borderColor: `${colors.primary}44` }]}>
              <View style={[styles.heroBadgeDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.heroBadgeText, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>Smart AI For Everyone</Text>
            </View>
            <Text style={[styles.heroTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
              Your Advanced{"\n"}
              <Text style={{ color: colors.primary }}>AI Assistant</Text>
            </Text>
            <Text style={[styles.heroSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              AeraX AI gives you 14 powerful AI tools — chat, study, code, write, generate images, and more. All in one place, free to start.
            </Text>
            <View style={styles.heroCtas}>
              <Pressable
                onPress={() => router.push("/(auth)/register")}
                style={({ pressed }) => [styles.ctaPrimary, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
              >
                <Text style={[styles.ctaPrimaryText, { color: colors.primaryForeground, fontFamily: "Inter_700Bold" }]}>Start Free — No Credit Card</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.primaryForeground} />
              </Pressable>
              <Pressable
                onPress={() => router.push("/(auth)/login")}
                style={({ pressed }) => [styles.ctaSecondary, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={[styles.ctaSecondaryText, { color: colors.foreground, fontFamily: "Inter_500Medium" }]}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.section, { maxWidth: maxW, alignSelf: "center", width: "100%" }]}>
          <View style={[styles.sectionBadge, { backgroundColor: `${colors.primary}18`, borderColor: `${colors.primary}44` }]}>
            <Text style={[styles.sectionBadgeText, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>FEATURES</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>Everything You Need</Text>
          <Text style={[styles.sectionSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            14 AI tools covering learning, productivity, business, tech, and media.
          </Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <View
                key={f.title}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    width: colWidth as string | number,
                  },
                ]}
              >
                <View style={[styles.featureIcon, { backgroundColor: `${f.color}22` }]}>
                  <Ionicons name={f.icon} size={24} color={f.color} />
                </View>
                <Text style={[styles.featureTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>{f.title}</Text>
                <Text style={[styles.featureDesc, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.aboutSection, { backgroundColor: colors.card, borderTopColor: colors.border, borderBottomColor: colors.border }]}>
          <View style={[styles.section, { maxWidth: maxW, alignSelf: "center", width: "100%" }]}>
            <View style={[styles.sectionBadge, { backgroundColor: `${colors.primary}18`, borderColor: `${colors.primary}44` }]}>
              <Text style={[styles.sectionBadgeText, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>ABOUT</Text>
            </View>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>What is AeraX AI?</Text>
            <Text style={[styles.aboutText, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}>
              AeraX AI is an advanced AI platform built by Muhammad Razeen, CEO & Founder. The goal is simple: make artificial intelligence simple, useful, and accessible for everyone — students, entrepreneurs, developers, and professionals alike.
            </Text>
            <Text style={[styles.aboutText, { color: colors.foreground, fontFamily: "Inter_400Regular", marginTop: 12 }]}>
              From answering questions to generating images, writing code, assisting with studies, and planning businesses — AeraX AI is the intelligent assistant you need to grow, learn, and succeed.
            </Text>
            <View style={styles.aboutStats}>
              {[
                { value: "14+", label: "AI Tools" },
                { value: "Free", label: "To Start" },
                { value: "24/7", label: "Available" },
              ].map((s) => (
                <View key={s.label} style={[styles.statItem, { borderColor: colors.border }]}>
                  <Text style={[styles.statValue, { color: colors.primary, fontFamily: "Inter_700Bold" }]}>{s.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.section, { maxWidth: maxW, alignSelf: "center", width: "100%" }]}>
          <View style={[styles.sectionBadge, { backgroundColor: `${colors.primary}18`, borderColor: `${colors.primary}44` }]}>
            <Text style={[styles.sectionBadgeText, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>CONTACT</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>Get in Touch</Text>
          <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {[
              { icon: "person-outline" as const, label: "Founder", value: "Muhammad Razeen" },
              { icon: "briefcase-outline" as const, label: "Position", value: "CEO & Founder, AeraX AI" },
              { icon: "mail-outline" as const, label: "Email", value: "muhammadrazeen969@gmail.com" },
              { icon: "globe-outline" as const, label: "Business", value: "inforezocreative123@gmail.com" },
            ].map((item) => (
              <View key={item.label} style={[styles.contactRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.contactIcon, { backgroundColor: `${colors.primary}18` }]}>
                  <Ionicons name={item.icon} size={16} color={colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{item.label}</Text>
                  <Text style={[styles.contactValue, { color: colors.foreground, fontFamily: "Inter_500Medium" }]}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.landingFooter, { borderTopColor: colors.border }]}>
          <View style={styles.navLogo}>
            <View style={[styles.navLogoIcon, { backgroundColor: colors.primary }]}>
              <Text style={[styles.navLogoText, { color: colors.primaryForeground }]}>AX</Text>
            </View>
            <Text style={[styles.navLogoName, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>AeraX AI</Text>
          </View>
          <Text style={[styles.footerTagline, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Smart AI For Everyone · v1.0.0
          </Text>
          <Text style={[styles.footerCopy, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            © 2025 AeraX AI. Founded by Muhammad Razeen.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function IndexScreen() {
  if (IS_WEB) {
    return <LandingPage />;
  }
  return <SplashScreen />;
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: "center", justifyContent: "center" },
  splashContent: { alignItems: "center" },
  splashGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#00b4ff",
    opacity: 0.12,
    top: -40,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 80,
  },
  splashCircle: {
    width: 96,
    height: 96,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 32,
    elevation: 20,
  },
  splashLetter: { fontSize: 36, fontFamily: "Inter_700Bold", color: "#000818", letterSpacing: -1 },
  splashName: { fontSize: 38, fontFamily: "Inter_700Bold", color: "#ffffff", letterSpacing: 2 },
  splashTagline: { fontSize: 15, fontFamily: "Inter_400Regular", marginTop: 10, letterSpacing: 1.5 },
  splashDots: { position: "absolute", bottom: 80, flexDirection: "row", gap: 8 },
  splashDot: { width: 6, height: 6, borderRadius: 3 },

  landingContainer: { flex: 1 },
  landingHeroBg: { paddingBottom: 80, paddingHorizontal: 20 },
  landingNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  navLogo: { flexDirection: "row", alignItems: "center", gap: 10 },
  navLogoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  navLogoText: { fontSize: 14, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  navLogoName: { fontSize: 20 },
  navBtns: { flexDirection: "row", gap: 8, alignItems: "center" },
  navBtnOutline: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  navBtnFill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  navBtnText: { fontSize: 14 },

  hero: { paddingTop: 60, paddingBottom: 20, gap: 20 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3 },
  heroBadgeText: { fontSize: 13 },
  heroTitle: { fontSize: 48, lineHeight: 58 },
  heroSub: { fontSize: 17, lineHeight: 28, maxWidth: 560 },
  heroCtas: { flexDirection: "row", gap: 12, flexWrap: "wrap", marginTop: 8 },
  ctaPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 14,
  },
  ctaPrimaryText: { fontSize: 16 },
  ctaSecondary: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  ctaSecondaryText: { fontSize: 16 },

  section: { paddingHorizontal: 20, paddingVertical: 60, gap: 20 },
  sectionBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  sectionBadgeText: { fontSize: 11, letterSpacing: 1 },
  sectionTitle: { fontSize: 36, lineHeight: 44 },
  sectionSub: { fontSize: 16, lineHeight: 26, maxWidth: 520 },

  featuresGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  featureCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: { fontSize: 17 },
  featureDesc: { fontSize: 14, lineHeight: 22 },

  aboutSection: { borderTopWidth: 1, borderBottomWidth: 1 },
  aboutText: { fontSize: 16, lineHeight: 28 },
  aboutStats: { flexDirection: "row", gap: 0, marginTop: 8 },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    borderRightWidth: 1,
  },
  statValue: { fontSize: 28 },
  statLabel: { fontSize: 13, marginTop: 4 },

  contactCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contactInfo: { gap: 2 },
  contactLabel: { fontSize: 11 },
  contactValue: { fontSize: 14 },

  landingFooter: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    alignItems: "center",
    gap: 12,
  },
  footerTagline: { fontSize: 14 },
  footerCopy: { fontSize: 12 },
});
