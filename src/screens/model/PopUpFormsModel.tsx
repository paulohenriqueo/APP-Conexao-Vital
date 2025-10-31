import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PrimaryButton, SecondaryButton } from "../../components/Button";
import { popUpStyles as styles } from "../model/PopUpStyles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectPatient: () => void;
  onSelectCaregiver: () => void;
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
            <PrimaryButton title="Paciente" onPress={onSelectPatient}></PrimaryButton>
            <SecondaryButton title="Cuidador" onPress={onSelectCaregiver} ></SecondaryButton>
            {/* 
            <TouchableOpacity style={[styles.button, styles.patient]} onPress={onSelectPatient}>
              <Text style={styles.buttonText}>Paciente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.caregiver]} onPress={onSelectCaregiver}>
              <Text style={styles.buttonTextSecondary}>Cuidador</Text>
            </TouchableOpacity> */}
          </View>

          <TouchableOpacity style={styles.skip} onPress={onClose}>
            <Text style={styles.skipText}>Pular</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
