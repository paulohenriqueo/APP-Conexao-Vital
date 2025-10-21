import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectPatient: () => void;
  onSelectCaregiver?: () => void;
};

export default function PopUpFormsModel({
  visible,
  onClose,
  onSelectPatient,
  onSelectCaregiver,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Complete seu cadastro</Text>
          <Text style={styles.message}>
            Para continuar, informe se você é um paciente ou cuidador.
          </Text>

          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.patient]} onPress={onSelectPatient}>
              <Text style={styles.buttonText}>Paciente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.caregiver]}
              onPress={onSelectCaregiver ?? onClose}
            >
              <Text style={styles.buttonTextSecondary}>Cuidador</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.skip} onPress={onClose}>
            <Text style={styles.skipText}>Pular</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "84%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  message: { fontSize: 14, color: "#444", marginBottom: 18, textAlign: "center" },
  row: { flexDirection: "row", width: "100%", justifyContent: "space-between" },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  patient: { backgroundColor: "#00996D", marginRight: 8 },
  caregiver: { backgroundColor: "#E6EEF1", marginLeft: 8 },
  buttonText: { color: "#fff", fontWeight: "700" },
  buttonTextSecondary: { color: "#2A2A2A", fontWeight: "700" },
  skip: { marginTop: 12 },
  skipText: { color: "#666", textDecorationLine: "underline" },
});