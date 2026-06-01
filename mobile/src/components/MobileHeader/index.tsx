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

  const isCompactScreen = width <= 480;

  return (
    <View style={styles.header}>
      <View
        style={[
          styles.content,
          {
            paddingLeft: isCompactScreen ? 28 : 43,
            paddingRight: isCompactScreen ? 16 : 24,
            gap: isCompactScreen ? 14 : 24,
          },
        ]}
      >
        <Image
          source={require("../../assets/icons/logoCiti_semfundo 1.png")}
          style={[
            styles.logo,
            {
              width: isCompactScreen ? 54 : 69,
              height: isCompactScreen ? 25 : 32,
            },
          ]}
          resizeMode="contain"
        />

        <Text
          style={[
            styles.title,
            {
              fontSize: isCompactScreen ? 18 : 26,
              lineHeight: isCompactScreen ? 22 : 28,
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
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  logo: {
    flexShrink: 0,
  },

  title: {
    color: "#222222",
    fontWeight: "500",
    flexShrink: 1,
  },
});
