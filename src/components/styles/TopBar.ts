import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { typography } from "./Input";

export const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 2,
    paddingTop: 32,
    gap: 8,
    minHeight: 48,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.whiteFBFE,
    shadowColor: colors.blackShadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    justifyContent: "center",
    // justifyContent: "flex-start",
  },
  logoContainer: {
    paddingVertical: 2,
  },
  topBarText: {
    ...typography.M0L2432,
    color: colors.green382,
  },
});