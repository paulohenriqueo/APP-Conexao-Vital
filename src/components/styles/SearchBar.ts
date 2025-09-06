import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { typography } from "../../../styles/typography";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    backgroundColor: colors.gray7FD,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 56,
    shadowColor: colors.blackShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    width: "100%",
    color: colors.gray47,
    ...typography.H01R1624,
  },
  filterButton: {
    marginLeft: 8,
  },
});
