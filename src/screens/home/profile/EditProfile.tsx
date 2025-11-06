import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Input } from "../../../components/Input";
import { PrimaryButton } from "../../../components/Button";
import { colors, styles, typography } from "../../../../styles/styles";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { CaretLeft } from "phosphor-react-native";
import { careCategories } from "../../../../utils/careCategories";

type UserRole = "caregiver" | "patient";

type RouteParams = {
  EditProfile: { userRole: UserRole };
};

type CaregiverSpecifications = {
  especialization: string;
  experiencia?: string[];
  qualificacoes?: string[];
  dispoDia?: string[];
  periodo?: string[];
  publicoAtendido?: string[];
  observacoes?: string;
};

type PatientSpecifications = {
  careType: string;
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  preferredLanguages?: string[];
  observations?: string;
};

type UserData = {
  name: string;
  email: string;
  phone?: string;
  caregiverSpecifications?: CaregiverSpecifications;
  patientSpecifications?: PatientSpecifications;
};

export default function EditProfile() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "EditProfile">>();
  const { userRole } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [careField, setCareField] = useState<string>("");

  const currentUser = FIREBASE_AUTH.currentUser;

  // Busca inicial dos dados
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(FIRESTORE_DB, "Users", currentUser?.uid || "");
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data() as UserData;
          setUserData(data);
          setCareField(
            userRole === "caregiver"
              ? data.caregiverSpecifications?.especialization || ""
              : data.patientSpecifications?.careType || ""
          );
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Salvar informações pessoais
  const handleSavePersonal = async () => {
    if (!userData) return;
    setSaving(true);
    try {
      await updateDoc(doc(FIRESTORE_DB, "Users", currentUser?.uid || ""), {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
      });
      Alert.alert("Sucesso", "Informações pessoais atualizadas!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar as informações pessoais.");
    } finally {
      setSaving(false);
    }
  };

  // Salvar informações específicas
  const handleSaveCare = async () => {
    if (!userData) return;
    setSaving(true);
    try {
      const ref = doc(FIRESTORE_DB, "Users", currentUser?.uid || "");

      if (userRole === "caregiver") {
        await updateDoc(ref, {
          caregiverSpecifications: {
            ...userData.caregiverSpecifications,
            especialization: careField,
          },
        });
      } else {
        await updateDoc(ref, {
          patientSpecifications: {
            ...userData.patientSpecifications,
            careType: careField,
          },
        });
      }

      Alert.alert("Sucesso", "Informações de cuidado atualizadas!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar as informações de cuidado.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.green382,
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.green382 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 30,
        }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: 20, marginVertical: 8 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <CaretLeft size={24} color={colors.whiteFBFE} weight="bold" />
          </TouchableOpacity>
          <Text style={[typography.M01SB2024, { color: colors.whiteFBFE }]}>
            Editar perfil
          </Text>
        </View>

        {/* Seção 1 — Informações pessoais */}
        <View
          style={[
            styles.containerBox,
            {
              width: "90%",
              marginTop: 16,
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: 20,
            },
          ]}
        >
          <Text style={[typography.M01SB1620, { color: colors.gray23, marginBottom: 8 }]}>
            Informações pessoais
          </Text>

          <Input
            placeholder="Nome completo"
            value={userData?.name || ""}
            onChangeText={(t) => setUserData({ ...userData!, name: t })}
          />
          <Input
            placeholder="E-mail"
            value={userData?.email || ""}
            onChangeText={(t) => setUserData({ ...userData!, email: t })}
            autoCapitalize="none"
          />
          <Input
            placeholder="Telefone"
            value={userData?.phone || ""}
            onChangeText={(t) => setUserData({ ...userData!, phone: t })}
            keyboardType="phone-pad"
          />

          <PrimaryButton
            title={saving ? "Salvando..." : "Salvar informações pessoais"}
            onPress={handleSavePersonal}
          />
        </View>

        {/* Seção 2 — Específicas */}
        <View
          style={[
            styles.containerBox,
            {
              width: "90%",
              marginTop: 20,
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: 20,
            },
          ]}
        >
          <Text style={[typography.M01SB1620, { color: colors.gray23, marginBottom: 8 }]}>
            {userRole === "caregiver"
              ? "Área de atuação"
              : "Tipo de cuidado necessário"}
          </Text>

          <View
            style={{
              backgroundColor: colors.gray7FD,
              borderRadius: 8,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <Picker
              selectedValue={careField}
              onValueChange={(v) => setCareField(v)}
              style={{ height: 58, color: colors.gray23 }}
              dropdownIconColor={colors.gray75}
            >
              <Picker.Item
                label="Selecione uma opção"
                value=""
                color={colors.gray75}
              />
              {careCategories.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>

          <PrimaryButton
            title={saving ? "Salvando..." : "Salvar informações de cuidado"}
            onPress={handleSaveCare}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
