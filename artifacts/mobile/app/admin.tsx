import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text
        style={[
          styles.statValue,
          { color: colors.foreground, fontFamily: "Inter_700Bold" },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.statLabel,
          { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { conversations } = useChat();
  const [userCount, setUserCount] = useState(1);
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.isFounder) {
      router.replace("/(tabs)");
      return;
    }
    AsyncStorage.getItem("aerax_users").then((json) => {
      if (json) {
        const users = JSON.parse(json) as unknown[];
        setUserCount(Math.max(users.length, 1));
      } else {
        AsyncStorage.getItem("aera_users").then((legacyJson) => {
          if (legacyJson) {
            const users = JSON.parse(legacyJson) as unknown[];
            setUserCount(Math.max(users.length, 1));
          }
        });
      }
    });
    AsyncStorage.getItem("aerax_announcements").then((json) => {
      if (json) setAnnouncements(JSON.parse(json) as string[]);
    });
  }, []);

  async function sendAnnouncement() {
    if (!announcement.trim()) return;
    const updated = [announcement.trim(), ...announcements];
    setAnnouncements(updated);
    await AsyncStorage.setItem("aerax_announcements", JSON.stringify(updated));
    setAnnouncement("");
    Alert.alert("Announcement sent", "Your announcement has been published.");
  }

  const totalMessages = conversations.reduce(
    (acc, c) => acc + c.messages.length,
    0
  );

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
        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.headerTitle,
              { color: colors.foreground, fontFamily: "Inter_700Bold" },
            ]}
          >
            Admin Dashboard
          </Text>
          <View
            style={[
              styles.founderBadge,
              { backgroundColor: "#f59e0b22", borderColor: "#f59e0b" },
            ]}
          >
            <Ionicons name="shield-checkmark" size={10} color="#f59e0b" />
            <Text style={[styles.badgeText, { color: "#f59e0b" }]}>
              Founder Access
            </Text>
          </View>
        </View>
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
              { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
            ]}
          >
            CEO & Founder of AeraX AI
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="people-outline"
            label="Total Users"
            value={userCount}
            color="#00b4ff"
          />
          <StatCard
            icon="chatbubbles-outline"
            label="Conversations"
            value={conversations.length}
            color="#7c3aed"
          />
          <StatCard
            icon="chatbubble-outline"
            label="Messages"
            value={totalMessages}
            color="#10b981"
          />
          <StatCard
            icon="star-outline"
            label="Premium Users"
            value={0}
            color="#f59e0b"
          />
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            PLATFORM STATUS
          </Text>
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            {[
              { label: "AI Service", status: "Operational", ok: true },
              { label: "Image Generation", status: "Operational", ok: true },
              { label: "Voice Chat", status: "Operational", ok: true },
              { label: "App Version", status: "1.0.0", ok: true },
            ].map((item) => (
              <View key={item.label} style={styles.statusRow}>
                <Text
                  style={[
                    styles.statusLabel,
                    {
                      color: colors.foreground,
                      fontFamily: "Inter_400Regular",
                    },
                  ]}
                >
                  {item.label}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.ok ? "#10b98122" : "#ef444422" },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: item.ok ? "#10b981" : "#ef4444" },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: item.ok ? "#10b981" : "#ef4444",
                        fontFamily: "Inter_500Medium",
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            ANNOUNCEMENTS
          </Text>
          <View
            style={[
              styles.announceCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <TextInput
              style={[
                styles.announceInput,
                {
                  color: colors.foreground,
                  fontFamily: "Inter_400Regular",
                  borderColor: colors.border,
                },
              ]}
              placeholder="Write an announcement for all users..."
              placeholderTextColor={colors.mutedForeground}
              value={announcement}
              onChangeText={setAnnouncement}
              multiline
              numberOfLines={3}
            />
            <Pressable
              onPress={sendAnnouncement}
              disabled={!announcement.trim()}
              style={({ pressed }) => [
                styles.announceBtn,
                {
                  backgroundColor: announcement.trim()
                    ? colors.primary
                    : colors.muted,
                  borderRadius: 10,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Ionicons
                name="send-outline"
                size={16}
                color={
                  announcement.trim()
                    ? colors.primaryForeground
                    : colors.mutedForeground
                }
              />
              <Text
                style={[
                  styles.announceBtnText,
                  {
                    color: announcement.trim()
                      ? colors.primaryForeground
                      : colors.mutedForeground,
                    fontFamily: "Inter_600SemiBold",
                  },
                ]}
              >
                Send Announcement
              </Text>
            </Pressable>
          </View>

          {announcements.length > 0 && (
            <View style={styles.announceHistory}>
              {announcements.slice(0, 5).map((a, i) => (
                <View
                  key={i}
                  style={[
                    styles.announceItem,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <Ionicons
                    name="megaphone-outline"
                    size={14}
                    color={colors.primary}
                  />
                  <Text
                    style={[
                      styles.announceText,
                      {
                        color: colors.foreground,
                        fontFamily: "Inter_400Regular",
                      },
                    ]}
                  >
                    {a}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            CONTACT
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
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={16} color={colors.primary} />
              <Text
                style={[
                  styles.contactText,
                  {
                    color: colors.foreground,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
              >
                muhammadrazeen969@gmail.com
              </Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons
                name="briefcase-outline"
                size={16}
                color={colors.primary}
              />
              <Text
                style={[
                  styles.contactText,
                  {
                    color: colors.foreground,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
              >
                inforezocreative123@gmail.com
              </Text>
            </View>
          </View>
        </View>
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
  headerCenter: { flex: 1, alignItems: "center", gap: 4 },
  headerTitle: { fontSize: 18 },
  founderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  content: { padding: 16, gap: 20 },
  founderInfo: { alignItems: "center", paddingVertical: 8 },
  founderName: { fontSize: 20 },
  founderTitle: { fontSize: 14, marginTop: 4 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "47%",
    padding: 16,
    borderWidth: 1,
    gap: 8,
    alignItems: "flex-start",
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 24 },
  statLabel: { fontSize: 12 },
  section: { gap: 10 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.2, paddingHorizontal: 4 },
  statusCard: { borderWidth: 1, overflow: "hidden" },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  statusLabel: { fontSize: 14 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12 },
  announceCard: { padding: 14, borderWidth: 1, gap: 12 },
  announceInput: {
    fontSize: 14,
    minHeight: 80,
    lineHeight: 20,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  announceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  announceBtnText: { fontSize: 14 },
  announceHistory: { gap: 8 },
  announceItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderWidth: 1,
  },
  announceText: { fontSize: 13, flex: 1, lineHeight: 18 },
  contactCard: { padding: 16, borderWidth: 1, gap: 12 },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  contactText: { fontSize: 14, flex: 1 },
});
