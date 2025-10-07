import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import Login from "./src/screens/auth/Login";
import Register from "./src/screens/auth/Register";
import PasswordRecover from "./src/screens/auth/PasswordRecover";
import NewPassword from "./src/screens/auth/NewPassword";
import Terms from "./src/screens/legal/Terms";
import PrivacyPolicy from "./src/screens/legal/PrivacyPolicy";
import Home from "./src/screens/home/Home";
import Specializations from "./src/screens/home/Specializations";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="PasswordRecover" component={PasswordRecover} />
        <Stack.Screen name="NewPassword" component={NewPassword} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Specializations" component={Specializations} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
