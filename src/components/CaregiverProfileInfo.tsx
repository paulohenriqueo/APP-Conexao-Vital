import React from "react";
import { View, Text } from "react-native";
import { colors, typography } from "../../styles/styles";

type CaregiverProfileInfoProps = {
  caregiverData: {
    experiencia?: string[];
    qualificacoes?: string[];
    dispoDia?: string[];
    periodo?: string[];
    publicoAtendido?: string[];
    observacoes?: string;
  };
};

export function CaregiverProfileInfo({ caregiverData }: CaregiverProfileInfoProps) {
  const {
    experiencia = [],
    dispoDia = [],
    periodo = [],
    publicoAtendido = [],
    observacoes = "",
  } = caregiverData || {};

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
      {/* Experiência */}
      <Text style={[typography.montserratSemiBold, { fontSize: 16 }]}>Experiência</Text>
      {renderPills(experiencia)}

      {/* Disponibilidade */}
      <Text style={[typography.montserratSemiBold, { fontSize: 16, marginTop: 16 }]}>
        Disponibilidade de dias
      </Text>
      {renderPills(dispoDia)}

      {/* Período */}
      <Text style={[typography.montserratSemiBold, { fontSize: 16, marginTop: 16 }]}>
        Período de atendimento
      </Text>
      {renderPills(periodo)}

      {/* Público atendido */}
      <Text style={[typography.montserratSemiBold, { fontSize: 16, marginTop: 16 }]}>
        Público atendido
      </Text>
      {renderPills(publicoAtendido)}

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
