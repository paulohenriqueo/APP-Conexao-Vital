import React from "react";
import { View, Text } from "react-native";
import { colors, typography } from "../../styles/styles";

type PatientProfileInfoProps = {
  patientData: {
    alergias?: string[];
    medicamentos?: string[];
    condicoes?: string[];
    idiomasPreferidos?: string[];
    observacoes?: string;
  };
};

export function PatientProfileInfo({ patientData }: PatientProfileInfoProps) {
  const {
    alergias = [],
    medicamentos = [],
    condicoes = [],
    idiomasPreferidos = [],
    observacoes = "",
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
      <Text style={[typography.montserratSemiBold, { fontSize: 16 }]}>Alergias</Text>
      {renderPills(alergias)}

      {/* Medicamentos */}
      <Text style={[typography.montserratSemiBold, { fontSize: 16, marginTop: 16 }]}>
        Medicamentos
      </Text>
      {renderPills(medicamentos)}

      {/* Condições */}
      <Text style={[typography.montserratSemiBold, { fontSize: 16, marginTop: 16 }]}>
        Condições
      </Text>
      {renderPills(condicoes)}

      {/* Idiomas Preferidos */}
      <Text style={[typography.montserratSemiBold, { fontSize: 16, marginTop: 16 }]}>
        Idiomas Preferidos
      </Text>
      {renderPills(idiomasPreferidos)}

      {/* Observações */}
      <Text style={[typography.montserratSemiBold, { fontSize: 16, marginTop: 16 }]}>
        Observações
      </Text>
      <Text style={{ color: colors.gray23, marginTop: 8, marginBottom: 16 }}>
        {observacoes || "Nenhuma observação informada"}
      </Text>
    </View>
  );
}