import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { colors } from "../../../../styles/colors";
import { typography } from "../../../../styles/typography";
import { useNavigation, NavigationProp, useRoute } from "@react-navigation/native";
import { CaretLeft, WhatsappLogo } from "phosphor-react-native";
import { Avatar } from "../../../components/Avatar";
import { Ionicons } from "@expo/vector-icons";
import CaregiverProfileInfo from "./CaregiverProfileInfo";
import { OutlinedButton, PrimaryButton } from "../../../components/Button";
import PatientProfileInfo from "./PatientProfileInfo";
import { openWhatsApp } from "../../../../utils/openWhatsApp";
import { TopBar } from "../../../components/TopBar";

interface User {
    //Dados necessários para exibir perfil de outros usuários
    bio?: string;
    role?: "caregiver" | "patient" | "undefined";
    userContact?: number;
    qualifications?: string[];
    rating?: number;
    imageUrl?: string;
}

export default function ExternalUser() {
    const [userName, setUserName] = useState("");
    const [contactRequested, setContactRequested] = useState(false); // Estado para controlar se o contato foi solicitado
    const [showStars, setShowStars] = useState(false); // Estado para controlar se entrou em contato
    const [rating, setRating] = useState(0);

    const navigation = useNavigation<NavigationProp<any>>();
    const route: any = useRoute();

    // usar userId passado via navegação para carregar usuário externo
    const userIdParam: string | undefined = route.params?.userId;

    const [loading, setLoading] = useState(true);
    const [remoteUser, setRemoteUser] = useState<any>(null);

    // busca os dados do usuário selecionado; se não houver param, tenta exibir currentUser como antes
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const db = getFirestore();
                const auth = getAuth();
                const uid = userIdParam ?? auth.currentUser?.uid;
                if (!uid) {
                    setRemoteUser(null);
                    return;
                }
                const userDocRef = doc(db, "Users", uid);
                const userSnap = await getDoc(userDocRef);
                if (!userSnap.exists()) {
                    setRemoteUser(null);
                    return;
                }
                const data = userSnap.data();
                console.log("ExternalUser: user document data:", data); // debug
                const role =
                    data?.profileType ??
                    (data?.caregiverSpecifications || data?.caregiverProfile ? "caregiver" : data?.patientProfile ? "patient" : "undefined");
                setRemoteUser({
                    id: userSnap.id,
                    name: data?.name ?? data?.displayName ?? "",
                    email: data?.email ?? null,
                    role,
                    // procura phone em vários lugares (root, profiles)
                    phone:
                        data?.phone ??
                        data?.contact ??
                        data?.patientProfile?.phone ??
                        data?.caregiverProfile?.phone ??
                        null,
                    rating: data?.rating ?? 0,
                    imageUrl: data?.photoUrl ?? data?.avatar ?? null,
                    caregiverSpecifications: data?.caregiverSpecifications ?? data?.caregiverProfile ?? null,
                    // merge entre patientProfile (dados pessoais) e condition (dados médicos)
                    patientProfile: {
                        ...(data?.patientProfile ?? {}),
                        ...(data?.condition ?? {}),
                    },
                    bio: data?.bio ?? data?.description ?? "",
                });
            } catch (err) {
                console.warn("Erro ao buscar ExternalUser:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [userIdParam]);

    const ProfileInfoComponent = remoteUser?.role === "caregiver" ? CaregiverProfileInfo : PatientProfileInfo;
    const profileProps =
        remoteUser?.role === "caregiver"
            ? { caregiverData: remoteUser?.caregiverSpecifications ?? {} }
            : { patientData: remoteUser?.patientProfile ?? {} };

    useEffect(() => {
        if (remoteUser) {
            setUserName(remoteUser.name || "");
            setRating(remoteUser.rating ?? 0);
        }
    }, [remoteUser]);

    const renderStar = (starNumber: number) => {

        return (
            <TouchableOpacity key={starNumber} onPress={() => setRating(starNumber)}>
                <Ionicons
                    name={starNumber <= rating ? "star" : "star-outline"} // preenche estrelas anteriores
                    size={20}
                    color={colors.green85F}
                />
            </TouchableOpacity>
        );
    };

    const submitRating = () => {
        if (rating === 0) {
            Alert.alert("Selecione uma avaliação antes de enviar!");
            return;
        }

        // fazer a lógica de envio para o backend
        console.log("Avaliação enviada:", rating);
        Alert.alert("Obrigado pela avaliação!", `Você avaliou com ${rating} estrelas.`);

        // Reset opcional
        setRating(0);
    };

    return (
        <ScrollView
            contentContainerStyle={{
                justifyContent: "center",
                padding: 4,
                backgroundColor: colors.whiteFBFE,
                flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            style={{
                flex: 1,
                width: "100%"
            }}
        >
            <View style={{ position: "absolute", zIndex: 2, width: "100%", top: 0, left: 0 }}>
                <TopBar title="" />
            </View>
            {/* Foto de perfil, nome e estrelas - estilo atualizado para card centralizado */}
            <View style={{ marginHorizontal: 16, marginTop: 90, marginBottom: 12 }}>
                <View
                    style={{
                        backgroundColor: colors.whiteFBFE,
                        borderRadius: 12,
                        paddingTop: 60,
                        paddingVertical: 35,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 6,
                        elevation: 3,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ position: "absolute", left: 12, top: 12, padding: 8 }}
                        accessibilityLabel="Voltar"
                    >
                        <CaretLeft size={24} color={colors.gray73} weight="bold" />
                    </TouchableOpacity>

                    {/* avatar com leve overlap visual */}
                    <View style={{ marginTop: -40, marginBottom: 8 }}>
                        <Avatar size={84} name={userName} imageUrl={remoteUser?.imageUrl} />
                    </View>

                    <Text style={{ ...typography.H01B2024, textAlign: "center", fontWeight: "700" }}>{userName}</Text>
                    <Text style={{ ...typography.H01SB1618, color: colors.gray75, textAlign: "center", fontWeight: "600", marginTop: 4 }}>
                        {remoteUser?.role === "caregiver" ? profileProps.caregiverData?.especialization : profileProps.patientData?.careType}
                    </Text>
                    <View style={{ marginTop: 8 }}>
                        {Array.from({ length: Number(remoteUser?.rating || 0) }).map((_, i) => (
                            <Ionicons key={i} name={i < (remoteUser?.rating ?? 0) ? "star" : "star-outline"} size={20} color={colors.ambar400} />
                        ))}
                    </View>
                </View>
            </View>

            {/* Botão centralizado full-width */}
            <View style={{ width: "100%", alignItems: "center", marginTop: 12, marginBottom: 12 }}>
                <View style={{ width: "92%" }}>
                    {contactRequested ? (
                        <PrimaryButton
                            title="Entrar em contato"
                            onPress={() => {
                                setContactRequested(false);
                                setShowStars(true);
                                if (remoteUser?.phone) {
                                    const firstName = remoteUser.name?.split(" ")[0] || "";
                                    const message = `Olá ${firstName}! Vi seu perfil no Conexão Vital e me interessei pelos seus serviços. Gostaria de saber mais e conversar com você.`;
                                    openWhatsApp(String(remoteUser.phone), message);
                                }
                            }}
                            icon={<WhatsappLogo size={20} color={colors.whiteFBFE} />}
                        />
                    ) : (
                        <OutlinedButton
                            title="Solicitar contato"
                            onPress={() => {
                                setContactRequested(true);
                                Alert.alert("Contato solicitado", "Sua solicitação de contato foi enviada com sucesso!", [{ text: "OK" }]);
                            }}
                            icon={<WhatsappLogo size={20} color={colors.green382} />}
                        />
                    )}
                    {showStars ? (
                        <View
                            style={{
                                flexDirection: "column",
                                alignContent: "center",
                                justifyContent: "center",
                                gap: 12,
                                backgroundColor: colors.grayEF1,
                                paddingVertical: 16,
                                paddingHorizontal: 12,
                                borderRadius: 12,
                                marginTop: 16
                            }}
                        >
                            <Text style={{ textAlign: "center", ...typography.M01R1214 }}>
                                Gostaria de avaliar esse perfil?
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignContent: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                }}
                            >
                                {[1, 2, 3, 4, 5].map((starNumber) => renderStar(starNumber))}
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    submitRating
                                    setShowStars(false)
                                }}
                                disabled={rating === 0}
                                style={{
                                    paddingVertical: 4,
                                    opacity: rating === 0 ? 0.6 : 1,
                                }}
                            >
                                <Text style={{ ...typography.M01R1214, color: colors.green85F, textAlign: "center", fontWeight: "600", textDecorationLine: "underline" }}>
                                    Enviar avaliação
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>
            </View>

            {/* DEBUG: mostrar conteúdo recebido do Firestore (remova depois) */}
            {/* <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
                <Text style={{ fontWeight: "700", marginBottom: 6 }}>DEBUG - patientProfile / condition:</Text>
                <ScrollView horizontal contentContainerStyle={{ paddingRight: 16 }}>
                    <Text style={{ fontFamily: "monospace" }}>
                        {remoteUser ? JSON.stringify(remoteUser.patientProfile ?? remoteUser.raw ?? {}, null, 2) : "remoteUser vazio"}
                    </Text>
                </ScrollView>
            </View> */}

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                    width: "92%",
                    marginHorizontal: "4%",
                    borderBottomWidth: 1,
                    borderBottomColor: colors.grayE8,
                    marginBottom: 8,
                }}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        alignItems: "center",
                        paddingVertical: 8,
                        borderBottomWidth: 2,
                        borderBottomColor: colors.green382,
                    }}>
                    <Text
                        style={{ ...typography.M01B1624, color: colors.green382 }}>
                        Informações {/* gerais */}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Conteúdo */}
            {(ProfileInfoComponent ? <ProfileInfoComponent {...(profileProps as any)} />
                : <Text style={{ color: colors.gray75 }}>Informações não disponíveis</Text>)}
        </ScrollView>
    );
}