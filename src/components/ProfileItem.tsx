import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { CaretRight, SignOut } from "phosphor-react-native";
import { colors } from "../../styles/colors";
import { typography } from "./styles/Input";

interface ProfileItemProps {
  title: string;
  onPress?: () => void;
  showDivider?: boolean;
  icon?: React.ReactNode;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ title, onPress, showDivider = true, icon }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
      {icon ? icon : <CaretRight size={22} color={colors.gray75} weight="bold" />}
      {showDivider && <View style={styles.divider} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: colors.gray7FD,
  },
  text: {
    ...typography.H01R1624,
    color: colors.gray23,
  },
  divider: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 0,
    height: 1,
    backgroundColor: colors.grayE8,
  },
});

export default ProfileItem;
