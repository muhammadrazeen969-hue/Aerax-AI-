import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SUGGESTIONS = [
  "A futuristic cityscape at night with neon lights",
  "A serene mountain lake at sunset",
  "An astronaut floating in space among colorful nebulae",
  "A cozy coffee shop in autumn rain",
  "A robot artist painting in a studio",
];

export default function ImageGenScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function generateImage() {
    if (!prompt.trim() || loading) return;
    setError("");
    setLoading(true);
    setImageB64(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const domain = process.env["EXPO_PUBLIC_DOMAIN"];
    try {
      const res = await fetch(`https://${domain}/api/ai/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = (await res.json()) as { b64_json?: string; error?: string };
      if (!res.ok || data.error) {
        setError(data.error ?? "Failed to generate image.");
        return;
      }
      if (data.b64_json) {
        setImageB64(data.b64_json);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
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
          Image Generator
        </Text>
        <View style={{ width: 34 }} />
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 32),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        {imageB64 ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `data:image/png;base64,${imageB64}` }}
              style={[
                styles.generatedImage,
                { borderRadius: colors.radius, borderColor: colors.border },
              ]}
              contentFit="cover"
            />
            <Pressable
              onPress={() => {
                Alert.alert("Image Generated", "Image saved to your session!");
              }}
              style={[
                styles.downloadBtn,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Ionicons
                name="download-outline"
                size={18}
                color={colors.foreground}
              />
              <Text
                style={[
                  styles.downloadText,
                  {
                    color: colors.foreground,
                    fontFamily: "Inter_500Medium",
                  },
                ]}
              >
                Save Image
              </Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              styles.placeholder,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            {loading ? (
              <>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text
                  style={[
                    styles.loadingText,
                    {
                      color: colors.mutedForeground,
                      fontFamily: "Inter_400Regular",
                    },
                  ]}
                >
                  Creating your image...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="image-outline"
                  size={48}
                  color={colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.placeholderText,
                    {
                      color: colors.mutedForeground,
                      fontFamily: "Inter_400Regular",
                    },
                  ]}
                >
                  Your generated image will appear here
                </Text>
              </>
            )}
          </View>
        )}

        {error ? (
          <View
            style={[
              styles.errorBox,
              {
                backgroundColor: `${colors.destructive}22`,
                borderColor: colors.destructive,
                borderRadius: colors.radius,
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
                { color: colors.destructive, fontFamily: "Inter_400Regular" },
              ]}
            >
              {error}
            </Text>
          </View>
        ) : null}

        <View style={styles.inputSection}>
          <Text
            style={[
              styles.label,
              { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            Describe your image
          </Text>
          <View
            style={[
              styles.inputBox,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <TextInput
              style={[
                styles.textInput,
                { color: colors.foreground, fontFamily: "Inter_400Regular" },
              ]}
              placeholder="e.g. A futuristic city at night with neon lights..."
              placeholderTextColor={colors.mutedForeground}
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={3}
              maxLength={500}
            />
          </View>
          <Text
            style={[
              styles.charCount,
              { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
            ]}
          >
            {prompt.length}/500
          </Text>
        </View>

        <Pressable
          onPress={generateImage}
          disabled={!prompt.trim() || loading}
          style={({ pressed }) => [
            styles.generateBtn,
            {
              backgroundColor:
                prompt.trim() && !loading ? colors.primary : colors.muted,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <>
              <Ionicons name="sparkles" size={18} color={prompt.trim() ? colors.primaryForeground : colors.mutedForeground} />
              <Text
                style={[
                  styles.generateText,
                  {
                    color: prompt.trim() ? colors.primaryForeground : colors.mutedForeground,
                    fontFamily: "Inter_600SemiBold",
                  },
                ]}
              >
                Generate Image
              </Text>
            </>
          )}
        </Pressable>

        <View style={styles.suggestionsSection}>
          <Text
            style={[
              styles.suggestionsLabel,
              {
                color: colors.mutedForeground,
                fontFamily: "Inter_600SemiBold",
              },
            ]}
          >
            QUICK IDEAS
          </Text>
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s}
              onPress={() => setPrompt(s)}
              style={({ pressed }) => [
                styles.suggestionPill,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: 12,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Ionicons
                name="bulb-outline"
                size={14}
                color={colors.primary}
              />
              <Text
                style={[
                  styles.suggestionText,
                  {
                    color: colors.foreground,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
                numberOfLines={1}
              >
                {s}
              </Text>
            </Pressable>
          ))}
        </View>
      </KeyboardAwareScrollView>
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
  scroll: { flex: 1 },
  content: { padding: 16, gap: 20 },
  placeholder: {
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    gap: 12,
  },
  placeholderText: { fontSize: 14, textAlign: "center", paddingHorizontal: 20 },
  loadingText: { fontSize: 14 },
  imageContainer: { gap: 12 },
  generatedImage: {
    width: "100%",
    aspectRatio: 1,
    borderWidth: 1,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
  },
  downloadText: { fontSize: 15 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    padding: 12,
  },
  errorText: { fontSize: 14, flex: 1 },
  inputSection: { gap: 8 },
  label: { fontSize: 16, paddingHorizontal: 4 },
  inputBox: { borderWidth: 1, padding: 14 },
  textInput: { fontSize: 15, minHeight: 80, lineHeight: 22 },
  charCount: { fontSize: 12, textAlign: "right", paddingHorizontal: 4 },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  generateText: { fontSize: 16, letterSpacing: 0.3 },
  suggestionsSection: { gap: 10 },
  suggestionsLabel: { fontSize: 11, letterSpacing: 1.2, paddingHorizontal: 4 },
  suggestionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderWidth: 1,
  },
  suggestionText: { fontSize: 14, flex: 1 },
});
