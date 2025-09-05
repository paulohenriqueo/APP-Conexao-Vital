import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  completeModal: {
    backgroundColor: colors.whiteFBFE,
    padding: 32,
    gap: 24,
    borderRadius: 28,
    width: "85%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: colors.gray19,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 8,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.green85F,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.green85F,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.green85F,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.whiteFBFE,
  }
  //passar estilizações dos botões para Button
});
