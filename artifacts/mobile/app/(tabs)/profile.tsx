import { AeraLogo } from "@/components/AeraLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function MenuItem({
  icon,
  label,
  value,
  onPress,
  danger,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  color?: string;
}) {
  const colors = useColors();
  const accentColor = danger ? colors.destructive : color ?? colors.foreground;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
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
          styles.menuIcon,
          { backgroundColor: `${accentColor}22` },
        ]}
      >
        <Ionicons name={icon} size={20} color={accentColor} />
      </View>
      <Text
        style={[
          styles.menuLabel,
          {
            color: accentColor,
            fontFamily: "Inter_500Medium",
          },
        ]}
      >
        {label}
      </Text>
      {value ? (
        <Text
          style={[
            styles.menuValue,
            {
              color: colors.mutedForeground,
              fontFamily: "Inter_400Regular",
            },
          ]}
        >
          {value}
        </Text>
      ) : null}
      <Ionicons
        name="chevron-forward"
        size={16}
        color={colors.mutedForeground}
      />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { conversations } = useChat();

  function handleLogout() {
    Alert.alert("Sign out?", "You will need to sign in again.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop:
            insets.top + (Platform.OS === "web" ? 67 : 12),
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 32),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.userCard}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: colors.primary, borderRadius: 36 },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              { color: colors.primaryForeground, fontFamily: "Inter_700Bold" },
            ]}
          >
            {initial}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.userName,
                { color: colors.foreground, fontFamily: "Inter_700Bold" },
              ]}
              numberOfLines={1}
            >
              {user?.name ?? "User"}
            </Text>
            {user?.isFounder && (
              <View
                style={[
                  styles.founderBadge,
                  {
                    backgroundColor: "#f59e0b22",
                    borderColor: "#f59e0b",
                  },
                ]}
              >
                <Ionicons name="star" size={10} color="#f59e0b" />
                <Text
                  style={[
                    styles.badgeText,
                    { color: "#f59e0b", fontFamily: "Inter_600SemiBold" },
                  ]}
                >
                  Founder
                </Text>
              </View>
            )}
            {user?.isPremium && !user?.isFounder && (
              <View
                style={[
                  styles.founderBadge,
                  {
                    backgroundColor: `${colors.primary}22`,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Ionicons name="diamond" size={10} color={colors.primary} />
                <Text
                  style={[
                    styles.badgeText,
                    { color: colors.primary, fontFamily: "Inter_600SemiBold" },
                  ]}
                >
                  Premium
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.userEmail,
              {
                color: colors.mutedForeground,
                fontFamily: "Inter_400Regular",
              },
            ]}
            numberOfLines={1}
          >
            {user?.email}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.statsRow,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        {[
          { label: "Conversations", value: conversations.length.toString() },
          {
            label: "Messages",
            value: conversations
              .reduce((acc, c) => acc + c.messages.length, 0)
              .toString(),
          },
          { label: "Status", value: user?.isFounder ? "Founder" : user?.isPremium ? "Premium" : "Free" },
        ].map((stat, i) => (
          <View
            key={stat.label}
            style={[
              styles.statItem,
              i < 2 && {
                borderRightWidth: 1,
                borderRightColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statValue,
                { color: colors.foreground, fontFamily: "Inter_700Bold" },
              ]}
            >
              {stat.value}
            </Text>
            <Text
              style={[
                styles.statLabel,
                {
                  color: colors.mutedForeground,
                  fontFamily: "Inter_400Regular",
                },
              ]}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text
          style={[
            styles.sectionLabel,
            { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" },
          ]}
        >
          ACCOUNT
        </Text>
        <MenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() => router.push("/settings")}
        />
        <MenuItem
          icon="information-circle-outline"
          label="About AeraX AI"
          onPress={() => router.push("/about")}
        />
        <MenuItem
          icon="person-circle-outline"
          label="About the Founder"
          onPress={() => router.push("/founder")}
        />
        {!user?.isPremium && (
          <MenuItem
            icon="diamond-outline"
            label="Upgrade to Premium"
            color={colors.primary}
            onPress={() =>
              Alert.alert(
                "Premium",
                "Unlimited messages, faster responses, advanced AI, and more. Coming soon!"
              )
            }
          />
        )}
      </View>

      {user?.isFounder && (
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              {
                color: colors.mutedForeground,
                fontFamily: "Inter_600SemiBold",
              },
            ]}
          >
            FOUNDER
          </Text>
          <MenuItem
            icon="shield-checkmark-outline"
            label="Admin Dashboard"
            color="#f59e0b"
            onPress={() => router.push("/admin")}
          />
        </View>
      )}

      <View style={styles.section}>
        <MenuItem
          icon="log-out-outline"
          label="Sign Out"
          danger
          onPress={handleLogout}
        />
      </View>

      <View style={styles.footer}>
        <AeraLogo size="sm" />
        <Text
          style={[
            styles.footerText,
            {
              color: colors.mutedForeground,
              fontFamily: "Inter_400Regular",
            },
          ]}
        >
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 20 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 32 },
  userInfo: { flex: 1, gap: 4 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  userName: { fontSize: 22 },
  founderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeText: { fontSize: 11 },
  userEmail: { fontSize: 14 },
  statsRow: {
    flexDirection: "row",
    borderWidth: 1,
    overflow: "hidden",
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 16, gap: 4 },
  statValue: { fontSize: 22 },
  statLabel: { fontSize: 12 },
  section: { gap: 10 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.2, paddingHorizontal: 4 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  menuLabel: { flex: 1, fontSize: 15 },
  menuValue: { fontSize: 14 },
  footer: {
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
  },
  footerText: { fontSize: 12 },
});
