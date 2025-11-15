import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles as historyStyles } from "./styles/HistoryItem";
import { colors } from "../../styles/colors";
import { styles, typography } from "../../styles/styles";
import { Avatar } from "./Avatar";
import { CircleButton } from "./Button";
import { Check, X } from "phosphor-react-native";

type HistoryItemProps = {
  name: string;
  rating: number;
  city: string;
  date: string;
  careCategory: string;
  imageUrl?: string;
  requestStatus?: "aceita" | "recusada" | "pendente";
  currentProfileType?: "caregiver" | "patient";
  onPress: () => void;
};

export function HistoryItem({
  name,
  careCategory,
  rating,
  city,
  date,
  imageUrl,
  currentProfileType = "caregiver",
  requestStatus = "pendente",
  onPress,
}: HistoryItemProps) {

  let bgColor = colors.grayE8;
  let textColor = colors.gray47;
  let label = "Pendente";

  switch (requestStatus) {
    case "aceita":
      bgColor = colors.greenAcceptBg;
      textColor = colors.greenAccept;
      label = "Aceita";
      break;

    case "recusada":
      bgColor = colors.redc0019;
      textColor = colors.redc00;
      label = "Recusada";
      break;

    default:
      bgColor = colors.grayE8;
      textColor = colors.gray47;
      label = "Pendente";
      break;
  }

  function handleAccept() {
    Alert.alert("Solicitação de contato aceita")
  }

  function handleDecline() {
    Alert.alert("Solicitação de contato recusada")
  }

  return (
    <View style={historyStyles.container}>
      <Avatar name={name} imageUrl={imageUrl} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={historyStyles.name}>{name}</Text>
        <Text style={historyStyles.careCategory}>
          {careCategory}
        </Text>
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

      <View style={[historyStyles.requestStatus, { marginRight: 6, alignSelf: "stretch", gap: 8 }]}>
        {currentProfileType === "caregiver" && requestStatus === "pendente" ? (
          // botões para aceitar ou recusar
          <View style={{ marginRight: 12, gap: 6 }}>
            <CircleButton type="aceitar" onPress={handleAccept} icon={<Check size={20} color={colors.greenAccept} weight="bold"></Check>}></CircleButton>
            <CircleButton type="recusar" onPress={handleDecline} icon={<X size={20} color={colors.redc00} weight="bold"></X>}></CircleButton>
          </View>
        ) : (
          // tag com requestStatus
          <View style={[historyStyles.requestStatusTag, { backgroundColor: bgColor }]}>
            <Text style={[historyStyles.requestStatusText, { color: textColor }]}>{label}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={onPress}>
        <Ionicons name="chevron-forward" size={22} color="#333" />
      </TouchableOpacity>
    </View>
  );
}
