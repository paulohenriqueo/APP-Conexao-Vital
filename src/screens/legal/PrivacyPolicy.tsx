import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { styles, typography } from "../../../styles/styles";
import Logo from "../../assets/logo.png";
import { CaretLeft } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../styles/colors";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

export default function PrivacyPolicy() {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, paddingBottom: 24 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
                    <CaretLeft size={24} color={colors.whiteFBFE} weight="bold" />
                </TouchableOpacity>
                <Text style={{ ...typography.M0L2432 }}>Política de Privacidade</Text>
            </View>
            <PrivacyPolicyContent />
        </View>
    );
}
