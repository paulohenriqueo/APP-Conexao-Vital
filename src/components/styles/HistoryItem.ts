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
  date: {
    fontSize: 12,
    color: "#555",
  },
  careCategory: {
    fontSize: 13,
    lineHeight: 14,
    fontWeight: "600",
    color: colors.gray75,
  },
  requestStatus: {
    flexDirection: "column",
    alignContent: "flex-end",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: 8,
  },
  requestStatusTag: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 1,
  },
  requestStatusText: {
    fontSize: 14,
    fontWeight: 600,
  }
});
