import React, { useState } from "react";
import {
    Text,
    View,
    Image,
    Alert,
    ScrollView,
} from "react-native";
import { styles, typography } from "../../../styles/styles";
import Logo from '../../assets/logo.png'
import { colors } from "../../../styles/colors";
import { Input, InputPassword } from "../../components/Input";
import { PrimaryButton, GoogleButton } from "../../components/Button";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //first commit in development branch

    const handleLogin = () => {
        try {
            if (!email || !password) {
                return Alert.alert("Por favor, preencha todos os campos.");
            }

            setTimeout(() => {
                // if (email === "teste@gmail.com" && password === "123456") { 
                // Adicionar lógica real
                if (email && password) {
                    Alert.alert("Login bem-sucedido!");
                    navigation.navigate("Home");
                }
                else {
                    Alert.alert("E-mail ou senha incorretos. Tente novamente.");
                }
            }, 1500);
        } catch (error) {
            console.error("Erro no login:", error);
            Alert.alert("Ocorreu um erro durante o login. Tente novamente.");
        }
    };

    const handleGoogleLogin = () => {
        try {
            console.log("Login com Google");
            Alert.alert("Login com Google concluído com sucesso!");
            navigation.navigate("Home"); // simulação
        } catch (error) {
            console.error("Erro no login:", error);
            Alert.alert("Ocorreu um erro durante o login. Tente novamente.");
        }
    }   /* Adicionar lógica */

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
                    <Text style={typography.M0L3644}>Entrar</Text>
                </View>

                <View style={styles.containerBox}>
                    <Input
                        placeholder="E-mail"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <InputPassword
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                    />
                    <PrimaryButton title="Entrar" onPress={handleLogin} />
                    <View style={styles.dividerContainer}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>ou</Text>
                        <View style={styles.line} />
                    </View>
                    <GoogleButton onPress={handleGoogleLogin} />
                </View>

                <View style={styles.boxBottom}>
                    <Text style={typography.M01R1624}>
                        Novo aqui?{" "}
                        <Text style={{ color: colors.green85F }} onPress={() => navigation.navigate("Register")}>
                            Crie a sua conta!
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </View >
    )
}
