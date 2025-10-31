import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { colors } from "../../../../styles/colors";
import { fontWeights, typography } from "../../../../styles/typography";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import ProfileItem from "../../../components/ProfileItem";
import { SignOut } from "phosphor-react-native";
import ProfileInfo from "../../../components/ProfileInfo";
import Qualifications from "../../../components/Qualifications";
import { Avatar } from "../../../components/Avatar";
import { styles } from "../../../../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { CaregiverProfileInfo } from "../../../components/CaregiverProfileInfo";
import { PrimaryButton } from "../../../components/Button";
import { PatientProfileInfo } from "../../../components/PatientProfileInfo";

interface User {
  bio?: string;
  role?: "caregiver" | "client";
  qualifications?: string[];
  rating?: number;
}

interface SectionItem {
  section: string;
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"info" | "qualifications">("info");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const navigation = useNavigation<NavigationProp<any>>();

  // Dados provisórios do usuário
  const user: User = {
    bio: "Cuidador experiente com foco em idosos.",
    role: "caregiver", // agora é do tipo correto
    qualifications: ["Primeiros Socorros", "Cuidador de Idosos"],
    rating: 4.5,
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
  // Cria um array único com todas as seções e itens
  const items: SectionItem[] = [
    { section: "Históricos", title: "Avaliações realizadas", onPress: () => console.log("Completed Reviews") },
    { section: "Históricos", title: "Compra de créditos", onPress: () => console.log("Purchase Credits") },
    { section: "Ajuda e Suporte", title: "Termos de Uso", onPress: () => navigation.navigate("Terms") },
    { section: "Ajuda e Suporte", title: "Política de Privacidade", onPress: () => navigation.navigate("PrivacyPolicy") },
    // Exibe sempre por enquanto
    // Alternativa quando userRole estiver implementado
    // userRole === "caregiver" &&
    { section: "Ajuda e Suporte", title: "Solicitar especializações", onPress: () => navigation.navigate("Specializations") },
    { section: "Ajuda e Suporte", title: "Sair", onPress: handleLogout, icon: <SignOut size={22} color={colors.gray75} weight="bold" />, },

  ].filter(Boolean); // remove itens falsos

  // Cria um array único com todas as seções
  const sections = Array.from(new Set(items.map(item => item.section)));

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "flex-start",
        padding: 4,
        backgroundColor: colors.whiteFBFE,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
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
        <Avatar size={84} name={userName} />
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
          }}
        >
          {userEmail}
        </Text>
        <View style={{ ...styles.ratingContainer }}>
          {Array.from({ length: 5 }).map((_, i) => (
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
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 16,
        }}
      >        
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.green382,
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 8,
            marginRight: 8,
            justifyContent: "center",
          }}
        >
          <Feather name="edit-2" size={18} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontWeight: fontWeights.bold,
              marginLeft: 8,
            }}
          >
            Editar perfil
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            borderColor: colors.green382,
            borderWidth: 1.5,
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 8,
            marginLeft: 8,
            backgroundColor: "#fff",
            justifyContent: "center",
          }}
        >
          <Feather name="repeat" size={18} color={colors.green382} />
          <Text
            style={{
              color: colors.green382,
              fontWeight: fontWeights.bold,
              marginLeft: 8,
            }}
          >
            Alternar conta
          </Text>
        </TouchableOpacity>
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
              ...typography.M01B1418,
              color: activeTab === "info" ? colors.green382 : colors.gray75,
            }}
          >
            Informações gerais
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 8,
            borderBottomWidth: activeTab === "qualifications" ? 2 : 0,
            borderBottomColor: colors.green382,
          }}
          onPress={() => setActiveTab("qualifications")}
        >
          <Text
            style={{
              ...typography.M01B1418,
              color: activeTab === "qualifications" ? colors.green382 : colors.gray75,
            }}
          >
            {user.role === "caregiver" ? "Qualificações" : "Condições" }
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* Conteúdo da aba */}
      {activeTab === "info" && (
        user.role === "caregiver"
          ? (
            // <CaregiverProfileInfo
            //   caregiverData={(user as any)?.caregiverSpecifications ?? {
            //     experiencia: ["Item"],
            //     qualificacoes: ["Item"],
            //     dispoDia: ["Item"],
            //     periodo: ["Item"],
            //     publicoAtendido: ["Item"],
            //     observacoes: "Teste",
            //   }}
            // />
            <PatientProfileInfo patientData={
              (user as any)?.patientSpecifications ?? {
                alergias: ["Pólen", "Amendoim"],
                medicamentos: ["Paracetamol", "Ibuprofeno"],
                condicoes: ["Diabetes", "Hipertensão"],
                idiomasPreferidos: ["Português", "Inglês"],
                observacoes: "Paciente em tratamento contínuo.",
              }
            }
            />
          )
          : (
            // <PatientProfileInfo patientData={
            //   (user as any)?.patientSpecifications ?? {
            //     alergias: ["Pólen", "Amendoim"],
            //     medicamentos: ["Paracetamol", "Ibuprofeno"],
            //     condicoes: ["Diabetes", "Hipertensão"],
            //     idiomasPreferidos: ["Português", "Inglês"],
            //     observacoes: "Paciente em tratamento contínuo.",
            //   }
            // }
            //  />
            <CaregiverProfileInfo
              caregiverData={(user as any)?.caregiverSpecifications ?? {
                experiencia: ["Item"],
                qualificacoes: ["Item"],
                dispoDia: ["Item"],
                periodo: ["Item"],
                publicoAtendido: ["Item"],
                observacoes: "Teste",
              }}
            />
          )
      )}
      {/* {activeTab === "qualifications" && <Qualifications user={user} />} */}

      {/* Seções */}
      {sections.map(section => {
        const sectionItems = items.filter(item => item.section === section);
        return (
          <View key={section} style={{ marginBottom: 24 }}>
            <Text
              style={{
                ...typography.M01B1624,
                marginBottom: 8,
              }}
            >
              {section}
            </Text>
            <View style={{ borderRadius: 12, overflow: "hidden" }}>
              {sectionItems.map((item, index) => (
                <ProfileItem
                  key={index}
                  title={item.title}
                  onPress={item.onPress}
                  showDivider={index !== sectionItems.length - 1}
                  icon={item.icon}
                />
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}