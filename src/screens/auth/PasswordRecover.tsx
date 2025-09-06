import React, { useState } from "react";
import { View, Text, Image, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { styles, typography } from "../../../styles/styles";
import Logo from "../../assets/logo.png";
import { Input } from "../../components/Input";
import { PrimaryButton } from "../../components/Button";

export default function PasswordRecover() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [email, setEmail] = useState(route.params?.email || "");

  const handleRecover = () => {
    if (!email) {
      Alert.alert("Preencha o e-mail.");
    } else {
      Alert.alert("Enviando link de redefinição para ", email);
      navigation.navigate("NovaSenha"); // simulação
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxTop}>
        <Image source={Logo} style={styles.logoLogin} />
        <Text style={typography.M0L3644}>Recuperação de senha</Text>
      </View>

      <View style={styles.containerBox}>
        <Input
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
        />
        <PrimaryButton title="Enviar link de redefinição" onPress={handleRecover} />
      </View>
    </View>
  );
}
