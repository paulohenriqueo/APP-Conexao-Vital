// useEditProfile.ts — versão corrigida

import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { capitalizeFirstLetter } from "../utils/formatUtils";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export type currentProfileType = "caregiver" | "patient";

type RouteParams = {
  EditProfile: { currentProfileType: currentProfileType };
};

export const useEditProfile = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "EditProfile">>();
  const { currentProfileType } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const currentUser = FIREBASE_AUTH.currentUser;

  // -----------------------------
  // STATES
  // -----------------------------
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // ESPECÍFICOS
  const [careCategory, setCareCategory] = useState("");
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");
  const [observations, setObservations] = useState("");

  // CUIDADOR
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [qualificationInput, setQualificationInput] = useState("");
  const [experiences, setExperiences] = useState<string[]>([]);
  const [experienceInput, setExperienceInput] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);

  // PACIENTE
  const [conditions, setConditions] = useState<string[]>([]);
  const [conditionInput, setConditionInput] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState("");
  const [medications, setMedications] = useState<string[]>([]);
  const [medicationInput, setMedicationInput] = useState("");

  const periodOptions = ["Matutino", "Vespertino", "Noturno"];

  // -----------------------------
  // UTILITÁRIAS
  // -----------------------------
  const toggleItem = (
    list: string[],
    item: string,
    setter: (v: string[]) => void
  ) => {
    setter(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  };

  const addToList = (
    value: string,
    setter: any,
    list: string[],
    clear: any
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setter([...list, capitalizeFirstLetter(trimmed)]);
    clear("");
  };

  const removeFromList = (index: number, setter: any, list: string[]) => {
    const arr = [...list];
    arr.splice(index, 1);
    setter(arr);
  };

  //-----------------------------
  // IMAGE UPLOAD
  //-----------------------------
  async function uploadProfileImage(uri: string) {
    if (!uri) return null;

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storage = getStorage();
      const imageRef = ref(
        storage,
        `profilePhotos/${currentUser?.uid}_${Date.now()}.jpg`
      );

      await uploadBytes(imageRef, blob);

      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return null;
    }
  }

  // -----------------------------
  // FETCH USER
  // -----------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const ref = doc(FIRESTORE_DB, "Users", currentUser?.uid || "");
        const snap = await getDoc(ref);

        if (!snap.exists()) return;
        const data = snap.data();

        // -----------------------
        // DADOS PESSOAIS
        // -----------------------
        const baseProfile =
          currentProfileType === "caregiver"
            ? data.caregiverProfile
            : data.patientProfile;

        if (baseProfile) {
          setPhone(baseProfile.phone ?? "");
          setCep(baseProfile.cep ?? "");
          setStreet(baseProfile.street ?? "");
          setNeighborhood(baseProfile.neighborhood ?? "");
          setCity(baseProfile.city ?? "");
          setState(baseProfile.state ?? "");
          setPhoto(baseProfile.photo ?? null);
        }

        // ----------------------------------
        // ESPECÍFICOS — PACIENTE OU CUIDADOR
        // ----------------------------------
        if (currentProfileType === "patient") {
          const c = data.condition ?? {};
          setCareCategory(c.careCategory ?? "");
          setConditions(c.condicoes ?? []);
          setAllergies(c.alergias ?? []);
          setMedications(c.medicamentos ?? []);
          setLanguages(c.idiomasPreferidos ?? []);
          setObservations(c.observacoes ?? "");
          setSelectedPeriods(c.periodos ?? []);
        }

        if (currentProfileType === "caregiver") {
          const s = data.caregiverSpecifications ?? {};
          setCareCategory(s.careCategory ?? "");
          setLanguages(s.idiomasPreferidos ?? []);
          setQualifications(s.qualificacoes ?? []);
          setExperiences(s.experiencias ?? []);
          setSelectedDays(s.dayOptions ?? []);
          setSelectedPeriods(s.periodOptions ?? []);
          setSelectedAudience(s.publicoAtendido ?? []);
          setObservations(s.observacoes ?? "");
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Erro ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // -----------------------------
  // SAVE PERSONAL
  // -----------------------------
  const handleSavePersonal = async () => {
    setSaving(true);
    try {
      const ref = doc(FIRESTORE_DB, "Users", currentUser?.uid || "");
      const profilePath =
        currentProfileType === "caregiver"
          ? "caregiverProfile"
          : "patientProfile";

      let photoURL = photo;

      // Se a imagem for local, fazer upload
      if (photo?.startsWith("file://")) {
        photoURL = await uploadProfileImage(photo);
      }

      await updateDoc(ref, {
        [`${profilePath}.phone`]: phone,
        [`${profilePath}.cep`]: cep,
        [`${profilePath}.street`]: street,
        [`${profilePath}.city`]: city,
        [`${profilePath}.state`]: state,
        [`${profilePath}.neighborhood`]: neighborhood,
        [`${profilePath}.photo`]: photoURL,
      });

      Alert.alert("Sucesso", "Informações pessoais atualizadas!");
    } catch (e) {
      console.error(e);
      Alert.alert("Erro ao atualizar as informações.");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // SAVE SPECIFIC
  // -----------------------------
  const handleSaveSpecific = async () => {
    setSaving(true);
    try {
      const ref = doc(FIRESTORE_DB, "Users", currentUser?.uid || "");

      if (currentProfileType === "patient") {
        await updateDoc(ref, {
          "condition.careCategory": careCategory,
          "condition.condicoes": conditions,
          "condition.alergias": allergies,
          "condition.medicamentos": medications,
          "condition.idiomasPreferidos": languages,
          "condition.observacoes": observations,
          "condition.periodos": selectedPeriods,
        });
      }

      if (currentProfileType === "caregiver") {
        await updateDoc(ref, {
          "caregiverSpecifications.careCategory": careCategory,
          "caregiverSpecifications.qualificacoes": qualifications,
          "caregiverSpecifications.experiencias": experiences,
          "caregiverSpecifications.dayOptions": selectedDays,
          "caregiverSpecifications.periodOptions": selectedPeriods,
          "caregiverSpecifications.publicoAtendido": selectedAudience,
          "caregiverSpecifications.idiomasPreferidos": languages,
          "caregiverSpecifications.observacoes": observations,
        });
      }

      Alert.alert("Sucesso", "Informações específicas atualizadas!");
    } catch (e) {
      console.error(e);
      Alert.alert("Erro ao salvar informações específicas.");
    } finally {
      setSaving(false);
    }
  };

  async function fetchAddress(cep: string) {
    try {
      const cleanCep = cep.replace(/\D/g, "");
      if (cleanCep.length !== 8) return; // só chama API se tiver 8 dígitos

      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      if (!response.ok) {
        console.error("Erro ao consultar ViaCEP");
        return;
      }

      const data = await response.json();

      if (data.erro) {
        console.warn("CEP não encontrado");
        return;
      }

      // Preenche automaticamente os campos
      setStreet(data.logradouro || "");
      setNeighborhood(data.bairro || "");
      setCity(data.localidade || "");
      setState(data.uf || "");
    } catch (error) {
      console.error("Erro no fetchAddress:", error);
    }
  }

  // -----------------------------
  // RETORNO
  // -----------------------------
  return {
    loading,
    saving,
    currentProfileType,

    // pessoais
    phone,
    setPhone,
    photo,
    setPhoto,
    cep,
    setCep,
    street,
    setStreet,
    neighborhood,
    setNeighborhood,
    city,
    setCity,
    state,
    setState,

    // comuns
    careCategory,
    setCareCategory,
    selectedPeriods,
    setSelectedPeriods,
    languages,
    setLanguages,
    languageInput,
    setLanguageInput,
    observations,
    setObservations,

    // profissional
    qualifications,
    setQualifications,
    qualificationInput,
    setQualificationInput,
    experiences,
    setExperiences,
    experienceInput,
    setExperienceInput,
    selectedDays,
    setSelectedDays,
    selectedAudience,
    setSelectedAudience,

    // paciente
    conditions,
    setConditions,
    conditionInput,
    setConditionInput,
    allergies,
    setAllergies,
    allergyInput,
    setAllergyInput,
    medications,
    setMedications,
    medicationInput,
    setMedicationInput,

    // outros
    handleSavePersonal,
    handleSaveSpecific,
    fetchAddress,
    toggleItem,
    addToList,
    removeFromList,
    periodOptions,
  };
};
