import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import Login from "./src/screens/Login";
import Cadastro from "./src/screens/Cadastro";
import RecuperacaoSenha from "./src/screens/RecuperacaoSenha";
import NovaSenha from "./src/screens/NovaSenha";
import Termos from "./src/screens/Termos";
import Politica from "./src/screens/Politica";
import Home from "./src/screens/Home";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="RecuperacaoSenha" component={RecuperacaoSenha} />
        <Stack.Screen name="NovaSenha" component={NovaSenha} />
        <Stack.Screen name="Termos" component={Termos} />
        <Stack.Screen name="Politica" component={Politica} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
