import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  color?: string;
  onPress?: () => void;
  compact?: boolean;
}

export function FeatureCard({
  icon,
  label,
  description,
  color,
  onPress,
  compact = false,
}: FeatureCardProps) {
  const colors = useColors();
  const accentColor = color ?? colors.primary;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        compact && styles.compact,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${accentColor}22`, borderRadius: 12 },
        ]}
      >
        <Ionicons name={icon} size={compact ? 20 : 24} color={accentColor} />
      </View>
      <Text
        style={[
          styles.label,
          { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
          compact && styles.compactLabel,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {!compact && description && (
        <Text
          style={[
            styles.description,
            { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
          ]}
          numberOfLines={2}
        >
          {description}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  compact: {
    padding: 12,
    gap: 8,
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
  },
  compactLabel: {
    fontSize: 13,
    textAlign: "center",
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});
