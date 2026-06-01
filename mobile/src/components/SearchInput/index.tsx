import { Search } from "lucide-react-native";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Nome ou título do livro",
}: SearchInputProps) {
  return (
    <View style={styles.container}>
      <Search size={24} color="#6B7280" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8C8C96"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 62,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFE3E8",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },

  input: {
    flex: 1,
    fontSize: 20,
    color: "#242424",
    paddingVertical: 0,
  },
});
