import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatReviewDate, getUserReviews } from "../services/userService";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";

export function UserReviews({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);

      const data = await getUserReviews(userId);
      if (active) {
        setReviews(data?.reviews ?? []);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [userId]); // 🔥 IMPORTANTE

  if (loading)
    return (
      <Text
        style={{
          ...typography.M01R1214,
          color: colors.gray75,
          marginTop: 12,
        }}
      >
        Carregando avaliações...
      </Text>
    );

  return (
    <View style={{ marginVertical: 24 }}>
      <Text
        style={{
          ...typography.M01B1624,
          marginBottom: 12,
          color: colors.gray47,
        }}
      >
        Avaliações
      </Text>

      {reviews.length === 0 && (
        <Text style={{ ...typography.M01R1214, color: colors.gray75 }}>
          Nenhuma avaliação ainda
        </Text>
      )}

      {reviews.map((r, index) => (
        <View
          key={index}
          style={{
            marginBottom: 16,
            paddingVertical: 8,
            paddingHorizontal: 10,
            backgroundColor: colors.grayEF1,
            borderRadius: 8,
          }}
        >
          {/* Nome do avaliador */}
          <Text
            style={{
              ...typography.M01B1418,
              color: colors.gray47,
              marginBottom: 4,
            }}
          >
            {r.fromUserName ?? "Usuário"}
          </Text>

          {/* Estrelas */}
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < r.rating ? "star" : "star-outline"}
                size={16}
                color={colors.ambar400}
              />
            ))}
          </View>

          {/* Data formatada */}
          <Text style={{ ...typography.M01R1214, color: colors.gray75 }}>
            {formatReviewDate(r.createdAt)}
          </Text>
        </View>
      ))}
    </View>
  );
}
