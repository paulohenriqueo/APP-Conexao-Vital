import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { baseTypography } from "../../styles/typography";


function getInitials(name: string) {
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
  photoURL?: string | null;
};

export function Avatar({ name, size = 60, backgroundColor = "#e0f7fa", textColor = "#00796b", photoURL }: AvatarProps) {
  const initials = getInitials(name);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const hasPhoto =
    photoURL &&
    (photoURL.startsWith("data:image") || photoURL.startsWith("http"));

  const showFallback = !hasPhoto || imageError;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2, backgroundColor, overflow: "hidden" },
      ]}
    >
      {showFallback && <Text style={[styles.text, { color: textColor, fontSize: size * 0.45 }]}>{initials}</Text>}

      {photoURL && !imageError && (
        <Image
          source={{ uri: photoURL?.startsWith("data:image") ? photoURL : `${photoURL}` }}
          style={{ width: size, height: size, borderRadius: size / 2, position: "absolute", resizeMode: "cover" }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  text: { ...baseTypography.montserratLight },
});
