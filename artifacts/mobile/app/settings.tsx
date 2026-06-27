import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function SettingRow({
  icon,
  label,
  value,
  onPress,
  toggle,
  toggleValue,
  onToggle,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  danger?: boolean;
}) {
  const colors = useColors();
  const iconColor = danger ? colors.destructive : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={toggle}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed && !toggle ? 0.8 : 1,
        },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: `${iconColor}22` }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text
        style={[
          styles.rowLabel,
          {
            color: danger ? colors.destructive : colors.foreground,
            fontFamily: "Inter_500Medium",
          },
        ]}
      >
        {label}
      </Text>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={(v) => {
            onToggle?.(v);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          trackColor={{ false: colors.muted, true: colors.primary }}
          thumbColor="#ffffff"
        />
      ) : value ? (
        <Text
          style={[
            styles.rowValue,
            { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
          ]}
        >
          {value}
        </Text>
      ) : (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.mutedForeground}
        />
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name ?? "");

  async function saveName() {
    if (!newName.trim()) return;
    await updateUser({ name: newName.trim() });
    setEditingName(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
          Settings
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
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            PROFILE
          </Text>

          {editingName ? (
            <View
              style={[
                styles.editRow,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.nameInput,
                  {
                    color: colors.foreground,
                    borderColor: colors.border,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
                value={newName}
                onChangeText={setNewName}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={saveName}
              />
              <Pressable
                onPress={saveName}
                style={[
                  styles.saveBtn,
                  { backgroundColor: colors.primary, borderRadius: 8 },
                ]}
              >
                <Text
                  style={[
                    styles.saveBtnText,
                    {
                      color: colors.primaryForeground,
                      fontFamily: "Inter_600SemiBold",
                    },
                  ]}
                >
                  Save
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setEditingName(false);
                  setNewName(user?.name ?? "");
                }}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={colors.mutedForeground}
                />
              </Pressable>
            </View>
          ) : (
            <SettingRow
              icon="person-outline"
              label="Display Name"
              value={user?.name ?? "—"}
              onPress={() => setEditingName(true)}
            />
          )}
          <SettingRow
            icon="mail-outline"
            label="Email"
            value={user?.email ?? "—"}
          />
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            PREFERENCES
          </Text>
          <SettingRow
            icon="notifications-outline"
            label="Notifications"
            toggle
            toggleValue={notifications}
            onToggle={setNotifications}
          />
          <SettingRow
            icon="volume-high-outline"
            label="Sound Effects"
            toggle
            toggleValue={soundEnabled}
            onToggle={setSoundEnabled}
          />
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            SUPPORT
          </Text>
          <SettingRow
            icon="mail-outline"
            label="Contact Support"
            onPress={() =>
              Alert.alert(
                "Contact Support",
                "Email: muhammadrazeen969@gmail.com\nBusiness: inforezocreative123@gmail.com"
              )
            }
          />
          <SettingRow
            icon="information-circle-outline"
            label="About AeraX AI"
            onPress={() => router.push("/about")}
          />
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
  headerTitle: { fontSize: 18, flex: 1, textAlign: "center" },
  content: { padding: 16, gap: 20 },
  section: { gap: 10 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.2, paddingHorizontal: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowLabel: { flex: 1, fontSize: 15 },
  rowValue: { fontSize: 14 },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    gap: 10,
  },
  nameInput: { flex: 1, fontSize: 15, borderBottomWidth: 1, paddingBottom: 4 },
  saveBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  saveBtnText: { fontSize: 14 },
});
