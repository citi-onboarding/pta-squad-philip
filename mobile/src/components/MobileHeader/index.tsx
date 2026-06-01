import { Image, StyleSheet, Text, View } from "react-native";

export function MobileHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/icons/logoCiti_semfundo 1.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Meus Empréstimos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 61,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.83,
    borderBottomColor: "#DADDE1",
    justifyContent: "center",
    paddingBottom: 0.83,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 4,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 43,
    gap: 12,
  },

  logo: {
    width: 69,
    height: 32,
  },

  title: {
    width: 200,
    height: 28,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "500",
    color: "#222222",
  },
});
