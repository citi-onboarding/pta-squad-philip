import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface SearchButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export function SearchButton({ onPress, disabled = false }: SearchButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.buttonDisabled : null]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{disabled ? "Buscando..." : "Buscar"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 60,
    backgroundColor: "#00C389",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
});
