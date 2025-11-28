import React, { useState } from "react";
import { View, Text, Image, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, styles, typography } from "../../../styles/styles";
import Logo from "../../assets/logo.png";
import { Input } from "../../components/Input";
import { PrimaryButton } from "../../components/Button";
import { CaretLeft } from "phosphor-react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function PasswordRecover() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [email, setEmail] = useState(route.params?.email || "");

  const handleRecover = async () => {
    if (!email) {
      Alert.alert("Preencha o e-mail.");
      return;
    }
    
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
    Alert.alert(
      "Sucesso",
      `Um link de redefinição de senha foi enviado para ${email}. Verifique seu e-mail.`
    );
    navigation.goBack(); // volta para tela de login
  } catch (error: any) {
    console.error(error);
    Alert.alert(
      "Erro",
      error.code === "auth/user-not-found"
        ? "Usuário não encontrado."
        : "Não foi possível enviar o e-mail. Tente novamente."
    );
  }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.boxTop, { flex: 1 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", left: 24, top: 48, padding: 8 }}
          accessibilityLabel="Voltar"
        >
          <CaretLeft size={24} color={colors.whiteFBFE} weight="bold" />
        </TouchableOpacity>
        <Image source={Logo} style={styles.logoLogin} />
        <Text style={typography.M0L3644}>Recuperação de senha</Text>
      </View>

      <View style={[styles.containerBox, { marginBottom: "70%" }]}>
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
