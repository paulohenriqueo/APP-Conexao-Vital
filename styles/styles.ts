import { StyleSheet, TextInput } from "react-native";
import { colors } from "./colors";
import { typography } from "./typography";
import { scale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
    /* Base */
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: colors.whiteFBFE,
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0,
    },
    boxTop: {
        paddingTop: scale(48),
        paddingBottom: scale(100),
        gap: 0,
        width: "100%",
        backgroundColor: colors.green382,
        alignItems: "center",
    },
    containerBox: {
        backgroundColor: colors.whiteFBFE,
        shadowColor: "#000000",
        shadowOpacity: 0.16,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        paddingHorizontal: 20,
        paddingVertical: 28,
        marginTop: scale(-66),
        marginBottom: 16,
        width: "87%",
        borderRadius: 24,
        gap: 16,
    },
    boxBottom: {
        width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: scale(48),
        marginTop: 16,
    },
    dividerContainer: {
        flexDirection: "row",
        textAlignVertical: "center",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        height: 18,
    },
    dividerText: {
        ...typography.M01R1418,
        color: colors.gray75,
        alignItems: "center",
        textAlignVertical: "center",
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: colors.grayE8,
    },
    /* Login */
    logoLogin: {
        width: 120,
        height: 120,
        resizeMode: "contain",
    },
    /* Termos e Politica */
    subtitle: {
        ...typography.M01M1624,
        color: colors.darkGreen116,
        marginBottom: 8,
    },
    paragraph: {
        ...typography.H01R1624,
        textAlign: "justify",
        marginBottom: 16
    },
    header: {
        width: "100%",
        backgroundColor: colors.green382,
        flexDirection: "row",
        paddingTop: 36,
        paddingBottom: 8,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 8,
        marginBottom: 12,
    },
    contentArea: {
        flex: 1,
        padding: 16,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    contentText: {
        ...typography.H01R1624,
    },
    subtitleText: {
        ...typography.M01M1824,
    },
    ratingContainer: {
        flexDirection: "row",
        marginVertical: 4,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    tag: {
        backgroundColor: "#d1f5e0",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 6,
        marginTop: 4,
    },
    tagText: {
        color: "#00796b",
        fontSize: 12,
    },
    principalRole: {
        fontSize: 12,
        lineHeight: 14,
        fontWeight: "500",
        color: colors.gray75,
    }
});
export { typography, colors };
