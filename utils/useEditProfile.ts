//Usado em: EditProfile.tsx

import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { capitalizeFirstLetter } from "../utils/formatUtils";

// Tipo do usuário (profissional ou cliente)
export type currentProfileType = "caregiver" | "patient";

// Tipagem da rota para garantir o acesso seguro aos parâmetros
type RouteParams = {
  EditProfile: { currentProfileType: currentProfileType };
};

export const useEditProfile = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "EditProfile">>();
  const { currentProfileType } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dados pessoais
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Dados específicos comuns
  const [careCategory, setCareCategory] = useState("");
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [observations, setObservations] = useState("");

  // Dados específicos do profissional
  const [qualificationInput, setQualificationInput] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [experienceInput, setExperienceInput] = useState("");
  const [experiences, setExperiences] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);

  // Dados específicos do cliente
  const [conditionInput, setConditionInput] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medicationInput, setMedicationInput] = useState("");
  const [medications, setMedications] = useState<string[]>([]);

  const currentUser = FIREBASE_AUTH.currentUser;

  // Opções fixas
  const periodOptions = ["Matutino", "Vespertino", "Noturno"];
  const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const audienceOptions = ["Crianças", "Adultos", "Idosos"];

  // --- Funções utilitárias ---
  const toggleItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const addToList = (
    value: string,
    setter: (v: string[]) => void,
    list: string[],
    clear: (v: string) => void
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setter([...list, capitalizeFirstLetter(trimmed)]);
    clear("");
  };

  const removeFromList = (index: number, setter: (v: string[]) => void, list: string[]) => {
    const copy = [...list];
    copy.splice(index, 1);
    setter(copy);
  };

  const fetchAddress = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (data.erro) {
        Alert.alert("Erro", "CEP não encontrado.");
        return;
      }
      setStreet(data.logradouro);
      setNeighborhood(data.bairro);
      setCity(data.localidade);
      setState(data.uf);
    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar CEP.");
      console.error(error);
    }
  };

  const handleSelectPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "É necessário permitir o acesso às fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  // --- Carregar dados do usuário ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const ref = doc(FIRESTORE_DB, "Users", currentUser?.uid || "");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          // Dados pessoais
          setPhone(data.phone || "");
          setCep(data.cep || "");
          setStreet(data.street || "");
          setNeighborhood(data.neighborhood || "");
          setCity(data.city || "");
          setState(data.state || "");
          setPhoto(data.photo || null);

          // Dados específicos comuns
          setCareCategory(data.careCategorie || "");
          setLanguages(data.preferredLanguages || []);
          setObservations(data.observations || []);
          setSelectedPeriods(data.periodo || []);

          // Dados específicos por tipo
          if (currentProfileType === "caregiver") {
            setQualifications(data.qualifications || []);
            setExperiences(data.experiences || []);
            setSelectedDays(data.dispoDia || []);
            setSelectedAudience(data.publicoAtendido || []);
          } else {
            setConditions(data.conditions || []);
            setAllergies(data.allergies || []);
            setMedications(data.medications || []);
          }
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Falha ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // --- Salvar dados pessoais ---
  const handleSavePersonal = async () => {
    setSaving(true);
    try {
      const ref = doc(FIRESTORE_DB, "Users", currentUser?.uid || "");
      await updateDoc(ref, {
        phone,
        cep,
        street,
        neighborhood,
        city,
        state,
        photo,
      });
      Alert.alert("Sucesso", "Informações pessoais atualizadas!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar as informações pessoais.");
    } finally {
      setSaving(false);
    }
  };

  // --- Salvar dados específicos ---
  const handleSaveSpecific = async () => {
    setSaving(true);
    try {
      const ref = doc(FIRESTORE_DB, "Users", currentUser?.uid || "");
      const baseData = {
        careCategorie: careCategory,
        periodo: selectedPeriods,
        preferredLanguages: languages,
        observations,
      };

      if (currentProfileType === "caregiver") {
        await updateDoc(ref, {
          ...baseData,
          qualifications,
          experiences,
          dispoDia: selectedDays,
          publicoAtendido: selectedAudience,
        });
      } else {
        await updateDoc(ref, {
          ...baseData,
          conditions,
          allergies,
          medications,
        });
      }

      Alert.alert("Sucesso", "Informações específicas atualizadas!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar as informações específicas.");
    } finally {
      setSaving(false);
    }
  };

  // --- Retorno do Hook ---
  return {
    currentProfileType,
    loading,
    saving,

    // pessoais
    phone, setPhone,
    photo, setPhoto,
    cep, setCep,
    street, setStreet,
    neighborhood, setNeighborhood,
    city, setCity,
    state, setState,

    // específicos
    careCategory, setCareCategory,
    selectedPeriods, setSelectedPeriods,
    languages, setLanguages,
    languageInput, setLanguageInput,
    observations, setObservations,

    // profissional
    qualifications, setQualifications,
    qualificationInput, setQualificationInput,
    experiences, setExperiences,
    experienceInput, setExperienceInput,
    selectedDays, setSelectedDays,
    selectedAudience, setSelectedAudience,

    // cliente
    conditions, setConditions,
    conditionInput, setConditionInput,
    allergies, setAllergies,
    allergyInput, setAllergyInput,
    medications, setMedications,
    medicationInput, setMedicationInput,

    // funções utilitárias
    handleSelectPhoto,
    fetchAddress,
    handleSavePersonal,
    handleSaveSpecific,
    toggleItem,
    addToList,
    removeFromList,
    periodOptions,
    weekDays,
    audienceOptions,
  };
};
