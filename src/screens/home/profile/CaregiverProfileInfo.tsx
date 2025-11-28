import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../../styles/colors";
import { baseTypography, typography } from "../../../../styles/typography";
import { UserProfile } from "../../../types/UserProfile";

type Props = {
  caregiverData?: any;
};

const Section: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.content}>{content}</Text>
  </View>
);

const joinOrNone = (v: any) => {
  if (!v) return "Nenhum item informado";
  if (Array.isArray(v) && v.length > 0) return v.join(", ");
  if (typeof v === "string" && v.trim() !== "") return v;
  return "Nenhum item informado";
};

const CaregiverProfileInfo: React.FC<Props> = ({ caregiverData = {} }) => {
  // normaliza campos que aparecem no seu Firestore
  const experiencia = caregiverData.experiencia ?? caregiverData.experiencias ?? caregiverData.experiences ?? [];
  const qualificacoes = caregiverData.qualificacoes ?? caregiverData.qualifications ?? [];
  const dispoDia = caregiverData.dispoDia ?? caregiverData.dayOptions ?? [];
  const periodo = caregiverData.periodo ?? caregiverData.periodos ?? caregiverData.periodOptions ?? [];
  const publicoAtendido = caregiverData.publicoAtendido ?? caregiverData.caregiverSpecifications?.publicoAtendido ?? [];
  const observacoes = caregiverData.observacoes ?? caregiverData.caregiverSpecifications?.observacoes ?? caregiverData.notes ?? "";

  return (
    <View style={styles.container}>
      <Section title="Experiência" content={joinOrNone(experiencia)} />
      <Section title="Qualificações" content={joinOrNone(qualificacoes)} />
      <Section title="Disponibilidade de dias" content={joinOrNone(dispoDia)} />
      <Section title="Período de atendimento" content={joinOrNone(periodo)} />
      <Section title="Público atendido" content={joinOrNone(publicoAtendido)} />
      <Section title="Observações" content={observacoes ? observacoes : "Nenhuma observação informada"} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 8,
  },
  title: {
    ...baseTypography.montserratMedium,
    fontSize: 16,
    lineHeight: 20,
    color: colors.gray23,
    marginVertical: 6,
  },
  content: {
    ...baseTypography.montserratRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray47,
  },
});

export default CaregiverProfileInfo;
