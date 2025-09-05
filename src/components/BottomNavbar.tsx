import { House, User, Clock } from "phosphor-react-native";
import { View, TouchableOpacity, Text } from "react-native";
import { colors } from "../../styles/colors";
import { styles } from "./styles/BottomNavbar";

type BottomNavBarProps = {
  selected: string;
  onSelect: (key: string) => void;
};

export const BottomNavBar = ({ selected, onSelect }: BottomNavBarProps) => {
  return (
    <View style={styles.bottomNav}>
      {[
        { key: "history", label: "Histórico", icon: Clock },
        { key: "home", label: "Início", icon: House },
        { key: "profile", label: "Perfil", icon: User },
      ].map((item) => {
        const isSelected = selected === item.key;
        const IconComponent = item.icon;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => onSelect(item.key)}
          >
            <View
              style={[
                styles.iconContainer,
                isSelected && styles.iconContainerSelected,
              ]}
            >
              <IconComponent
                size={24}
                color={isSelected ? colors.orange360 : colors.gray23}
                weight={isSelected ? "regular" : "regular"}
              />
            </View>
            <Text
              style={[
                styles.navItemText,
                isSelected && styles.navItemTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
