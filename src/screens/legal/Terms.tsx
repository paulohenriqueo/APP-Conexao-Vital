import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { styles, typography } from "../../../styles/styles";
import { colors } from "../../../styles/colors";
import Logo from "../../assets/logo.png";
import { CaretLeft } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import TermsContent from "./TermsContent";

export default function Terms() {

    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, paddingBottom: 24 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
                    <CaretLeft size={24} color={colors.whiteFBFE} weight="bold" />
                </TouchableOpacity>
                <Text style={{ ...typography.M0L2432 }}>Termos de Uso</Text>
            </View>
            <TermsContent />
        </View>
    );
}