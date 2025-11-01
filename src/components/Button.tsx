import { TouchableOpacity, Text, Image, View, ActivityIndicator, Alert } from "react-native";
import { styles } from "./styles/Button";
import React from "react";
import Google from '../assets/google_logo.png'

type ButtonProps = {
    title: string;
    onPress: () => void;
    icon?: React.ReactNode;
};
export function PrimaryButton({ title, onPress, icon }: ButtonProps) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

export function SecondaryButton({ title, onPress, icon }: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onPress} activeOpacity={0.7}>
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

