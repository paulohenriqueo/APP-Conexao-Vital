import { TextStyle } from "react-native";
import { colors } from "./colors";

export const fontWeights = {
    regular: "400" as TextStyle["fontWeight"],
    medium: "500" as TextStyle["fontWeight"],
    semibold: "600" as TextStyle["fontWeight"],
    bold: "700" as TextStyle["fontWeight"],
    light: "300" as TextStyle["fontWeight"],
};

export const baseTypography = {
    montserratRegular: { fontFamily: 'Montserrat_400Regular', letterSpacing: 0.1 },
    montserratMedium: { fontFamily: 'Montserrat_500Medium', letterSpacing: 0.1 },
    montserratSemibold: { fontFamily: 'Montserrat_600SemiBold', letterSpacing: 0.1 },
    montserratBold: { fontFamily: 'Montserrat_700Bold', letterSpacing: 0.1 },
    montserratLight: { fontFamily: 'Montserrat_300Light', letterSpacing: 0 },
    hindRegular: { fontFamily: 'Hind_400Regular', letterSpacing: 0.1 },
};

export const typography: Record<string, TextStyle> = {
    // Hind
    // ===== Regular =====
    H01R1624: {
        ...baseTypography.hindRegular,
        fontSize: 16,
        lineHeight: 24,
        color: colors.gray47,
    },

    // Montserrat
    // ===== Regular =====
    M01R1012: {
        ...baseTypography.montserratRegular,
        fontSize: 10,
        lineHeight: 12,
        color: colors.gray47,
    },
    M01R1014U: {
        ...baseTypography.montserratRegular,
        fontSize: 10,
        lineHeight: 14,
        color: colors.darkGreen116,
        textDecorationLine: "underline",
    },
    M01R1418: {
        ...baseTypography.montserratRegular,
        fontSize: 14,
        lineHeight: 18,
        color: colors.gray23,
    },
    M01R1624: {
        ...baseTypography.montserratRegular,
        fontSize: 16,
        lineHeight: 24,
        color: colors.gray14,
    },

    // ===== Bold =====
    M01B1418: {
        ...baseTypography.montserratBold,
        fontSize: 14,
        lineHeight: 18,
        color: colors.green85F,
    },

    // ===== SemiBold =====
    M01SB1214: {
        ...baseTypography.montserratSemibold,
        fontSize: 12,
        lineHeight: 14,
    },

    // ===== Medium =====
    M01M1012: {
        ...baseTypography.montserratMedium,
        fontSize: 10,
        lineHeight: 12,
        color: colors.green85F,
    },
    M01M1624: {
        ...baseTypography.montserratMedium,
        fontSize: 16,
        lineHeight: 24,
        color: colors.gray73,
    },

    // ===== Light (spacing 0%) =====
    M0L2432: {
        ...baseTypography.montserratLight,
        fontSize: 24,
        lineHeight: 32,
        color: colors.whiteFBFE,
    },
    M0L3644: {
        ...baseTypography.montserratLight,
        fontSize: 36,
        lineHeight: 44,
        color: colors.whiteFBFE,
        justifyContent: "center",
        textAlign: "center",
    },
};