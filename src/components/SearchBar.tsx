import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { MagnifyingGlass, FunnelSimple } from "phosphor-react-native";
import { styles } from "./styles/SearchBar";
import { colors } from "../../styles/colors";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onPressFilter?: () => void;
  placeholder?: string;
};

export const SearchBar = ({
  value,
  onChangeText,
  onPressFilter,
  placeholder = "Search...",
}: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <MagnifyingGlass size={20} color={colors.gray47} style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.gray73}
        cursorColor={colors.orange360}
      />

      {onPressFilter && (
        <TouchableOpacity onPress={onPressFilter} style={styles.filterButton}>
          <FunnelSimple size={20} color={colors.gray47} />
        </TouchableOpacity>
      )}
    </View>
  );
};
