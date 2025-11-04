import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../styles/styles";
import { profileTypography as typography } from "../../styles/typography";

type CaregiverProfileInfoProps = {
  caregiverData: {
    especialization?: string; //exibir para melhor identificação da especialização do cuidador no histórico
    experience?: string[];
    qualifications?: string[];
    availableDays?: string[];
    period?: string[];
    targetAudience?: string[];
    observations?: string;
  };
};

export function CaregiverProfileInfo({ caregiverData }: CaregiverProfileInfoProps) {
  //atualizar de acordo com banco de dados
  const {
    experience  = [],
    qualifications = [],
    availableDays = [],
    period = [],
    targetAudience = [],
    observations = "",
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
      <Text style={[typography.ProfileInfoTitle, {marginTop: 0}]}>Experiência</Text>
      {renderPills(experience)}

      {/* Qualificações */}
      <Text style={[typography.ProfileInfoTitle]}>Qualificações</Text>
      {renderPills(qualifications)}

      {/* Disponibilidade */}
      <Text style={[typography.ProfileInfoTitle]}>
        Disponibilidade de dias
      </Text>
      {renderPills(availableDays)}

      {/* Período */}
      <Text style={[typography.ProfileInfoTitle]}>
        Período de atendimento
      </Text>
      {renderPills(period)}

      {/* Público atendido */}
      <Text style={[typography.ProfileInfoTitle]}>
        Público atendido
      </Text>
      {renderPills(targetAudience)}

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
