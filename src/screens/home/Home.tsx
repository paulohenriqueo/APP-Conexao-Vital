import React, { useEffect, useState } from "react";
import { View, Text, Alert, BackHandler, StyleSheet, Modal, Button, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TopBar } from "../../components/TopBar";
import { BottomNavBar } from "../../components/BottomNavbar";
import { styles } from "../../../styles/styles";
import { CompleteProfileModal } from "../../components/Modal";
import { SearchBar } from "../../components/SearchBar";
import Profile from "./profile/Profile";
import { CustomList } from "../../components/CustomList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PopUpFormsModel from "../model/PopUpFormsModel";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import ExternalUser from "./profile/ExternalUser";

export default function Home() {
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState("home");
  const [showModal, setShowModal] = useState(false); // start false, set after check
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [search, setSearch] = useState("");

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
  // Melhores avaliados - perfis que aparecem no inicio
  const homeData = [
    { id: "1", name: "Maria Bellone", rating: 5, tags: ["CuidadoDomiciliar", "Idosos"], imageUrl: "https://this-person-does-not-exist.com/img/avatar-gen841edd2024216a6064de82e3b39a66ac.jpg", especialization: "Cuidado Domiciliar" },
    { id: "2", name: "João Moura", rating: 5, tags: ["Enfermagem", "Acompanhante"], imageUrl: "https://this-person-does-not-exist.com/img/avatar-gen3db975f6be246415b0ef820d8446b5bc.jpg", especialization: "Enfermeiro" },
    { id: "3", name: "Julia Almeida", rating: 4, tags: ["Enfermagem", "Acompanhante"], imageUrl: "https://this-person-does-not-exist.com/img/avatar-genf3f99c3fb1c099c668d89fcaafbc5c59.jpg", especialization: "Acompanhante" },
  ];

  const historyData = [
    { id: "1", name: "Maria Silva", rating: 5, date: "04 abr.", imageUrl: "https://this-person-does-not-exist.com/img/avatar-genbccd101bd8dbac5f8bb60897e38ab2be.jpg", especialization: "Cuidado Domiciliar" },
    { id: "2", name: "João Souza", rating: 4, date: "15 mar.", imageUrl: "https://this-person-does-not-exist.com/img/avatar-gen6b3b5faef405b1681627466f154dd5bf.jpg", especialization: "Enfermeiro" },
    { id: "3", name: "João Almeida", rating: 4, date: "15 mar.", imageUrl: "https://this-person-does-not-exist.com/img/avatar-gend4affcf39479b0e32a6b292ee316cc18.jpg", especialization: "Cuidado Domiciliar" },
  ];

  const searchData = [
    { id: "1", name: "Ana Clara", rating: 5, tags: ["CuidadoDomiciliar", "Idosos"], imageUrl: "https://this-person-does-not-exist.com/img/avatar-gen3de81692a53179ab914d9ff7d102fee1.jpg", especialization: "Cuidado Domiciliar" },
    { id: "2", name: "Carlos Lima", rating: 4, tags: ["Enfermagem", "Acompanhante"], imageUrl: "https://this-person-does-not-exist.com/img/avatar-gen80b45514e179756196f7b7682ba17bb0.jpg", especialization: "Enfermeiro" },
    { id: "3", name: "Julia Lima", rating: 2, tags: ["Enfermagem", "Acompanhante"], imageUrl: "https://this-person-does-not-exist.com/img/avatar-gen63cb16d668b8c7c84a755fc3a4450b7b.jpg", especialization: "Acompanhante" },
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
              Melhores avaliados
            </Text>
            <CustomList
              type="search"
              data={homeData}
              onItemPress={(id) => console.log("Abrir perfil:", id)}
            />
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
              onItemPress={(id) => console.log("Abrir perfil:", id)}
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
              onItemPress={(id) => console.log("Abrir perfil:", id)}
            />
          </View>
        );

      case "profile":
        return <Profile />;
      // return <ExternalUser />; //teste de perfil externo - adicionar acesso pela lista de histórico e pesquisa
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
      {/* botão temporário para debug (remova depois) */}
      <TouchableOpacity onPress={clearOnboardingFlag} style={{ alignSelf: "flex-end", padding: 8, margin: 8 }}>
        <Text style={{ color: "#fff" }}>Reset Onboarding</Text>
      </TouchableOpacity>

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
