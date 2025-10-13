import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../styles/colors";
import { styles } from "../../styles/styles";
import { useNavigation } from "@react-navigation/native";

interface ProfileInfoProps {
  user: {
    bio?: string; // descrição do usuário
    role?: "caregiver" | "client"; // provisório
  };
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const navigation = useNavigation();

  const isProfileComplete = !!user.bio; // provisório: perfil completo se bio existir

  if (!isProfileComplete) {
    return (
      <View style={styles.container}>
        <Text style={profileStyles.message}>Seu perfil ainda não está completo.</Text>
        <TouchableOpacity
          style={profileStyles.button}
          onPress={() => console.log("CompleteProfile")}
        >
          <Text style={profileStyles.buttonText}>Completar Perfil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{...styles.container, marginBottom: 24}}>
      <Text style={profileStyles.value}>{user.bio}</Text>
    </View>
  );
};

const profileStyles = StyleSheet.create({
  value: { fontSize: 16, color: colors.gray23 },
  message: { fontSize: 16, color: colors.gray75, marginBottom: 12 },
  button: { backgroundColor: colors.green382, padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});

export default ProfileInfo;
