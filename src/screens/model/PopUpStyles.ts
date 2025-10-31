import { TextStyle } from "react-native";
import { colors } from "../../../styles/colors";
import { baseTypography } from "../../../styles/typography";

export const popUpStyles: Record<string, TextStyle> = {
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },
    box: {
        width: "84%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
    },
    row: {
        flexDirection: "row", 
        width: "100%", 
        justifyContent: "space-between", 
        gap: 8,
    },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 8, textAlign: "center" },
    message: { fontSize: 16, color: "#444", marginBottom: 18, textAlign: "center" },
    skip: { marginTop: 24, marginBottom: 4 },
    skipText: {
        color: colors.gray73,
        textDecorationLine: "underline",
        fontSize: 16,
        ...baseTypography.montserratRegular,
    },
};