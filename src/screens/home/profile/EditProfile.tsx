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
import { CaretLeft } from "phosphor-react-native";
import { careCategories } from "../../../../utils/careCategories";
import { capitalizeFirstLetter } from "../../../../utils/formatUtils";
import { useEditProfile } from "../../../../utils/useEditProfile";
import { PhotoPicker } from "../../../components/PhotoPicker";
import { Avatar } from "../../../components/Avatar";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { maskCEP, maskPhone } from "../../../../utils/validationUtils";

export default function EditProfile() {
  const navigation = useNavigation<any>();
  const {
    // Gerais
    currentProfileType, loading, saving,

    // Pessoais
    photo, setPhoto,
    handleSelectPhoto,
    phone, setPhone,
    cep, setCep,
    street, setStreet,
    neighborhood, setNeighborhood,
    city, setCity,
    state, setState,
    handleSavePersonal,
    fetchAddress,

    // Específicas
    careCategory, setCareCategory,
    selectedPeriods, setSelectedPeriods,
    periodOptions,
    languages, setLanguages,
    languageInput, setLanguageInput,
    observations, setObservations,
    toggleItem,
    addToList,
    removeFromList,

    // Profissional
    qualifications, setQualifications,
    qualificationInput, setQualificationInput,
    experiences, setExperiences,
    experienceInput, setExperienceInput,
    selectedAudience, setSelectedAudience,
    selectedDays, setSelectedDays,

    // Cliente
    conditions, setConditions,
    conditionInput, setConditionInput,
    allergies, setAllergies,
    allergyInput, setAllergyInput,
    medications, setMedications,
    medicationInput, setMedicationInput,

    // Salvar
    handleSaveSpecific,
  } = useEditProfile();

  // Opções fixas
  const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const audienceOptions = ["Crianças", "Adultos", "Idosos"];

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
          <PhotoPicker
            value={photo}
            onChange={(uri) => {
              setPhoto(uri);
            }}
          />

          <Input placeholder="Telefone" value={phone} onChangeText={(text) => setPhone(maskPhone(text))} keyboardType="phone-pad" />
          <Input placeholder="CEP" value={cep} onChangeText={(text) => setCep(maskCEP(text))} onBlur={() => fetchAddress(cep)} keyboardType="numeric" />
          <Input placeholder="Rua" value={street} onChangeText={(text) => (setStreet(capitalizeFirstLetter(text)))} />
          <Input placeholder="Bairro" value={neighborhood} onChangeText={(text) => (setNeighborhood(capitalizeFirstLetter(text)))} />
          <Input placeholder="Cidade" value={city} onChangeText={(text) => (setCity(capitalizeFirstLetter(text)))} />
          <Input placeholder="Estado" value={state} onChangeText={(text) => (setState(capitalizeFirstLetter(text)))} />

          <PrimaryButton title={saving ? "Salvando..." : "Salvar informações pessoais"} onPress={handleSavePersonal} />
        </View>

        {/* Seção 2 — Informações específicas */}
        <View style={[styles.containerBox, { width: "90%", marginTop: 20, backgroundColor: "#fff", borderRadius: 24, padding: 20, paddingTop: 20, gap: 8 }]}>
          <Text style={[typography.M01M1824, { color: colors.gray23, marginBottom: 8, marginTop: 0 }]}> Informações específicas</Text>
          {currentProfileType === "caregiver" ? (
            <Text style={{ color: colors.gray75, marginBottom: 8 }}>Área de atuação</Text>
          ) : (currentProfileType === "patient" ? (
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
          {currentProfileType === "caregiver" ? (
            <View style={{ gap: 8 }}>
              <Text style={{ color: colors.gray73, marginTop: 4 }}>Qualificações</Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <Input placeholder="Adicionar qualificação" value={qualificationInput} onChangeText={(text) => (setQualificationInput(capitalizeFirstLetter(text)))} style={{ flex: 1, backgroundColor: colors.gray7FD, borderRadius: 8 }} />
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
                <Input placeholder="Adicionar experiência" value={experienceInput} onChangeText={(text) => (setExperienceInput(capitalizeFirstLetter(text)))} style={{ flex: 1, backgroundColor: colors.gray7FD, borderRadius: 8 }} />
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
          ) : (currentProfileType === "patient" ? (
            <View style={{ gap: 8 }}>
              <Text style={{ color: colors.gray73, marginTop: 4 }}>Condições</Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <Input placeholder="Adicionar condição" value={conditionInput} onChangeText={(text) => (setConditionInput(capitalizeFirstLetter(text)))} style={{ flex: 1, backgroundColor: colors.gray7FD, borderRadius: 8 }} />
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
                <Input placeholder="Adicionar alergia" value={allergyInput} onChangeText={(text) => (setAllergyInput(capitalizeFirstLetter(text)))} style={{ flex: 1, backgroundColor: colors.gray7FD, borderRadius: 8 }} />
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
                <Input placeholder="Adicionar medicamento" value={medicationInput} onChangeText={(text) => (setMedicationInput(capitalizeFirstLetter(text)))} style={{ flex: 1, backgroundColor: colors.gray7FD, borderRadius: 8 }} />
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
          ) : <></>)}

          {/* Languages */}
          <Text style={{ color: colors.gray73, marginTop: 4 }}>Idiomas</Text>
          <View style={{ flexDirection: "row", marginBottom: 0 }}>
            <Input placeholder="Adicionar idioma" value={languageInput} onChangeText={(text) => (setLanguageInput(capitalizeFirstLetter(text)))} style={{ flex: 1, backgroundColor: colors.gray7FD, borderRadius: 8 }} />
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
            onChangeText={(text) => (setObservations(capitalizeFirstLetter(text)))}
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
