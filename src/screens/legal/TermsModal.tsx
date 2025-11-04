// TermsModal.tsx
import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Dimensions } from "react-native";
import TermsContent from "./TermsContent";
import PrivacyPolicyContent from "./PrivacyPolicyContent";
import { colors } from "../../../styles/colors";
import { PrimaryButton, SecondaryButton } from "../../components/Button";
import { popUpStyles as styles } from "../model/PopUpStyles"

type TermsModalProps = {
    visible: boolean;
    onClose: () => void;
    onAccept: () => void;
};

export default function TermsModal({ visible, onClose, onAccept }: TermsModalProps) {
    const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
    const [termsScrolledToEnd, setTermsScrolledToEnd] = useState(false);

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={[styles.box, { overflow: "hidden", height: "90%" }]}>
                    {/* Tabs */}
                    <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.grayEF1 }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                padding: 12,
                                alignItems: "center",
                                borderBottomWidth: activeTab === "terms" ? 2 : 0, borderBottomColor: activeTab === "terms" ? colors.green85F : "transparent",
                                alignContent: "center"
                            }}
                            onPress={() => setActiveTab("terms")}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: activeTab === "terms" ? colors.green85F : colors.gray23,
                                fontWeight: activeTab === "terms" ? "700" : "400",
                                justifyContent: "center",
                                textAlign: "center"
                            }}>Termos de Uso</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                padding: 12,
                                alignItems: "center",
                                borderBottomWidth: activeTab === "privacy" ? 2 : 0,
                                borderBottomColor: activeTab === "privacy" ? colors.green85F : "transparent",
                                alignContent: "center"
                            }}
                            onPress={() => setActiveTab("privacy")}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: activeTab === "privacy" ? colors.green85F : colors.gray23,
                                fontWeight: activeTab === "privacy" ? "700" : "400",
                                justifyContent: "center",
                                textAlign: "center"
                            }}>Política de Privacidade</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Conteúdo */}
                    <View style={{ flex: 1, paddingVertical: 12 }}>
                        {activeTab === "terms" ? (
                            <TermsContent onScrolledToEnd={() => setTermsScrolledToEnd(true)} />
                        ) : (
                            <PrivacyPolicyContent />
                        )}
                    </View>

                    {/* Botões na parte inferior */}
                    <View style={{
                        paddingVertical: 16,
                        paddingHorizontal: 12,
                        borderTopWidth: 1,
                        borderTopColor: colors.grayEF1,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        width: "100%",
                        gap: 8
                    }}>
                        {/* Botão Li e Aceito só habilitado se scroll no Terms estiver completo */}
                        {activeTab === "terms" ? (
                            <PrimaryButton
                                title="Li e Aceito"
                                onPress={onAccept}
                                disabled={!termsScrolledToEnd}
                            />
                        ) : null}
                        {/* Botão Voltar sempre disponível */}
                        <SecondaryButton onPress={onClose} title="Voltar"></SecondaryButton>
                    </View>
                </View>
            </View>
        </Modal>
    );
}