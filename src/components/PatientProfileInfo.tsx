import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../styles/styles";
import { profileTypography as typography } from "../../styles/typography";

type PatientProfileInfoProps = {
  //atualizar de acordo com banco de dados
  patientData: {
    careType?: string; //exibir para melhor identificação do tipo de paciente no histórico
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    preferredLanguages?: string[];
    observations?: string;
  };
};

export function PatientProfileInfo({ patientData }: PatientProfileInfoProps) {
  const {
    allergies = [],
    medications = [],
    conditions = [],
    preferredLanguages = [],
    observations = "",
  } = patientData || {};

  const renderPills = (items: string[]) => (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
      {items.length > 0 ? (
        items.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: colors.greenOpacity,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={{ color: colors.green85F, fontWeight: "600" }}>{item}</Text>
          </View>
        ))
      ) : (
        <Text style={{ color: colors.gray73 }}>Nenhum item informado</Text>
      )}
    </View>
  );

  return (
    <View style={{ padding: 4, marginTop: 0 }}>
      {/* Alergias */}
      <Text style={[typography.ProfileInfoTitle]}>Alergias</Text>
      {renderPills(allergies)}

      {/* Medicamentos */}
      <Text style={[typography.ProfileInfoTitle]}>
        Medicamentos
      </Text>
      {renderPills(medications)}

      {/* Condições */}
      <Text style={[typography.ProfileInfoTitle]}>
        Condições
      </Text>
      {renderPills(conditions)}

      {/* Idiomas Preferidos */}
      <Text style={[typography.ProfileInfoTitle]}>
        Idiomas Preferidos
      </Text>
      {renderPills(preferredLanguages)}

      {/* Observações */}
      <Text style={[typography.ProfileInfoTitle]}>
        Observações
      </Text>
      <Text style={[typography.ProfileInfoText]}>
        {observations ? observations : <Text style={{ color: colors.gray73 }}>Nenhuma observação informada</Text>}
      </Text>
    </View>
  );
}