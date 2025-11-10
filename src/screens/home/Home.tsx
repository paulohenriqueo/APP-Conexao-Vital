import React, { useEffect, useState } from "react";
import { View, Text, Alert, BackHandler, StyleSheet, Modal, Button, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TopBar } from "../../components/TopBar";
import { BottomNavBar } from "../../components/BottomNavbar";
import { colors, styles } from "../../../styles/styles";
import { CompleteProfileModal } from "../../components/Modal";
import { SearchBar } from "../../components/SearchBar";
import Profile from "./profile/Profile";
import { CustomList } from "./profile/CustomList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PopUpFormsModel from "../model/PopUpFormsModel";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import ExternalUser from "./profile/ExternalUser";
import { getCurrentUserType, getProfilesByType, searchProfilesByName, PublicProfile } from "../../services/userService";
import EditProfile from "./profile/EditProfile";
import { SecondaryButton } from "../../components/Button";

export default function Home() {
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState("home");
  const [showModal, setShowModal] = useState(false); // start false, set after check
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [search, setSearch] = useState("");

  // novo estado
  const [currentProfileType, setCurrentProfileType] = useState<string | null>(null);
  const [profilesList, setProfilesList] = useState<PublicProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const searchTimeoutRef = React.useRef<any>(null);

  useEffect(() => {
    // carrega tipo do usuário inicialmente e a lista padrão (sem filtro)
    (async () => {
      try {
        const type = await getCurrentUserType();
        setCurrentProfileType(type);
      } catch (e) {
        console.warn("Erro carregando tipo do usuário:", e);
      }
    })();
  }, []);

  // Reage a mudanças no search e currentProfileType: debounce e busca no Firestore
  useEffect(() => {
    if (!currentProfileType) return;
    const targetType = currentProfileType === "caregiver" ? "patient" : currentProfileType === "patient" ? "caregiver" : null;
    if (!targetType) {
      setProfilesList([]);
      return;
    }

    // debounce
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      setLoadingProfiles(true);
      try {
        const term = search?.trim() ?? "";
        if (term === "") {
          const items = await getProfilesByType(targetType);
          setProfilesList(items);
        } else {
          const items = await searchProfilesByName(targetType, term);
          setProfilesList(items);
        }
      } catch (e) {
        console.warn("Erro buscando perfis:", e);
      } finally {
        setLoadingProfiles(false);
      }
    }, 450);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [search, currentProfileType]);

  useEffect(() => {
    const backAction = () => {
      const previousRoute = navigation.getState()?.routes?.slice(-2, -1)[0];

      if (previousRoute?.name === "Login") {
        Alert.alert(
          "Sair da conta",
          "Deseja realmente sair da sua conta?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sair",
              style: "destructive",
              onPress: () => navigation.replace("Login"),
            },
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    (async () => {
      try {
        const seen = await AsyncStorage.getItem("hasSeenCompleteProfileModal");
        console.log("DEBUG: hasSeenCompleteProfileModal =", seen, "profileCompleted =", profileCompleted);
        // só mostra se ainda não viu e perfil não completo
        if (!seen && !profileCompleted) {
          setShowModal(true);
        } else if (__DEV__) {
          // durante desenvolvimento, forçar a modal aparecer para testar
          console.log("DEBUG: forcing modal visible in __DEV__");
          setTimeout(() => setShowModal(true), 300);
        }
      } catch (e) {
        console.warn("AsyncStorage error", e);
        setShowModal(!profileCompleted);
      }
    })();
  }, [profileCompleted]);

  const handleSelectPatient = async () => {
    try {
      await AsyncStorage.setItem("hasSeenCompleteProfileModal", "true");
    } catch (e) { }
    setShowModal(false);
    navigation.navigate("PatientForms");
  };

  const handleSelectCaregiver = async () => {
    try {
      await AsyncStorage.setItem("hasSeenCompleteProfileModal", "true");
    } catch (e) { }
    setShowModal(false);
    navigation.navigate("CaregiverForms");
  };

  const handleRequest = () => {
    if (!profileCompleted) {
      Alert.alert(
        "Cadastro incompleto",
        "Para fazer qualquer solicitação, é necessário completar seu cadastro.",
        [{ text: "OK" }]
      );
    } else {
      navigation.navigate("RequestScreen"); // muda para tela real de solicitação
    }
  };

  // Dados para teste de lista
  const historyData = [
    { id: "1", name: "Maria Silva", rating: 5, date: "04 abr.", imageUrl: "https://this-person-does-not-exist.com/img/avatar-genbccd101bd8dbac5f8bb60897e38ab2be.jpg", careCategory: "Cuidado Domiciliar" },
    { id: "2", name: "João Souza", rating: 4, date: "15 mar.", imageUrl: "https://this-person-does-not-exist.com/img/avatar-gen6b3b5faef405b1681627466f154dd5bf.jpg", careCategory: "Enfermeiro" },
    { id: "3", name: "João Almeida", rating: 4, date: "15 mar.", imageUrl: "https://this-person-does-not-exist.com/img/avatar-gend4affcf39479b0e32a6b292ee316cc18.jpg", careCategory: "Cuidado Domiciliar" },
  ];

  const searchData = [
    { id: "1", name: "Ana Clara", rating: 5, tags: ["CuidadoDomiciliar", "Idosos"], imageUrl: "https://this-person-does-not-exist.com/img/avatar-gen3de81692a53179ab914d9ff7d102fee1.jpg", careCategory: "Cuidado Domiciliar" },
    { id: "2", name: "Carlos Lima", rating: 4, tags: ["Enfermagem", "Acompanhante"], imageUrl: "https://this-person-does-not-exist.com/img/avatar-gen80b45514e179756196f7b7682ba17bb0.jpg", careCategory: "Enfermeiro" },
    { id: "3", name: "Julia Lima", rating: 2, tags: ["Enfermagem", "Acompanhante"], imageUrl: "https://this-person-does-not-exist.com/img/avatar-gen63cb16d668b8c7c84a755fc3a4450b7b.jpg", careCategory: "Acompanhante" },
  ];

  // Função para renderizar conteúdo dependendo da aba selecionada
  const renderContent = () => {
    switch (selectedTab) {
      case "home":
        return (
          <View style={{ flex: 1, width: "100%", padding: 0 }}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              onPressFilter={() => console.log("Filter pressed in Home")}
              placeholder="Pesquisar..."
            />

            <Text style={{ ...styles.subtitleText, textAlign: "left", paddingVertical: 16 }}>
              {/* Melhores avaliados */} Novos usuários
            </Text>

            {currentProfileType ? (
              <CustomList
                type="search"
                data={profilesList as any} // cast para evitar conflito de tipos com HistoryData/SearchData
              />
            ) : (
              <View style={{ paddingHorizontal: 16, paddingVertical: 32, alignItems: "center", gap: 32 }}>
                <Text style={{ color: colors.gray75, textAlign: "center" }}>
                  Selecione seu tipo de conta e tenha acesso às conexões certas para o seu perfil.
                </Text>
                <SecondaryButton title="Selecionar tipo de conta" onPress={clearOnboardingFlag} />
              </View>
            )}
          </View>
        );

      // adicionar forma de exibir a pesquisa
      case "search":
        return (
          <View style={{ flex: 1, width: "100%", padding: 0 }}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              onPressFilter={() => console.log("Filter pressed in Home")}
              placeholder="Pesquisar..."
            />
            <Text style={{ ...styles.subtitleText, textAlign: "left", paddingVertical: 16 }}>
              Resultados encontrados
            </Text>
            <CustomList
              type="search"
              data={searchData}
            />
          </View>
        );

      case "history":
        return (
          <View style={{ flex: 1, width: "100%", padding: 0 }}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              onPressFilter={() => console.log("Filter pressed in History")}
              placeholder="Pesquisar..."
            />
            <Text style={{ ...styles.subtitleText, textAlign: "left", paddingVertical: 16 }}>
              Histórico de solicitações
            </Text>
            <CustomList
              type="history"
              data={historyData}
            />
          </View>
        );

      case "profile":
        return <Profile />
      default:
        return <Text style={styles.contentText}>Início</Text>;
    }
  };

  // limpa a flag de primeira execução (apenas para teste)
  const clearOnboardingFlag = async () => {
    try {
      await AsyncStorage.removeItem("hasSeenCompleteProfileModal");
      console.log("DEBUG: removed hasSeenCompleteProfileModal");
      setShowModal(true); // opcional: reabre o modal após limpar
    } catch (e) {
      console.warn("DEBUG: failed to remove onboarding flag", e);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar title="" />

      <View style={styles.contentArea}>{renderContent()}</View>
      <BottomNavBar selected={selectedTab} onSelect={setSelectedTab} />

      <PopUpFormsModel
        visible={showModal && !profileCompleted}
        onClose={() => setShowModal(false)}
        onSelectPatient={handleSelectPatient}
        onSelectCaregiver={handleSelectCaregiver}
      />
    </View>
  );
}
