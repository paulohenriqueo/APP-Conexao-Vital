import React, { useEffect, useState } from "react";
import { View, Text, Alert, BackHandler, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TopBar } from "../../components/TopBar";
import { BottomNavBar } from "../../components/BottomNavbar";
import { styles } from "../../../styles/styles";
import { CompleteProfileModal } from "../../components/Modal";
import { SearchBar } from "../../components/SearchBar";
import Profile from "./profile/Profile";
import { CustomList } from "../../components/CustomList";

export default function Home() {
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState("home");
  const [showModal, setShowModal] = useState(true);
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
    { id: "1", name: "Maria Bellone", rating: 5, tags: ["CuidadoDomiciliar", "Idosos"] },
    { id: "2", name: "João Moura", rating: 5, tags: ["Enfermagem", "Acompanhante"] },
    { id: "3", name: "Julia Almeida", rating: 4, tags: ["Enfermagem", "Acompanhante"] },
  ];

  const historyData = [
    { id: "1", name: "Maria Silva", rating: 5, date: "04 abr." },
    { id: "2", name: "João Souza", rating: 4, date: "15 mar." },
    { id: "3", name: "João Almeida", rating: 4, date: "15 mar." },
  ];

  const searchData = [
    { id: "1", name: "Ana Clara", rating: 5, tags: ["CuidadoDomiciliar", "Idosos"] },
    { id: "2", name: "Carlos Lima", rating: 4, tags: ["Enfermagem", "Acompanhante"] },
    { id: "3", name: "Julia Lima", rating: 2, tags: ["Enfermagem", "Acompanhante"] },
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
            <Text style={{ ...styles.contentText, textAlign: "left", paddingVertical: 16 }}>
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
            <Text style={{ ...styles.contentText, textAlign: "left", paddingVertical: 16 }}>
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
            <Text style={{ ...styles.contentText, textAlign: "left", paddingVertical: 16 }}>
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
      default:
        return <Text style={styles.contentText}>Início</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <TopBar title="" />
      <View style={styles.contentArea}>{renderContent()}</View>
      <BottomNavBar selected={selectedTab} onSelect={setSelectedTab} />

      {/* Ativar quando a tela de completar o cadastro estiver pronta */}
      {/* <CompleteProfileModal
        visible={showModal}
        text="Complete seu cadastro para aproveitar ao máximo o aplicativo!"
        onPressPrimary={() => {
          setShowModal(false);
          navigation.navigate("ProfileComplete"); // tela de edição do perfil
        }}
        onPressSecondary={() => {
          setShowModal(false);
          Alert.alert(
            "Atenção",
            "Para fazer qualquer solicitação é necessário completar o cadastro, mas você pode continuar pesquisando sem filtros definidos."
          );
        }}
      /> */}
    </View>
  );
}
