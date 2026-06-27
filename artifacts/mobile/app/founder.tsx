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

const FUTURE_VISION = [
  "Expand AeraX AI into a trusted AI platform used by people worldwide.",
  "Build innovative technology products that solve real-world problems.",
  "Establish successful businesses in technology, consulting, and digital services.",
  "Inspire young people to pursue entrepreneurship and continuous learning.",
  "Create opportunities that help individuals and businesses grow.",
];

const BUSINESS_GOALS = [
  "Grow AeraX AI into a leading technology platform.",
  "Launch Rezo Creative as a professional digital marketing and social media management company.",
  "Establish Vomaxic Business Consultant as a business consulting and growth advisory company.",
  "Build organizations that provide value, innovation, and positive impact.",
];

const PERSONAL_VALUES = [
  { icon: "flash-outline" as const, label: "Hard Work" },
  { icon: "book-outline" as const, label: "Continuous Learning" },
  { icon: "shield-checkmark-outline" as const, label: "Integrity" },
  { icon: "bulb-outline" as const, label: "Innovation" },
  { icon: "heart-outline" as const, label: "Helping Others" },
  { icon: "trophy-outline" as const, label: "Leadership" },
];

export default function FounderScreen() {
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
          About the Founder
        </Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 32) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.primary,
              borderRadius: colors.radius,
            },
          ]}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primary, borderRadius: 40 },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                { color: colors.primaryForeground, fontFamily: "Inter_700Bold" },
              ]}
            >
              MR
            </Text>
          </View>
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
              { color: colors.primary, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            CEO & Founder of AeraX AI
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={colors.mutedForeground}
              />
              <Text
                style={[
                  styles.metaText,
                  {
                    color: colors.mutedForeground,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
              >
                Age 17 · Born 10 March 2009
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons
                name="location-outline"
                size={14}
                color={colors.mutedForeground}
              />
              <Text
                style={[
                  styles.metaText,
                  {
                    color: colors.mutedForeground,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
              >
                Kanyarakodi, Uppinangady, Karnataka, India
              </Text>
            </View>
          </View>
        </View>

        {/* Biography */}
        <Section title="Biography" colors={colors}>
          <Text
            style={[
              styles.bodyText,
              { color: colors.foreground, fontFamily: "Inter_400Regular" },
            ]}
          >
            Muhammad Razeen is a young entrepreneur and the founder of AeraX AI.
            From an early age, he developed a strong interest in technology,
            business, and innovation. He founded AeraX AI with the vision of
            creating intelligent solutions that help people learn, grow, and
            solve problems more efficiently.
          </Text>
          <Text
            style={[
              styles.bodyText,
              {
                color: colors.foreground,
                fontFamily: "Inter_400Regular",
                marginTop: 10,
              },
            ]}
          >
            His goal is to make artificial intelligence simple, useful, and
            accessible for everyone. He believes technology should empower people
            and create opportunities regardless of their background.
          </Text>
          <Text
            style={[
              styles.bodyText,
              {
                color: colors.foreground,
                fontFamily: "Inter_400Regular",
                marginTop: 10,
              },
            ]}
          >
            Muhammad Razeen is currently pursuing his education in Commerce and
            plans to continue his academic journey through B.Com, MBA, and CMA
            USA. Alongside his studies, he aims to build successful businesses
            and contribute positively to society.
          </Text>
        </Section>

        {/* Future Vision */}
        <Section title="Future Vision" colors={colors}>
          {FUTURE_VISION.map((item, i) => (
            <BulletRow key={i} text={item} color={colors.primary} colors={colors} />
          ))}
        </Section>

        {/* Business Goals */}
        <Section title="Future Business Goals" colors={colors}>
          {BUSINESS_GOALS.map((item, i) => (
            <BulletRow key={i} text={item} color={colors.accent} colors={colors} />
          ))}
        </Section>

        {/* Personal Values */}
        <Section title="Personal Values" colors={colors}>
          <View style={styles.valuesGrid}>
            {PERSONAL_VALUES.map((v) => (
              <View
                key={v.label}
                style={[
                  styles.valueChip,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: 12,
                  },
                ]}
              >
                <Ionicons name={v.icon} size={18} color={colors.primary} />
                <Text
                  style={[
                    styles.valueLabel,
                    { color: colors.foreground, fontFamily: "Inter_500Medium" },
                  ]}
                >
                  {v.label}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Founder Message */}
        <Section title="Founder Message" colors={colors}>
          <View
            style={[
              styles.quoteCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.primary,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={colors.primary}
              style={{ marginBottom: 10 }}
            />
            <Text
              style={[
                styles.quoteText,
                { color: colors.foreground, fontFamily: "Inter_400Regular" },
              ]}
            >
              "I believe that success is not determined by where you start, but
              by your dedication, hard work, and willingness to learn. Every
              person has the potential to achieve great things through
              persistence, discipline, and a positive mindset."
            </Text>
          </View>
        </Section>

        {/* Founder Motto */}
        <View
          style={[
            styles.mottoCard,
            {
              backgroundColor: colors.primary + "18",
              borderColor: colors.primary + "44",
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text
            style={[
              styles.mottoLabel,
              { color: colors.primary, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            Founder Motto
          </Text>
          <Text
            style={[
              styles.mottoText,
              { color: colors.foreground, fontFamily: "Inter_700Bold" },
            ]}
          >
            "Dream big, work consistently, and let your actions create your
            future."
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.section}>
      <View style={[styles.sectionAccent, { backgroundColor: colors.primary }]} />
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.foreground, fontFamily: "Inter_700Bold" },
        ]}
      >
        {title}
      </Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function BulletRow({
  text,
  color,
  colors,
}: {
  text: string;
  color: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.bulletRow}>
      <View style={[styles.bulletDot, { backgroundColor: color }]} />
      <Text
        style={[
          styles.bodyText,
          { color: colors.foreground, fontFamily: "Inter_400Regular", flex: 1 },
        ]}
      >
        {text}
      </Text>
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

  heroCard: {
    alignItems: "center",
    padding: 24,
    borderWidth: 1.5,
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  avatarText: { fontSize: 28 },
  founderName: { fontSize: 24, textAlign: "center" },
  founderTitle: { fontSize: 14, textAlign: "center" },
  metaRow: { marginTop: 8, gap: 6, width: "100%" },
  metaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  metaText: { fontSize: 13, lineHeight: 18, flex: 1 },

  section: { gap: 0 },
  sectionAccent: {
    width: 36,
    height: 3,
    borderRadius: 2,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 20, marginBottom: 12 },
  sectionBody: { gap: 8 },

  bodyText: { fontSize: 15, lineHeight: 24 },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 9,
    flexShrink: 0,
  },

  valuesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  valueChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  valueLabel: { fontSize: 14 },

  quoteCard: {
    padding: 20,
    borderWidth: 1.5,
    borderLeftWidth: 3,
  },
  quoteText: { fontSize: 15, lineHeight: 26, fontStyle: "italic" },

  mottoCard: {
    padding: 20,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
  },
  mottoLabel: { fontSize: 12, letterSpacing: 1, textTransform: "uppercase" },
  mottoText: { fontSize: 16, lineHeight: 26, textAlign: "center", fontStyle: "italic" },
});
