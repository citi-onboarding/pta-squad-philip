import {
  Image,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export function MobileHeader() {
  const { width } = useWindowDimensions();

  const isSmallScreen = width <= 360;

  return (
    <View style={styles.header}>
      <View
        style={[
          styles.content,
          {
            paddingHorizontal: isSmallScreen ? 24 : 43,
            gap: isSmallScreen ? 14 : 24,
          },
        ]}
      >
        <Image
          source={require("../../assets/icons/logoCiti_semfundo 1.png")}
          style={[
            styles.logo,
            {
              width: isSmallScreen ? 55 : 69,
              height: isSmallScreen ? 26 : 32,
            },
          ]}
          resizeMode="contain"
        />

        <Text
          style={[
            styles.title,
            {
              fontSize: isSmallScreen ? 20 : 22,
              lineHeight: isSmallScreen ? 25 : 28,
            },
          ]}
          numberOfLines={1}
        >
          Meus Empréstimos
        </Text>
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

    ...Platform.select({
      web: {
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.12)",
      },
      default: {
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 4,
      },
    }),
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    flexShrink: 0,
  },

  title: {
    flex: 1,
    color: "#222222",
    fontWeight: "500",
  },
});
