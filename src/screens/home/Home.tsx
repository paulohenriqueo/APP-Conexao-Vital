import React, { useEffect, useState } from "react";
import { View, Text, Alert, BackHandler, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TopBar } from "../../components/TopBar";
import { BottomNavBar } from "../../components/BottomNavbar";
import { styles } from "../../../styles/styles";
import { CompleteProfileModal } from "../../components/Modal";
import { SearchBar } from "../../components/SearchBar";

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

  // Função para renderizar conteúdo dependendo da aba selecionada
  const renderContent = () => {
    switch (selectedTab) {
      case "home":
        return (
          <View style={{ flex: 1, width: "100%", padding: 0}}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              onPressFilter={() => console.log("Filter pressed in Home")}
              placeholder="Pesquisar..."
            />
            <Text style={{...styles.contentText, textAlign: "center", padding: 32}}>Início</Text>
            {/* Rest of Home content */}
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
            <Text style={{...styles.contentText, textAlign: "center", padding: 32}}>Histórico</Text>
            {/* Rest of History content */}
          </View>
        );

      case "profile":
        return <Text style={styles.contentText}>Perfil</Text>;
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
