import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { styles } from "./styles/Modal";

export const CompleteProfileModal = ({
  visible,
  text,
  primaryText = "Completar",
  secondaryText = "Depois",
  onPressPrimary,
  onPressSecondary,
}: {
  visible: boolean;
  text: string;
  primaryText?: string;
  secondaryText?: string;
  onPressPrimary: () => void;
  onPressSecondary: () => void;
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.completeModal}>
          <Text style={styles.modalText}>{text}</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={onPressSecondary}
            >
              <Text style={styles.outlineButtonText}>{secondaryText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onPressPrimary}
            >
              <Text style={styles.primaryButtonText}>{primaryText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
