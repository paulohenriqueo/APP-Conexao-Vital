import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { typography } from "../../../styles/typography";

export const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: colors.whiteFBFE,
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  navItemText: {
    ...typography.M01SB1214,
    fontWeight: "600",
    color: colors.gray23,
    marginTop: 2,
  },
  navItemTextSelected: {
    color: colors.orange360,
  },
  iconContainer: {
    padding: 4,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerSelected: {
    backgroundColor: colors.orange0EB,
    borderRadius: 64,
  },
});
