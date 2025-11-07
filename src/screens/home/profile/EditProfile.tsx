import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Image,
  TextInput,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Input } from "../../../components/Input";
import { PrimaryButton } from "../../../components/Button";
import { colors, styles, typography } from "../../../../styles/styles";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { CaretLeft, Camera } from "phosphor-react-native";
import { careCategories } from "../../../../utils/careCategories";
import * as ImagePicker from "expo-image-picker";
import { capitalizeFirstLetter } from "../../../../utils/formatUtils";

type UserRole = "profissional" | "client";

type RouteParams = {
  EditProfile: { userRole: UserRole };
};

export default function EditProfile() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "EditProfile">>();
  const { userRole } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Pessoais
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Específicas
  const [careCategory, setCareCategory] = useState("");
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [observations, setObservations] = useState("");

  // Profissional
  const [qualificationInput, setQualificationInput] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [experienceInput, setExperienceInput] = useState("");
  const [experiences, setExperiences] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState<string[]>([]);

  // Client
  const [conditionInput, setConditionInput] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medicationInput, setMedicationInput] = useState("");
  const [medications, setMedications] = useState<string[]>([]);

  const currentUser = FIREBASE_AUTH.currentUser;

  const periodOptions = ["Matutino", "Vespertino", "Noturno"];
  const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const audienceOptions = ["Crianças", "Adultos", "Idosos"];
  const toggleItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const addToList = (value: string, setter: (v: string[]) => void, list: string[], clear: (v: string) => void) => {
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

  // Buscar dados do usuário
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const ref = doc(FIRESTORE_DB, "Users", currentUser?.uid || "");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setPhone(data.phone || "");
          setCep(data.cep || "");
          setStreet(data.street || "");
          setNeighborhood(data.neighborhood || "");
          setCity(data.city || "");
          setState(data.state || "");
          setPhoto(data.photo || null);
          // Dados específicos
          setCareCategory(data.careCategorie || "");
          setLanguages(data.preferredLanguages || []);
          setObservations(data.observations || "");
          if (userRole === "profissional") {
            setQualifications(data.qualifications || []);
            setExperiences(data.experiences || []);
            setSelectedDays(data.dispoDia || []);
            setTargetAudience(data.publicoAtendido || []);
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

      if (userRole === "profissional") {
        await updateDoc(ref, {
          ...baseData,
          qualifications,
          experiences,
          dispoDia: selectedDays,
          publicoAtendido: targetAudience,
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.green382 }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.green382 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ alignItems: "center", paddingVertical: 30 }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: 20, marginVertical: 8 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <CaretLeft size={24} color={colors.whiteFBFE} weight="bold" />
          </TouchableOpacity>
          <Text style={[typography.M01SB2024, { color: colors.whiteFBFE }]}>Editar perfil</Text>
        </View>

        {/* Seção 1 — Informações pessoais */}
        <View style={[styles.containerBox, { width: "90%", marginTop: 16, backgroundColor: "#fff", borderRadius: 24, padding: 20, paddingTop: 20, gap: 12 }]}>
          <Text style={[typography.M01M1824, { color: colors.gray23, marginBottom: 8, marginTop: 0 }]}>Informações pessoais</Text>

          {/* Foto */}
          <TouchableOpacity onPress={handleSelectPhoto} activeOpacity={0.8} style={{ alignSelf: "center", marginBottom: 12 }}>
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "#f3f3f3",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {photo ? (
                <Image source={{ uri: photo }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <>
                  <Camera size={40} color={colors.gray73} />
                  <Text style={{ color: colors.gray73, fontSize: 13 }}>Selecionar foto</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <Input placeholder="Telefone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input placeholder="CEP" value={cep} onChangeText={setCep} onBlur={() => fetchAddress(cep)} keyboardType="numeric" />
          <Input placeholder="Rua" value={street} onChangeText={setStreet} />
          <Input placeholder="Bairro" value={neighborhood} onChangeText={setNeighborhood} />
          <Input placeholder="Cidade" value={city} onChangeText={setCity} />
          <Input placeholder="Estado" value={state} onChangeText={setState} />

          <PrimaryButton title={saving ? "Salvando..." : "Salvar informações pessoais"} onPress={handleSavePersonal} />
        </View>

        {/* Seção 2 — Informações específicas */}
        <View style={[styles.containerBox, { width: "90%", marginTop: 20, backgroundColor: "#fff", borderRadius: 24, padding: 20, paddingTop: 20, gap: 8 }]}>
          <Text style={[typography.M01M1824, { color: colors.gray23, marginBottom: 8, marginTop: 0 }]}> Informações específicas</Text>
          {userRole === "profissional" ? (
            <Text style={{ color: colors.gray75, marginBottom: 8 }}>Área de atuação</Text>
          ) : (userRole === "client" ? (
            <Text style={{ color: colors.gray75, marginBottom: 8 }}>Tipo de cuidado necessário</Text>
          ) : null)}
          {/* Categoria */}
          <View style={{ backgroundColor: colors.gray7FD, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
            <Picker selectedValue={careCategory} onValueChange={setCareCategory} style={{ height: 58, color: colors.gray23 }}>
              <Picker.Item label="Selecione uma categoria" value="" color={colors.gray75} />
              {careCategories.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>

          {/* Período */}
          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Período</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
            {periodOptions.map((p) => (
              <TouchableOpacity key={p} onPress={() => toggleItem(selectedPeriods, p, setSelectedPeriods)} style={{ flexDirection: "row", alignItems: "center", marginRight: 12, marginBottom: 8 }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 1.5,
                    borderColor: selectedPeriods.includes(p) ? colors.green85F : colors.grayE8,
                    backgroundColor: selectedPeriods.includes(p) ? colors.green85F : "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                  }}
                >
                  {selectedPeriods.includes(p) && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
                </View>
                <Text style={{ color: colors.gray73 }}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Campos dinâmicos por tipo de usuário */}
          {userRole === "profissional" ? (
            <View style={{ gap: 8 }}>
              <Text style={{ color: colors.gray73, marginTop: 4 }}>Qualificações</Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <Input placeholder="Adicionar qualificação" value={qualificationInput} onChangeText={setQualificationInput} style={{ flex: 1, backgroundColor: colors.gray7FD, borderRadius: 8 }} />
                <TouchableOpacity onPress={() => addToList(qualificationInput, setQualifications, qualifications, setQualificationInput)} style={{ marginLeft: 8, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}>
                  <Text style={{ color: "#fff" }}>Adicionar</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={qualifications}
                horizontal
                renderItem={({ item, index }) => (
                  <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                    <Text style={{ color: colors.gray23 }}>{item}</Text>
                    <TouchableOpacity onPress={() => removeFromList(index, setQualifications, qualifications)} style={{ marginLeft: 8 }}>
                      <Text style={{ color: colors.orange360 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

              <Text style={{ color: colors.gray73, marginTop: 4 }}>Experiência</Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <Input placeholder="Adicionar experiência" value={experienceInput} onChangeText={setExperienceInput} style={{ flex: 1, backgroundColor: colors.gray7FD, borderRadius: 8 }} />
                <TouchableOpacity onPress={() => addToList(experienceInput, setExperiences, experiences, setExperienceInput)} style={{ marginLeft: 8, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}>
                  <Text style={{ color: "#fff" }}>Adicionar</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={experiences}
                horizontal
                renderItem={({ item, index }) => (
                  <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                    <Text style={{ color: colors.gray23 }}>{item}</Text>
                    <TouchableOpacity onPress={() => removeFromList(index, setExperiences, experiences)} style={{ marginLeft: 8 }}>
                      <Text style={{ color: colors.orange360 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

              <Text style={{ color: colors.gray73, marginTop: 4 }}>Dias disponíveis</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
                {weekDays.map((d) => (
                  <TouchableOpacity key={d} onPress={() => toggleItem(selectedDays, d, setSelectedDays)} style={{ flexDirection: "row", alignItems: "center", marginRight: 12, marginBottom: 8 }}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        borderWidth: 1.5,
                        borderColor: selectedDays.includes(d) ? colors.green85F : colors.grayE8,
                        backgroundColor: selectedDays.includes(d) ? colors.green85F : "#fff",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 8,
                      }}
                    >
                      {selectedDays.includes(d) && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
                    </View>
                    <Text style={{ color: colors.gray73 }}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Target Audience */}
              <Text style={{ color: colors.gray73, marginBottom: 6 }}>Público atendido</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
                {audienceOptions.map((opt) => {
                  const selected = selectedAudience.includes(opt);
                  return (
                    <TouchableOpacity
                      key={opt}
                      activeOpacity={0.8}
                      onPress={() =>
                        setSelectedAudience((prev) =>
                          prev.includes(opt) ? prev.filter((p) => p !== opt) : [...prev, opt]
                        )
                      }
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: 12,
                        marginBottom: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          borderWidth: 1.5,
                          borderColor: selected ? colors.green85F : colors.grayE8,
                          backgroundColor: selected ? colors.green85F : "#fff",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 8,
                        }}
                      >
                        {selected && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
                      </View>
                      <Text style={{ color: colors.gray73 }}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (userRole === "client" ? (
            <View style={{ gap: 8 }}>
              <Text style={{ color: colors.gray73, marginTop: 4 }}>Condições</Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <Input placeholder="Adicionar condição" value={conditionInput} onChangeText={setConditionInput} style={{ flex: 1, backgroundColor: colors.gray7FD, borderRadius: 8 }} />
                <TouchableOpacity onPress={() => addToList(conditionInput, setConditions, conditions, setConditionInput)} style={{ marginLeft: 8, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}>
                  <Text style={{ color: "#fff" }}>Adicionar</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={conditions}
                horizontal
                renderItem={({ item, index }) => (
                  <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                    <Text style={{ color: colors.gray23 }}>{item}</Text>
                    <TouchableOpacity onPress={() => removeFromList(index, setConditions, conditions)} style={{ marginLeft: 8 }}>
                      <Text style={{ color: colors.orange360 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

              <Text style={{ color: colors.gray73, marginTop: 4 }}>Alergias</Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <Input placeholder="Adicionar alergia" value={allergyInput} onChangeText={setAllergyInput} style={{ flex: 1, backgroundColor: colors.gray7FD, borderRadius: 8 }} />
                <TouchableOpacity onPress={() => addToList(allergyInput, setAllergies, allergies, setAllergyInput)} style={{ marginLeft: 8, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}>
                  <Text style={{ color: "#fff" }}>Adicionar</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={allergies}
                horizontal
                renderItem={({ item, index }) => (
                  <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                    <Text style={{ color: colors.gray23 }}>{item}</Text>
                    <TouchableOpacity onPress={() => removeFromList(index, setAllergies, allergies)} style={{ marginLeft: 8 }}>
                      <Text style={{ color: colors.orange360 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

              <Text style={{ color: colors.gray73, marginTop: 4 }}>Medicamentos</Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <Input placeholder="Adicionar medicamento" value={medicationInput} onChangeText={setMedicationInput} style={{ flex: 1, backgroundColor: colors.gray7FD, borderRadius: 8 }} />
                <TouchableOpacity onPress={() => addToList(medicationInput, setMedications, medications, setMedicationInput)} style={{ marginLeft: 8, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}>
                  <Text style={{ color: "#fff" }}>Adicionar</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={medications}
                horizontal
                renderItem={({ item, index }) => (
                  <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                    <Text style={{ color: colors.gray23 }}>{item}</Text>
                    <TouchableOpacity onPress={() => removeFromList(index, setMedications, medications)} style={{ marginLeft: 8 }}>
                      <Text style={{ color: colors.orange360 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          ) : null)}

          {/* Languages */}
          <Text style={{ color: colors.gray73, marginTop: 4 }}>Idiomas</Text>
          <View style={{ flexDirection: "row", marginBottom: 0 }}>
            <Input placeholder="Adicionar idioma" value={languageInput} onChangeText={setLanguageInput} style={{ flex: 1, backgroundColor: colors.gray7FD, borderRadius: 8 }} />
            <TouchableOpacity onPress={() => addToList(languageInput, setLanguages, languages, setLanguageInput)} style={{ marginLeft: 8, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}>
              <Text style={{ color: "#fff" }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={languages}
            horizontal
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                <Text style={{ color: colors.gray23 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromList(index, setLanguages, languages)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.orange360 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Text style={{ color: colors.gray73, marginTop: 4, marginBottom: 4 }}>Observações</Text>
          <TextInput
            value={observations}
            onChangeText={setObservations}
            placeholder="Anotações, restrições, orientações..."
            placeholderTextColor={colors.gray75}
            style={{
              backgroundColor: colors.gray7FD,
              borderRadius: 8,
              height: 100,
              textAlignVertical: "top",
              padding: 12,
              marginBottom: 12,
            }}
            multiline
          />

          <PrimaryButton title={saving ? "Salvando..." : "Salvar informações específicas"} onPress={handleSaveSpecific} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
