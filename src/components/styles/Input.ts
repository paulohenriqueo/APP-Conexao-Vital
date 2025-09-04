import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { typography } from "../../../styles/typography";

export const styles = StyleSheet.create({
    input: {
        ...typography.M01R1418,
        backgroundColor: colors.gray7FD,
        shadowColor: colors.blackShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
        minHeight: 40,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        color: colors.gray47,
        width: "100%",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.gray7FD,
        borderRadius: 8,
        width: "100%",
        minHeight: 40,
        paddingTop: 4,
        paddingHorizontal: 16,
        shadowColor: colors.blackShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    passwordInput: {
        ...typography.M01R1418,
        color: colors.gray47,
        width: "100%",
    },
    iconButton: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 12,
        padding: 0,
        margin: 0,
    },
});
export { typography };
