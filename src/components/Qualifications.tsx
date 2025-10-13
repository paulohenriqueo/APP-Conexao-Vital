import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../../styles/colors";
import { styles } from "../../styles/styles";

interface QualificationsProps {
  user: {
    role?: "caregiver" | "client";
    qualifications?: string[]; // provisório
  };
}

const Qualifications: React.FC<QualificationsProps> = ({ user }) => {
  const { qualifications = [], role } = user;

  if (qualifications.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={qualiStyles.message}>
          {role === "caregiver"
            ? "Você ainda não adicionou suas qualificações."
            : "Você ainda não adicionou os serviços que precisa."}
        </Text>
      </View>
    );
  }

  return (
    <View style={{...styles.container, marginBottom: 24}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {qualifications.map((q, index) => (
          <View key={index} style={qualiStyles.tag}>
            <Text style={qualiStyles.tagText}>{q}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const qualiStyles = StyleSheet.create({
  tag: { backgroundColor: colors.gray7FD, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  tagText: { fontSize: 14, color: colors.gray23 },
  message: { fontSize: 16, color: colors.gray75 },
});

export default Qualifications;
