import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9ff",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  careCategory: {
    fontSize: 13,
    lineHeight: 14,
    fontWeight: "600",
    color: colors.gray75,
  }
});
