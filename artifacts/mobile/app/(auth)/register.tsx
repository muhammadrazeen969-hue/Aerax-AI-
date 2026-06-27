import { AeraLogo } from "@/components/AeraLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Registration failed");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={["#000000", "#040c1c", "#071630"]}
      style={styles.gradient}
    >
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20),
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 40),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        <View style={styles.header}>
          <AeraLogo size="md" />
        </View>

        <View style={styles.card}>
          <Text
            style={[
              styles.title,
              { color: colors.foreground, fontFamily: "Inter_700Bold" },
            ]}
          >
            Create account
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.mutedForeground,
                fontFamily: "Inter_400Regular",
              },
            ]}
          >
            Join AeraX AI today
          </Text>

          {error ? (
            <View
              style={[
                styles.errorBox,
                {
                  backgroundColor: `${colors.destructive}22`,
                  borderColor: colors.destructive,
                },
              ]}
            >
              <Ionicons
                name="alert-circle"
                size={16}
                color={colors.destructive}
              />
              <Text
                style={[
                  styles.errorText,
                  {
                    color: colors.destructive,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
              >
                {error}
              </Text>
            </View>
          ) : null}

          <View style={styles.fields}>
            {[
              {
                icon: "person-outline" as const,
                placeholder: "Full name",
                value: name,
                onChange: setName,
                secure: false,
                keyboard: "default" as const,
              },
              {
                icon: "mail-outline" as const,
                placeholder: "Email address",
                value: email,
                onChange: setEmail,
                secure: false,
                keyboard: "email-address" as const,
              },
              {
                icon: "lock-closed-outline" as const,
                placeholder: "Password",
                value: password,
                onChange: setPassword,
                secure: !showPassword,
                keyboard: "default" as const,
              },
              {
                icon: "lock-closed-outline" as const,
                placeholder: "Confirm password",
                value: confirm,
                onChange: setConfirm,
                secure: !showPassword,
                keyboard: "default" as const,
              },
            ].map((field, i) => (
              <View
                key={i}
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Ionicons
                  name={field.icon}
                  size={18}
                  color={colors.mutedForeground}
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.foreground,
                      fontFamily: "Inter_400Regular",
                    },
                  ]}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.mutedForeground}
                  value={field.value}
                  onChangeText={field.onChange}
                  secureTextEntry={field.secure}
                  keyboardType={field.keyboard}
                  autoCapitalize={
                    field.keyboard === "email-address" ? "none" : "words"
                  }
                />
                {(i === 2 || i === 3) && (
                  <Pressable onPress={() => setShowPassword((p) => !p)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color={colors.mutedForeground}
                    />
                  </Pressable>
                )}
              </View>
            ))}
          </View>

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={({ pressed }) => [
              styles.btn,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                opacity: loading || pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text
                style={[
                  styles.btnText,
                  {
                    color: colors.primaryForeground,
                    fontFamily: "Inter_600SemiBold",
                  },
                ]}
              >
                Create Account
              </Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                {
                  color: colors.mutedForeground,
                  fontFamily: "Inter_400Regular",
                },
              ]}
            >
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => router.replace("/(auth)/login")}>
              <Text
                style={[
                  styles.footerLink,
                  { color: colors.primary, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    gap: 32,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  card: { gap: 14 },
  title: { fontSize: 28, marginBottom: 2 },
  subtitle: { fontSize: 15, marginBottom: 4 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: { fontSize: 14, flex: 1 },
  fields: { gap: 12 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15 },
  btn: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  btnText: { fontSize: 16, letterSpacing: 0.5 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14 },
});
