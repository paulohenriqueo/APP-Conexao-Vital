import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";

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
  const experiencia = caregiverData.experiencia ?? caregiverData.experience ?? [];
  const qualificacoes = caregiverData.qualificacoes ?? caregiverData.qualifications ?? [];
  const dispoDia = caregiverData.dispoDia ?? caregiverData.dispoDia ?? [];
  const dispoHora = caregiverData.dispoHora ?? caregiverData.dispoHora ?? [];
  const periodo = caregiverData.periodo ?? caregiverData.periodos ?? [];
  const publicoAtendido = caregiverData.publicoAtendido ?? caregiverData.publicoAtendido ?? [];
  const observacoes = caregiverData.observacoes ?? caregiverData.notes ?? "";

  return (
    <View style={styles.container}>
      <Section title="Experiência" content={joinOrNone(experiencia)} />
      <Section title="Qualificações" content={joinOrNone(qualificacoes)} />
      <Section title="Disponibilidade (dias)" content={joinOrNone(dispoDia)} />
      <Section title="Disponibilidade (horário)" content={joinOrNone(dispoHora)} />
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
    marginBottom: 18,
  },
  title: {
    ...typography.H02B1820,
    color: colors.black000,
    marginBottom: 6,
  },
  content: {
    ...typography.M01R1214,
    color: colors.gray75,
  },
});

export default CaregiverProfileInfo;
