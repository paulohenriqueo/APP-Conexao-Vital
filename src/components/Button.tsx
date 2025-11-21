import { TouchableOpacity, Text, Image, View, ActivityIndicator, Alert } from "react-native";
import { styles } from "./styles/Button";
import React from "react";
import Google from '../assets/google_logo.png'
import { colors } from "../../styles/colors";

type ButtonProps = {
    title?: string;
    onPress: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    type?: "aceitar" | "recusar";
};

export function PrimaryButton({ title, onPress, icon, disabled }: ButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button,
            disabled && { opacity: 0.5 }]}
            onPress={disabled ? undefined : onPress}
            activeOpacity={0.7}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

export function SecondaryButton({ title, onPress, icon, disabled }: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, styles.secondaryButton, disabled && { opacity: 0.5 }]} onPress={onPress} activeOpacity={0.7}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
                <Text style={styles.secondaryButtonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

export function OutlinedButton({ title, onPress, icon }: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, styles.buttonOutilined]} onPress={onPress} activeOpacity={0.7}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
                <Text style={styles.buttonOutilinedText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

export function ActionButton({ title, onPress, icon, disabled, type }: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: type === "aceitar" ? colors.greenAcceptBg : colors.redc0019 }, disabled && { opacity: 0.5 }]} onPress={onPress} activeOpacity={0.7}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
                <Text style={[styles.actionButtonText, { color: type === "aceitar" ? colors.greenAccept : colors.redc00 }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

export function CircleButton({ icon, type, onPress }: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.circleButton, { backgroundColor: type === "aceitar" ? colors.greenAcceptBg : colors.redc0019 }]} onPress={onPress} activeOpacity={0.8}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {icon}
            </View>
        </TouchableOpacity>
    );
}

type GoogleButtonProps = {
    title?: string;
    onPress: () => void;
};

export function GoogleButton({ title = "Continue com Google", onPress }: GoogleButtonProps) {
    return (
        <TouchableOpacity style={styles.googleButton} onPress={onPress} activeOpacity={0.5}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={Google} style={styles.buttonIcon} />
                <Text style={styles.googleButtonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}