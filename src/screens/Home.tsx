import React, { useEffect } from "react";
import { View, Text, Alert, BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles, typography } from "./styles";

export default function Home() {
  const navigation = useNavigation<any>();

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

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 48 }}>
        <Text style={{ color: "#000000" }}>Home</Text>
      </View>
    </View >
  );
}
