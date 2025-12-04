import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { deleteUser, getAuth, signOut } from "firebase/auth";
import { deleteDoc, getFirestore, doc, getDoc } from "firebase/firestore";
import { colors } from "../../../../styles/colors";
import { baseTypography, typography } from "../../../../styles/typography";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import ProfileItem from "../../../components/ProfileItem";
import { SignOut } from "phosphor-react-native";
import { Avatar } from "../../../components/Avatar";
import { styles } from "../../../../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import CaregiverProfileInfo from "./CaregiverProfileInfo";
import { PrimaryButton, SecondaryButton } from "../../../components/Button";
import { PatientProfileInfo } from "./PatientProfileInfo";
import { Trash } from "phosphor-react-native";
import { getCurrentUserType } from "../../../services/userService";
import PopUpFormsModel from "../../model/PopUpFormsModel";


interface User {
  //Dados necessários para exibir perfil de outros usuários
  userContact?: number;
  careCategory?: string;
  bio?: string;
  role?: string | null;
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
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [userCareCategory, setUserCareCategory] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [currentProfileType, setCurrentProfileType] = useState<string | null>(null);
  const [showSelect, setShowSelect] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const navigation = useNavigation<NavigationProp<any>>();

  // Definir o componente de informações do perfil com base na função do usuário
  const ProfileInfoComponent = currentProfileType === "caregiver" ? CaregiverProfileInfo : PatientProfileInfo;

  const profileProps =
    currentProfileType?.toLowerCase() === "caregiver"
      ? {
        caregiverData: userData?.caregiverSpecifications ?? {
          experiencia: [],
          qualificacoes: [],
          dispoDia: [],
          periodo: [],
          publicoAtendido: [],
          idioma: [],
          observacoes: "",
        },
      }
      : {
        patientData: userData?.condition ?? {
          alergias: [],
          medicamentos: [],
          condicoes: [],
          periodo: [],
          idiomasPreferidos: [],
          observacoes: "",
        },
      };

  useEffect(() => {
    if (!userData) return;

    if (userData.city && userData.state) {
      setUserLocation(`${userData.city} | ${userData.state}`);
    } else if (userData.city) {
      setUserLocation(userData.city);
    } else if (userData.state) {
      setUserLocation(userData.state);
    } else {
      setUserLocation("");
    }
  }, [userData]);

  // Buscar email, nome e foto
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

