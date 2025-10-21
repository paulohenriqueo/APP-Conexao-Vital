import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, styles, typography } from "../../../../styles/styles";
import { Input } from "../../../components/Input";

export default function PatientCondition({ navigation }: any) {
  const [cuidadoTotal, setCuidadoTotal] = useState(false);
  const [periodo, setPeriodo] = useState("");
  const [inicioPeriodo, setInicioPeriodo] = useState("");
  const [inicioPeriodoObj, setInicioPeriodoObj] = useState<Date | undefined>(undefined);
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [agreed, setAgreed] = useState(false);

  // listas dinâmicas
  const [alergiaInput, setAlergiaInput] = useState("");
  const [alergias, setAlergias] = useState<string[]>([]);

  const [medInput, setMedInput] = useState("");
  const [medicamentos, setMedicamentos] = useState<string[]>([]);

  const [condInput, setCondInput] = useState("");
  const [condicoes, setCondicoes] = useState<string[]>([]);

  const [idiomaInput, setIdiomaInput] = useState("");
  const [idiomasPreferidos, setIdiomasPreferidos] = useState<string[]>([]);

  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);

  const periodOptions = [
    { key: "matutino", label: "Matutino" },
    { key: "vespertino", label: "Vespertino" },
    { key: "noturno", label: "Noturno" },
  ];

  const addToList = (value: string, setter: (v: string[]) => void, list: string[], clear: (v: string) => void) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setter([...list, trimmed]);
    clear("");
  };

  const removeFromList = (index: number, setter: (v: string[]) => void, list: string[]) => {
    const copy = [...list];
    copy.splice(index, 1);
    setter(copy);
  };

  const togglePeriod = (key: string) => {
    setSelectedPeriods(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleInicioChange = (event: any, selectedDate?: Date) => {
    setShowInicioPicker(false);
    if (selectedDate) {
      setInicioPeriodoObj(selectedDate);
      const d = String(selectedDate.getDate()).padStart(2, "0");
      const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const y = selectedDate.getFullYear();
      setInicioPeriodo(`${d}/${m}/${y}`);
    }
  };

  const handleSave = () => {
    const payload = {
      cuidadoTotal,
      periodo,
      inicioPeriodo,
      observacoes,
      alergias,
      medicamentos,
      condicoes,
      idiomasPreferidos,
    };
    // salvar no backend ou state global
    console.log("Patient condition saved:", payload);
    navigation.navigate("Home");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.green382 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 50,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            typography.montserratBold,
            { 
                color: colors.whiteFBFE, 
                fontSize: 22, 
                marginBottom: 24, 
                alignSelf: "center",
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 90,
                paddingTop: 30 
            },
          ]}
        >
          Informações de cuidado
        </Text>

        <View
          style={[
            styles.containerBox,
            {
              width: "90%",
              maxWidth: 430,
              paddingTop: 20,
              paddingBottom: 24,
              borderRadius: 24,
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
            },
          ]}
        >
        <Text style={{ color: colors.gray73, marginBottom: 6 }}>Necessita de Cuidado Total?</Text>
          <TouchableOpacity
            onPress={() => setCuidadoTotal(!cuidadoTotal)}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
          >
            
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 1.5,
                borderColor: cuidadoTotal ? colors.green85F : colors.grayE8,
                backgroundColor: cuidadoTotal ? colors.green85F : "#fff",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}
            >
              {cuidadoTotal && <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>}
            </View>
            <Text style={{ color: colors.gray73 }}>Sim</Text>
          </TouchableOpacity>

          {/* Períodos como checkboxes (múltipla seleção) */}
          <Text style={{ color: colors.gray73, marginBottom: 8 }}>Período</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
            {periodOptions.map(opt => {
              const selected = selectedPeriods.includes(opt.key);
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => togglePeriod(opt.key)}
                  activeOpacity={0.8}
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
                  <Text style={{ color: colors.gray73 }}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* <TouchableOpacity onPress={() => setShowInicioPicker(true)} activeOpacity={0.9}>
            <Input placeholder="Início do período" value={inicioPeriodo} editable={false} pointerEvents="none" style={{ marginBottom: 12 }} />
          </TouchableOpacity>
          {showInicioPicker && (
            <DateTimePicker
              value={inicioPeriodoObj || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleInicioChange}
              maximumDate={new Date(2100, 0, 1)}
            />
          )} */}

          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Observações</Text>
          <TextInput
            value={observacoes}
            onChangeText={setObservacoes}
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

          {/* Alergias */}
          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Alergias</Text>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Input
              placeholder="Adicionar alergia"
              value={alergiaInput}
              onChangeText={setAlergiaInput}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={() => addToList(alergiaInput, setAlergias, alergias, setAlergiaInput)}
              style={{ marginLeft: 8, alignSelf: "center", paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}
            >
              <Text style={{ color: "#fff" }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={alergias}
            horizontal
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                <Text style={{ color: colors.gray23 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromList(index, setAlergias, alergias)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.orange360 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 12 }}
          />

          {/* Medicamentos */}
          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Medicamentos</Text>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Input placeholder="Adicionar medicamento" value={medInput} onChangeText={setMedInput} style={{ flex: 1 , flexDirection: "column", marginBottom: 8}} />
            <TouchableOpacity onPress={() => addToList(medInput, setMedicamentos, medicamentos, setMedInput)} style={{ marginLeft: 8, alignSelf: "center", paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}>
              <Text style={{ color: "#fff" }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={medicamentos}
            horizontal
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                <Text style={{ color: colors.gray23 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromList(index, setMedicamentos, medicamentos)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.orange360 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 12 }}
          />

          {/* Condições */}
          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Condições (ex: Diabetes, Hipertensão)</Text>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Input placeholder="Adicionar condição" value={condInput} onChangeText={setCondInput} style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => addToList(condInput, setCondicoes, condicoes, setCondInput)} style={{ marginLeft: 8, alignSelf: "center", paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}>
              <Text style={{ color: "#fff" }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={condicoes}
            horizontal
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                <Text style={{ color: colors.gray23 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromList(index, setCondicoes, condicoes)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.orange360 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 12 }}
          />

          {/* Idiomas preferidos */}
          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Idiomas preferidos</Text>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Input placeholder="Adicionar idioma" value={idiomaInput} onChangeText={setIdiomaInput} style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => addToList(idiomaInput, setIdiomasPreferidos, idiomasPreferidos, setIdiomaInput)} style={{ marginLeft: 8, alignSelf: "center", paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}>
              <Text style={{ color: "#fff" }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={idiomasPreferidos}
            horizontal
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                <Text style={{ color: colors.gray23 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromList(index, setIdiomasPreferidos, idiomasPreferidos)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.orange360 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 12 }}
          />

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 12,
              alignSelf: "flex-start",
            }}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 1.5,
                borderColor: agreed ? colors.green85F : colors.grayE8,
                backgroundColor: agreed ? colors.green85F : "#fff",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}
            >
              {agreed && (
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  ✓
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 13,
                color: colors.gray73,
                flexShrink: 1,
              }}
            >
              Declaro que todas as informações acima são verdadeiras
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: agreed ? colors.green382 : colors.grayE8,
              borderRadius: 8,
              width: "100%",
              alignItems: "center",
              paddingVertical: 14,
              marginTop: 8,
            }}
            onPress={handleSave}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}