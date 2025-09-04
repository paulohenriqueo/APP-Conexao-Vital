import { TouchableOpacity, Text, Image, View, ActivityIndicator, Alert } from "react-native";
import { styles } from "./styles/Button";
import React from "react";
import Google from '../assets/google_logo.png'

type ButtonProps = {
    title: string;
    onPress: () => void;
};

export function PrimaryButton({ title, onPress }: ButtonProps) {

    return (
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.buttonText}>{title}</Text>
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
            <Image source={Google} style={styles.buttonIcon} />
            <Text style={styles.googleButtonText}>{title}</Text>
        </TouchableOpacity>
    );
}

