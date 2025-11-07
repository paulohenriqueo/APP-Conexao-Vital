import React from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors } from "../../styles/colors"; // ajuste o caminho conforme sua estrutura
import { careCategories } from "../../utils/careCategories"; // ajuste o caminho conforme o projeto

type Props = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  label: string;
};

export default function CareCategoryPicker({ selectedValue, onValueChange, label }: Props) {
  return (
    <View
      style={{
        backgroundColor: colors.gray7FD,
        borderRadius: 8,
        borderWidth: 0,
        overflow: "hidden",
        marginTop: 8,
        marginBottom: 8,
      }}
    >
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={{
          height: 58,
          color: selectedValue ? colors.gray23 : colors.gray75,
          paddingLeft: 8,
        }}
        dropdownIconColor={colors.gray75}
      >
        <Picker.Item
          label={`Selecione ${label.toLowerCase()}`}
          value=""
          color={colors.gray75}
        />
        {careCategories.map((category: string) => (
          <Picker.Item key={category} label={category} value={category} />
        ))}
      </Picker>
    </View>
  );
}
