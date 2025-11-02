import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { colors } from "../../../../styles/colors";
import { typography } from "../../../../styles/typography";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import ProfileItem from "../../../components/ProfileItem";
import { CaretLeft, SignOut, WhatsappLogo } from "phosphor-react-native";
import { Avatar } from "../../../components/Avatar";
import { styles } from "../../../../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { CaregiverProfileInfo } from "../../../components/CaregiverProfileInfo";
import { OutlinedButton, PrimaryButton } from "../../../components/Button";
import { PatientProfileInfo } from "../../../components/PatientProfileInfo";
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

    const navigation = useNavigation<NavigationProp<any>>();
    const [contactRequested, setContactRequested] = useState(false); // Estado para controlar se o contato foi solicitado

    // Dados provisórios do usuário
    const user: User = {
        bio: "Cuidador experiente com foco em idosos.",
        role: "caregiver",
        userContact: 11999999999,
        rating: 5, //Avaliação a ser exibida - já incluío na exibição de estrelas
        imageUrl: "https://this-person-does-not-exist.com/img/avatar-gene3d99a090940ff2f92c3cd980b5e61d3.jpg", // Exemplo de URL de imagem
    };

    // Definir o componente de informações do perfil com base na função do usuário
    const ProfileInfoComponent = user.role === "caregiver" ? CaregiverProfileInfo : PatientProfileInfo;

    const profileProps =
        user.role === "caregiver"
            ? {
                caregiverData: (user as any)?.caregiverSpecifications ?? {
                    especialization: "Cuidador de Idosos",
                    experiencia: [],
                    qualificacoes: [],
                    dispoDia: [],
                    periodo: [],
                    publicoAtendido: [],
                    observacoes: "",
                },
            }
            : {
                patientData: (user as any)?.patientSpecifications ?? {
                    careType: "Cuidados Domiciliares",
                    alergias: ["Pólen", "Amendoim"],
                    medicamentos: ["Paracetamol", "Ibuprofeno"],
                    condicoes: ["Diabetes", "Hipertensão"],
                    idiomasPreferidos: ["Português", "Inglês"],
                    observacoes: "Paciente em tratamento contínuo.",
                },
            };

    // Buscar email e nome do usuário
    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) setUserEmail(currentUser.email || "");
    }, []);

    useEffect(() => {
        const fetchUserName = async () => {
            const auth = getAuth();
            const db = getFirestore();
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userDocRef = doc(db, "Users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) setUserName(userDoc.data().name || "");
            }
        };
        fetchUserName();
    }, []);

    // Logout
    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            Alert.alert("Logout", "Você saiu da sua conta com sucesso!", [{ text: "OK" }]);
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        } catch (error) {
            console.error("Erro ao deslogar:", error);
            alert("Ocorreu um erro ao deslogar. Tente novamente.");
        }
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
            {/* Foto de perfil, nome e estrelas */}
            <View
                style={{
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: colors.gray7FD,
                    borderRadius: 16,
                    paddingVertical: 16,
                    marginBottom: 16,
                    gap: 4,
                }}
            >
                <TouchableOpacity 
                onPress={() => navigation.navigate("Home")} //trocar para goBack quando estiver voltando corretamente para a tela anterior (home/pesquisa/histórico) 
                style={{
                    padding: 8, position: "absolute", top: 8, left: 8
                }}>
                    <CaretLeft size={24} color={colors.gray73} weight="bold" accessibilityLabel="Voltar" />
                </TouchableOpacity>
                <Avatar
                    size={84}
                    name={userName}
                    imageUrl={user.imageUrl} // exibe a foto, se houver
                />
                <Text
                    style={{
                        ...typography.H01B2024,
                        marginTop: 8,
                        textAlign: "center",
                        fontWeight: "700",
                    }}
                >
                    {userName}
                </Text>
                <Text
                    style={{
                        ...typography.H01SB1618,
                        color: colors.gray75,
                        textAlign: "center",
                        fontWeight: "600",
                    }}>
                    {user.role === "caregiver" ? (profileProps.caregiverData?.especialization) : (profileProps.patientData.careType)}
                </Text>
                <View style={{ ...styles.ratingContainer }}>
                    {Array.from({ length: Number(user.rating) }).map((_, i) => (
                        <Ionicons
                            key={i}
                            name={i < (user.rating || 0) ? "star" : "star-outline"}
                            size={20}
                            color={colors.ambar400}
                        />
                    ))}
                </View>
            </View>

            {/* Botões */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                    marginBottom: 16,
                    flexWrap: "wrap",
                    gap: 8,
                }}
            >
                {contactRequested ? (
                    <PrimaryButton
                        title="Entrar em contato"
                        onPress={() => {
                            console.log('Redirecionado pelo WhatsApp para o número:', user.userContact)
                            setContactRequested(false);
                            openWhatsApp(String(user.userContact), 'Olá! Vi seu perfil e gostaria de conversar.')
                        }}
                        icon={<WhatsappLogo size={20} color={colors.whiteFBFE} />}
                    />
                ) : (
                    <OutlinedButton
                        title="Solicitar contato"
                        onPress={() => {
                            console.log('Solicitar contato pressionado')
                            setContactRequested(true);
                            Alert.alert("Contato solicitado", "Sua solicitação de contato foi enviada com sucesso!", [{ text: "OK" }]); //alterar para algo que indique que já pode entrar em contato?
                        }}
                        icon={<WhatsappLogo size={20} color={colors.green382} />}
                    />
                )}
            </View>

            {/* Abas */}
            <View
                style={{
                    flexDirection: "row",
                    width: "100%",
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
            {activeTab === "info" && (
                ProfileInfoComponent ? (
                    // renderiza apenas se o componente não for undefined
                    <ProfileInfoComponent {...(profileProps as any)} />
                ) : (
                    // fallback e log para debugar
                    <View>
                        <Text style={{ color: colors.gray75 }}>Profile component not available</Text>
                        console.warn("Profile component is undefined for role:", user.role);
                    </View>
                )
            )}
        </ScrollView>
    );
}