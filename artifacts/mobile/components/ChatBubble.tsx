import { useColors } from "@/hooks/useColors";
import type { Message } from "@/contexts/ChatContext";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface ChatBubbleProps {
  message: Message;
  isTyping?: boolean;
}

function TypingDots({ color }: { color: string }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -5,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(600),
        ])
      );

    const a1 = bounce(dot1, 0);
    const a2 = bounce(dot2, 180);
    const a3 = bounce(dot3, 360);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.dotsRow}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: color, transform: [{ translateY: dot }] },
          ]}
        />
      ))}
    </View>
  );
}

export function ChatBubble({ message, isTyping }: ChatBubbleProps) {
  const colors = useColors();
  const isUser = message.role === "user";
  const showTyping = isTyping && !isUser && message.content === "";

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text
            style={[styles.avatarText, { color: colors.primaryForeground }]}
          >
            A
          </Text>
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: colors.primary }]
            : [
                styles.assistantBubble,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ],
          { borderRadius: colors.radius },
        ]}
      >
        {showTyping ? (
          <TypingDots color={colors.mutedForeground} />
        ) : (
          <Text
            style={[
              styles.text,
              {
                color: isUser ? colors.primaryForeground : colors.foreground,
                fontFamily: "Inter_400Regular",
              },
            ]}
            selectable
          >
            {message.content}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 6,
    paddingHorizontal: 16,
    maxWidth: "100%",
  },
  userContainer: { justifyContent: "flex-end" },
  assistantContainer: { justifyContent: "flex-start", alignItems: "flex-start" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginTop: 2,
    flexShrink: 0,
  },
  avatarText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {},
  assistantBubble: { borderWidth: 1 },
  text: { fontSize: 15, lineHeight: 22 },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
