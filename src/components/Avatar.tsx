import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { baseTypography } from "../../styles/typography";

// Função para gerar até 2 iniciais
function getInitials(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

type AvatarProps = {
  name: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  imageUrl?: string | null; // agora aceita imagem opcional
};

export function Avatar({
  name,
  size = 60,
  backgroundColor = "#e0f7fa",
  textColor = "#00796b",
  imageUrl,
}: AvatarProps) {
  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          overflow: "hidden", // importante para imagem circular
        },
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            resizeMode: "cover",
          }}
        />
      ) : (
        <Text style={[styles.text, { color: textColor, fontSize: size * 0.45 }]}>
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    ...baseTypography.montserratLight,
  },
});
