import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { colors } from "../../../../styles/colors";
import { typography } from "../../../../styles/typography";
import { useNavigation, NavigationProp, useRoute } from "@react-navigation/native";
import ProfileItem from "../../../components/ProfileItem";
import { CaretLeft, SignOut, WhatsappLogo } from "phosphor-react-native";
import { Avatar } from "../../../components/Avatar";
import { styles } from "../../../../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import CaregiverProfileInfo from "./CaregiverProfileInfo";
import { OutlinedButton, PrimaryButton } from "../../../components/Button";
import PatientProfileInfo from "./PatientProfileInfo";
import { openWhatsApp } from "../../../../utils/openWhatsApp";
import Home from "../Home";

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
    const [activeTab, setActiveTab] = useState<"info" | "qualifications">("info");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
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

    // nome e email agora vêm de remoteUser (carregado acima)
    useEffect(() => {
        if (remoteUser) {
            setUserName(remoteUser.name || "");
            setUserEmail(remoteUser.email || "");
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
            {/* Foto de perfil, nome e estrelas - estilo atualizado para card centralizado */}
            <View style={{ marginHorizontal: 16, marginTop: 46, marginBottom: 12 }}>
                <View
                    style={{
                        backgroundColor: colors.whiteFBFE,
                        borderRadius: 12,
                        paddingTop: 80,
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
                        {Array.from({ length: Number(remoteUser?.rating ?? 0) }).map((_, i) => (
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
                                if (remoteUser?.phone) openWhatsApp(String(remoteUser.phone), "Olá! Vi seu perfil e gostaria de conversar.");
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

            {/* Abas */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                    width: "87%",
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
                        borderBottomWidth: activeTab === "info" ? 2 : 0,
                        borderBottomColor: colors.green382,
                    }}
                    onPress={() => setActiveTab("info")}
                >
                    <Text
                        style={{
                            ...typography.M01B1624,
                            color: activeTab === "info" ? colors.green382 : colors.gray75,
                        }}
                    >
                        Informações {/* gerais */}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Conteúdo da aba */}
            {activeTab === "info" &&
                (ProfileInfoComponent ? <ProfileInfoComponent {...(profileProps as any)} /> : <Text style={{ color: colors.gray75 }}>Informações não disponíveis</Text>)}
        </ScrollView>
    );
}