import React, { useState } from "react";
import { View, Text, Image, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles, typography } from "../../../styles/styles";
import Logo from "../../assets/logo.png";
import { colors } from "../../../styles/colors";
import { Input, InputPassword } from "../../components/Input";
import { PrimaryButton, GoogleButton } from "../../components/Button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";



export default function Register() {
  const navigation = useNavigation<any>();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const auth = FIREBASE_AUTH;

  // SignUp com Firebase Authentication
      const signUp = async () => {
          setLoading(true);

          if (password !== confirmPassword) {
            Alert.alert("Senhas distintas","As senhas não coincidem. Por favor, tente novamente.");
            setLoading(false);
            return;
          }

          try {
              const userCredential = await createUserWithEmailAndPassword(auth, email, password);
              const user = userCredential.user;

              await setDoc(doc(FIRESTORE_DB, "Users", user.uid), {
                name: nome,
                email: email,
                createdAt: new Date(),
                
              });

              Alert.alert("Conta criada com sucesso!", "Bem-vindo(a)!");
              navigation.navigate("Home");

          } catch (error: any) {
            if(error.code === 'auth/invalid-email') {
              Alert.alert("Email inválido", "Por favor, insira um email válido.");
            }
            if(password.length < 6) {
              Alert.alert("Senha fraca", "A senha deve conter no mínimo 6 caracteres.");
            }
            if(error.code === 'auth/email-already-in-use'){
              Alert.alert("Email já cadastrado", "Este email já está em uso. Tente outro.");
            }

          } finally {
              setLoading(false);
          }
      }

  const handleRegister = () => {
    console.log("Cadastro pressionado");
    Alert.alert("Cadastro concluído com sucesso!", "Bem-vindo(a)!");
    navigation.navigate("Login"); // simulação
  };

  const handleRegisterGoogle = () => {
    console.log("Cadastro com Google pressionado");
    Alert.alert("Cadastro com Google concluído com sucesso!");
    navigation.navigate("Login"); // simulação
  }

   // Validação de email simples
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // Validação de senha (mínimo 6 caracteres)
  const isPasswordValid = password.length >= 6;

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
        horizontal={false}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.boxTop}>
          <Image source={Logo} style={styles.logoLogin} />
          <Text style={typography.M0L3644}>Cadastrar</Text>
        </View>

        <View style={styles.containerBox}>
          <Input placeholder="Nome completo" value={nome} onChangeText={setNome} />
          <Input placeholder="E-mail" value={email} autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
          <Text style={{ color: isEmailValid ? 'green' : 'red', fontSize: 10, alignSelf: 'flex-start', marginLeft: 8, marginTop: -8 }}>
            Exemplo: usuario@email.com*
          </Text>
          <InputPassword placeholder="Senha" value={password} autoCapitalize="none" onChangeText={(text) => setPassword(text)} showForgotPassword={false} />
          <Text style={{ color: isPasswordValid ? 'green' : 'red', fontSize: 10, alignSelf: 'flex-start', marginLeft: 8, marginTop: -8 }}>
            A senha deve ter no mínimo 6 caracteres.*
          </Text>
          <InputPassword placeholder="Repita a senha" value={confirmPassword} onChangeText={setConfirmPassword} showForgotPassword={false} />
          <Text style={{ ...typography.M01R1014, color: colors.gray75 }}>
            Ao cadastrar, você aceita os{" "}
            <Text style={{ color: colors.green382 }} onPress={() => navigation.navigate("Terms")}>Termos de Uso</Text> e a{" "}
            <Text style={{ color: colors.green382 }} onPress={() => navigation.navigate("PrivacyPolicy")}>Política de Privacidade</Text>.
          </Text>

          <PrimaryButton title="Criar conta" onPress={signUp} />

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>
          <GoogleButton onPress={handleRegisterGoogle} />
        </View>

        <View style={{ ...styles.boxBottom, marginTop: 16 }}>
          <Text style={{ ...typography.M01R1624, fontSize: 14 }}>
            Já possui cadastro?{" "}
            <Text
              style={{ color: colors.green85F }}
              onPress={() => navigation.navigate("Login")}
            >
              Acesse sua conta
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
