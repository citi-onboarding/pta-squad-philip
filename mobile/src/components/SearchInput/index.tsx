import { Search } from "lucide-react-native";
import { StyleSheet, TextInput, useWindowDimensions, View } from "react-native";

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
  const { width } = useWindowDimensions();

  const isSmallScreen = width <= 360;

  return (
    <View
      style={[
        styles.container,
        {
          height: isSmallScreen ? 56 : 62,
          paddingHorizontal: isSmallScreen ? 14 : 16,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Search size={isSmallScreen ? 22 : 24} color="#6B7280" />
      </View>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8C8C96"
        style={[
          styles.input,
          {
            fontSize: isSmallScreen ? 17 : 20,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFE3E8",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 28,
    alignItems: "flex-start",
    justifyContent: "center",
    flexShrink: 0,
  },

  input: {
    flex: 1,
    minWidth: 0,
    color: "#242424",
    paddingVertical: 0,
    paddingLeft: 6,
  },
});
