import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { colors } from "../../../../styles/colors";
import { typography } from "../../../../styles/typography";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import ProfileItem from "../../../components/ProfileItem";
import { SignOut } from "phosphor-react-native";
import { Avatar } from "../../../components/Avatar";
import { styles } from "../../../../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import CaregiverProfileInfo from "./CaregiverProfileInfo";
import { PrimaryButton } from "../../../components/Button";
import { PatientProfileInfo } from "./PatientProfileInfo";
import { Trash } from "phosphor-react-native";

interface User {
  //Dados necessários para exibir perfil de outros usuários
  userContact?: number;
  especification?: string;
  bio?: string;
  role?: "caregiver" | "client";
  qualifications?: string[];
  rating?: number;
  imageUrl?: string;
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
    role: "caregiver",
    rating: 5, //Avaliação a ser exibida - já incluío na exibição de estrelas
    imageUrl: "https://this-person-does-not-exist.com/img/avatar-gene3d99a090940ff2f92c3cd980b5e61d3.jpg", // Exemplo de URL de imagem
  };

  // Definir o componente de informações do perfil com base na função do usuário
  const ProfileInfoComponent = user.role === "caregiver" ? PatientProfileInfo : CaregiverProfileInfo;

  const profileProps =
    user.role === "caregiver"
      // user.role === "patient" //teste de exibição de dados de paciente
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
          allergies: ["Pólen", "Amendoim"],
          medications: ["Paracetamol", "Ibuprofeno"],
          conditions: ["Diabetes", "Hipertensão"],
          preferredLanguages: ["Português", "Inglês"],
          observations: "Paciente em tratamento contínuo.",
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

  // Delete Account
  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza de que deseja excluir sua conta? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => performDeleteAccount() },
      ]
    );
  };

  function performDeleteAccount(): void {
    throw new Error("Function not implemented.");
  }

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
    { section: "Ajuda e Suporte", title: "redefinir senha", onPress: () => navigation.navigate("NewPassword") },
    { section: "Conta", title: "Sair", onPress: handleLogout, icon: <SignOut size={22} color={colors.gray75} weight="bold" />, },
    { section: "Conta", title: "Deletar", onPress: handleDeleteAccount, icon: <Trash size={22} color={colors.orange360} weight="bold" />, }, //Criar função deletar conta

  ].filter(Boolean); // remove itens falsos

  // Cria um array único com todas as seções
  const sections = Array.from(new Set(items.map(item => item.section)));

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
        padding: 4,
        backgroundColor: colors.whiteFBFE,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, width: "100%" }} // Adicionando estilo para ocupar a largura máxima
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
          }}
        >
          {userEmail}
        </Text>
        <Text
          style={{
            ...typography.H01SB1618,
            color: colors.gray75,
            textAlign: "center",
            fontWeight: "600",
          }}>
          {user.role === "caregiver" ? (profileProps.caregiverData?.especialization) : (profileProps.patientData?.careType)}
          {/* {user.role === "caregiver" ? (profileProps.patientData?.careType) : (profileProps.caregiverData?.especialization)}*/} {/*teste de exibição de dados de paciente */}
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
        }}
      >
        <PrimaryButton
          title="Editar perfil"
          onPress={() => navigation.navigate("EditProfile", { userRole: user.role })}
          icon={<Feather name="edit-2" size={20} color={colors.whiteFBFE} />}
        />
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