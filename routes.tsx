import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import Login from "./src/screens/auth/Login";
import Register from "./src/screens/auth/Register";
import PasswordRecover from "./src/screens/auth/PasswordRecover";
import NewPassword from "./src/screens/auth/NewPassword";
import Terms from "./src/screens/legal/Terms";
import PrivacyPoliticy from "./src/screens/legal/PrivacyPolicy";
import Home from "./src/screens/home/Home";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="PasswordRecover" component={PasswordRecover} />
        <Stack.Screen name="NewPassword" component={NewPassword} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPoliticy} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
