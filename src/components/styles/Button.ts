import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { typography } from "../../../styles/typography";

export const styles = StyleSheet.create({
    buttonIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    button: {
        backgroundColor: colors.green382,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.blackShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 4,
    },
    buttonText: {
        ...typography.M01M1624,
        color: colors.whiteFBFE,
    },
    buttonOutilined: {
        backgroundColor: colors.whiteFBFE,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.blackShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 4,
    },
    buttonOutilinedText: {
        ...typography.M01M1624,
        color: colors.green85F,
    },
    googleButton: {
        flexDirection: "row",
        gap: 12,
        backgroundColor: colors.whiteFBFE,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.blackShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 4,
    },
    googleButtonText: {
        ...typography.M01M1624,
        color: colors.gray73,
    },
});
export { typography };