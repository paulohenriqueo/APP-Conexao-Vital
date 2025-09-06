import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles, typography } from "./styles/Input";
import { colors } from "../../styles/colors";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
};

export function Input({ placeholder, value, onChangeText }: InputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={colors.gray75}
      value={value}
      onChangeText={onChangeText}
      cursorColor={colors.orange360}
    />
  );
}

type InputPasswordProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  showForgotPassword?: boolean;
  forgotPasswordText?: string;
  emailValue?: string; // adicionamos para passar o email
};

export function InputPassword({
  placeholder,
  value,
  onChangeText,
  showForgotPassword = true,
  forgotPasswordText = "Esqueci minha senha",
  emailValue,
}: InputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<any>();

  const handleForgotPassword = () => {
    navigation.navigate("PasswordRecover", { email: emailValue || "" });
  };

  return (
    <View style={{ gap: 8 }}>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder={placeholder}
          placeholderTextColor={colors.gray75}
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
          cursorColor={colors.orange360}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconButton}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color={colors.gray75}
          />
        </TouchableOpacity>
      </View>

      {showForgotPassword && (
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text
            style={{
              ...typography.M01R1014U,
              width: "100%",
              paddingHorizontal: 4,
              color: colors.green85F,
              textDecorationLine: "underline",
            }}
          >
            {forgotPasswordText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
