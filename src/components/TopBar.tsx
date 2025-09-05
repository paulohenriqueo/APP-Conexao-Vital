import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "../components/styles/TopBar";
import Logo from '../assets/logo_icon.png'


export const TopBar = ({ title }: { title: string }) => {
  return (
    <View style={styles.topBar}>
      <Image source={Logo} style={{ height: 40, width: 40 }} />
      {/* <Text style={styles.topBarText}>{title}</Text> */}
    </View>
  );
};
