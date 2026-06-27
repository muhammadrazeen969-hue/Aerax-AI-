import { useColors } from "@/hooks/useColors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AeraLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export function AeraLogo({ size = "md", showTagline = false }: AeraLogoProps) {
  const colors = useColors();

  const sizes = {
    sm: { circle: 36, letter: 16, name: 18, tagline: 11, gap: 8 },
    md: { circle: 52, letter: 22, name: 24, tagline: 13, gap: 12 },
    lg: { circle: 80, letter: 33, name: 34, tagline: 16, gap: 16 },
  };

  const s = sizes[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.circle,
          {
            width: s.circle,
            height: s.circle,
            borderRadius: s.circle * 0.28,
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
          },
        ]}
      >
        <Text
          style={[
            styles.letter,
            { fontSize: s.letter, color: colors.primaryForeground },
          ]}
        >
          AX
        </Text>
      </View>
      <View style={{ marginLeft: s.gap }}>
        <Text
          style={[
            styles.name,
            { fontSize: s.name, color: colors.foreground },
          ]}
        >
          AeraX AI
        </Text>
        {showTagline && (
          <Text
            style={[
              styles.tagline,
              { fontSize: s.tagline, color: colors.mutedForeground },
            ]}
          >
            Smart AI For Everyone
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  letter: {
    fontFamily: "Inter_700Bold",
    includeFontPadding: false,
    letterSpacing: -0.5,
  },
  name: {
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  tagline: {
    fontFamily: "Inter_400Regular",
    marginTop: 1,
    letterSpacing: 0.3,
  },
});