  useEffect(() => {
    const fetchUserCareCategory = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) setUserCareCategory(userDoc.data().careCategory || "");
      }
    };
    fetchUserCareCategory();
  }, []);

  useEffect(() => {
    const fetchUserPhoto = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();

          const photoURL =
            data?.caregiverProfile?.photo ??
            data?.patientProfile?.photo ??
            null;

          setPhoto(photoURL);
        }
      }
    };

    fetchUserPhoto();
  }, []);

  useEffect(() => {
    const fetchUserRating = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const avgRating =
            data?.rating ?? 0;
          setRating(avgRating);
        }
      }
    };

    fetchUserRating();
  }, []);

  useEffect(() => {
    // carrega tipo do usuário e dados do perfil
    (async () => {
      try {
        const type = await getCurrentUserType();
        setCurrentProfileType(type);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  const fetchUserData = async () => {
    const auth = getAuth();
    const db = getFirestore();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const ref = doc(db, "Users", currentUser.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setUserData(snap.data());
      console.log("Dados do usuário carregados:", snap.data());
    } else {
      console.warn("Documento de usuário não encontrado.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

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

  const performDeleteAccount = async () => {
    try {
      const auth = getAuth();
      const db = getFirestore();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert("Erro", "Nenhum usuário encontrado.");
        console.warn("DEBUG: tentativa de exclusão sem usuário autenticado");
        return;
      }

      console.log("DEBUG: iniciando exclusão de conta para o usuário:", {
        uid: currentUser.uid,
        email: currentUser.email,
      });

      // Deleta o documento do Firestore
      await deleteDoc(doc(db, "Users", currentUser.uid));
      console.log("DEBUG: documento do Firestore excluído com sucesso:", currentUser.uid);

      // Deleta o usuário do Authentication
      await deleteUser(currentUser);
      console.log("DEBUG: usuário removido do Firebase Authentication:", {
        uid: currentUser.uid,
        email: currentUser.email,
      });

      Alert.alert("Conta excluída", "Sua conta foi removida com sucesso.");
      console.log("DEBUG: exclusão de conta concluída e alerta exibido.");

      // Redireciona para tela de login
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      console.log("DEBUG: redirecionado para a tela de login.");

    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);

      if (error.code === "auth/requires-recent-login") {
        Alert.alert(
          "Sessão expirada",
          "Por segurança, é necessário fazer login novamente antes de excluir a conta.",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
        console.warn("DEBUG: erro auth/requires-recent-login — redirecionando para login.");
      } else {
        Alert.alert("Erro", "Não foi possível excluir a conta. Tente novamente mais tarde.");
      }
    }
  };

  // Cria um array único com todas as seções e itens
  const items: SectionItem[] = [
    { section: "Históricos", title: "Avaliações recebidas", onPress: () => navigation.navigate("ReceivedReviews") },
    {
      section: "Históricos", title: "Compra de créditos", onPress: () => Alert.alert(
        "Em breve",
        "Essa funcionalidade ainda será implementada.", [
        { text: "OK", style: "default" },
      ])
    },
    { section: "Ajuda e Suporte", title: "Termos de Uso", onPress: () => navigation.navigate("Terms") },
    { section: "Ajuda e Suporte", title: "Política de Privacidade", onPress: () => navigation.navigate("PrivacyPolicy") },
    { section: "Ajuda e Suporte", title: "Alterar senha", onPress: () => navigation.navigate("NewPassword") },
    { section: "Conta", title: "Sair", onPress: handleLogout, icon: <SignOut size={22} color={colors.gray75} weight="bold" />, },
    { section: "Conta", title: "Deletar", onPress: handleDeleteAccount, icon: <Trash size={22} color={colors.orange360} weight="bold" />, },

  ].filter(Boolean); // remove itens falsos

  // Cria um array único com todas as seções
  const sections = Array.from(new Set(items.map(item => item.section)));

  const handleOpenSelectModal = () => {
    setShowSelect(true);
  };

  const handleSelectPatient = async () => {
    setCurrentProfileType("patient");
    setShowSelect(false);
    navigation.navigate("PatientForms");
  };

  const handleSelectCaregiver = async () => {
    setCurrentProfileType("caregiver");
    setShowSelect(false);
    navigation.navigate("CaregiverForms");
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
          photoURL={photo}
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
          {userData?.careCategory ?? userData?.caregiverSpecifications?.careCategory ?? userData?.condition?.careCategory ?? "Categoria não informada"}
        </Text>
        <Text
          style={{
            ...baseTypography.hindSemiBold,
            fontSize: 14,
            lineHeight: 16,
            color: colors.gray75,
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {userEmail}
        </Text>
        {userLocation ?
          <Text
            style={{
              ...baseTypography.hindSemiBold,
              fontSize: 14,
              lineHeight: 16,
              color: colors.gray75,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {userLocation}
          </Text>
          : null}
        <View style={{ ...styles.ratingContainer }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < rating ? "star" : "star-outline"}
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
          onPress={() => {
            currentProfileType
              ? navigation.navigate("EditProfile", { currentProfileType })
              : Alert.alert("Ops!", "Parece que seu perfil ainda não está completo. Complete-o para poder editar suas informações.")
          }}
          icon={<Feather name="edit-2" size={20} color={colors.whiteFBFE} />}
        />
      </View>

      {/* Aba de informações do perfil */}
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: colors.grayE8,
          marginBottom: 8,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 8,
            borderBottomWidth: 2,
            borderBottomColor: colors.green382,
          }}>
          <Text style={{ ...typography.M01B1624, color: colors.green382 }}>Informações</Text>
        </View>
      </View>

      {/* Conteúdo */}
      {currentProfileType && ProfileInfoComponent ? (
        // renderiza apenas se o componente não for undefined
        <ProfileInfoComponent {...(profileProps as any)} />
      ) : (
        <View style={{ paddingHorizontal: 16, paddingVertical: 32, alignItems: "center", gap: 32 }}>
          <Text style={{ color: colors.gray75, textAlign: "center" }}>
            Escolha seu tipo de conta para seguir com o cadastro e personalizar sua experiência no app.
          </Text>
          <SecondaryButton title="Selecionar tipo de conta" onPress={handleOpenSelectModal} />
        </View>
      )}



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

      <PopUpFormsModel
        visible={showSelect}
        onClose={() => setShowSelect(false)}
        onSelectPatient={handleSelectPatient}
        onSelectCaregiver={handleSelectCaregiver}
      />
    </ScrollView>
  );
}