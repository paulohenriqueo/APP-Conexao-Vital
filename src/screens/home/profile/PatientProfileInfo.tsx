import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";

type Props = {
  patientData?: any;
};

const Section: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.content}>{content}</Text>
  </View>
);

export const PatientProfileInfo: React.FC<Props> = ({ patientData = {} }) => {
  // Normaliza nomes possíveis vindos do Firestore
  const alergias = patientData.alergias ?? patientData.allergies ?? [];
  const medicamentos = patientData.medicamentos ?? patientData.medicines ?? [];
  const condicoes = patientData.condicoes ?? patientData.conditions ?? [];
  const idiomas = patientData.idiomasPreferidos ?? patientData.preferredLanguages ?? [];
  const observacoes = patientData.observacoes ?? patientData.observacoes ?? patientData.notes ?? "";

  const renderList = (arr: any[]) =>
    Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "Nenhum item informado";

  return (
    <View style={styles.container}>
      <Section title="Alergias" content={renderList(alergias)} />
      <Section title="Medicamentos" content={renderList(medicamentos)} />
      <Section title="Condições" content={renderList(condicoes)} />
      <Section title="Idiomas Preferidos" content={renderList(idiomas)} />
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

export default PatientProfileInfo;