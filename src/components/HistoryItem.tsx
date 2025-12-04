import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles as historyStyles } from "./styles/HistoryItem";
import { colors } from "../../styles/colors";
import { styles } from "../../styles/styles";
import { Avatar } from "./Avatar";
import { CircleButton } from "./Button";
import { Check, X } from "phosphor-react-native";
import { collection, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig"; // ajuste o caminho conforme seu projeto

type HistoryItemProps = {
  name: string;
  rating: number;
  date: string;
  careCategory: string;
  imageUrl?: string;
  requestStatus?:  "accepted" | "declined" | "pending" | undefined;
  currentProfileType?: "caregiver" | "patient";
  onPress: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
};

export function HistoryItem({
  name,
  careCategory,
  rating,
  date,
  imageUrl,
  currentProfileType = "caregiver",
  requestStatus,
  onPress,
  onAccept,
  onDecline,
}: HistoryItemProps) {

  let bgColor;
  let textColor;
  let label;

  switch (requestStatus) {
    case "accepted":
      bgColor = colors.greenAcceptBg;
      textColor = colors.greenAccept;
      label = "Aceito";
      break;

    case "declined":
      bgColor = colors.redc0019;
      textColor = colors.redc00;
      label = "Recusado";
      break;

    case "pending":
      bgColor = colors.grayE8;
      textColor = colors.gray47;
      label = "Pendente";
      break;
  }

  return (
    <View style={historyStyles.container}>
      <Avatar name={name} photoURL={imageUrl} />

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={historyStyles.name}>{name}</Text>
        <Text style={historyStyles.careCategory}>{careCategory}</Text>

        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < rating ? "star" : "star-outline"}
              size={14}
              color={colors.ambar400}
            />
          ))}
        </View>

        <Text style={historyStyles.date}>{date}</Text>
      </View>

      <View style={[historyStyles.requestStatus, { marginRight: 6, marginLeft: 2, gap: 8 }]}>
        {currentProfileType === "caregiver" && requestStatus === "pending" ? (
          <View style={{ marginRight: 12, gap: 6 }}>
            <CircleButton
              type="accepted"
              onPress={() => onAccept?.()}
              icon={<Check size={20} color={colors.greenAccept} weight="bold" />}
            />
            <CircleButton
              type="declined"
              onPress={() => onDecline?.()}
              icon={<X size={20} color={colors.redc00} weight="bold" />}
            />
          </View>
        ) : (
          <View style={[historyStyles.requestStatusTag, { backgroundColor: bgColor }]}>
            <Text style={[historyStyles.requestStatusText, { color: textColor }]}>
              {label}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={onPress}>
        <Ionicons name="chevron-forward" size={22} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

// Exemplo de função para buscar histórico de solicitações
export async function getSolicitationsHistory(userId: string) {
  const col = collection(FIRESTORE_DB, "Solicitations"); // ou o nome da sua coleção
  const snapshot = await getDocs(col);

  return snapshot.docs
    .filter((doc: { data: () => { (): any; new(): any; userId: string; }; }) => doc.data().userId === userId) // ajuste o filtro conforme sua estrutura
    .map((doc: { data: () => any; id: any; }) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        rating: data.rating,
        date: data.date,
        careCategory: data.careCategory,
        imageUrl: data.imageUrl,
        requestStatus: data.requestStatus, // <-- aqui vem 'accepted', 'declined' ou 'pending'
        currentProfileType: data.currentProfileType,
      };
    });
}
