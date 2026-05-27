import { CalendarDays } from "lucide-react-native";
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

interface LoanCardProps {
  tituloLivro: string;
  status: "Em_andamento" | "Devolvido" | "Atrasado";
  dataLocacao: string;
  dataPrevistaDevolucao: string;
  imagemLivro?: string;
}

const statusConfig = {
  Devolvido: {
    label: "Devolvido",
    backgroundColor: "#DDFCEF",
    borderColor: "#7CE3C3",
    textColor: "#00A884",
  },
  Em_andamento: {
    label: "Em andamento",
    backgroundColor: "#FFF4D6",
    borderColor: "#F5C542",
    textColor: "#C97900",
  },
  Atrasado: {
    label: "Atrasado",
    backgroundColor: "#FFE1E1",
    borderColor: "#FF9B9B",
    textColor: "#D92D2D",
  },
};

export function LoanCard({
  tituloLivro,
  status,
  dataLocacao,
  dataPrevistaDevolucao,
  imagemLivro,
}: LoanCardProps) {
  const { width } = useWindowDimensions();

  const isSmallScreen = width <= 360;
  const currentStatus = statusConfig[status];

  const imageAreaWidth = isSmallScreen ? 58 : 80;
  const bookImageWidth = isSmallScreen ? 48 : 64;
  const bookImageHeight = isSmallScreen ? 72 : 96;

  return (
    <View style={styles.card}>
      <View style={styles.inner}>
        <View style={[styles.imageArea, { width: imageAreaWidth }]}>
          {imagemLivro ? (
            <Image
              source={{ uri: imagemLivro }}
              style={[
                styles.bookImage,
                {
                  width: bookImageWidth,
                  height: bookImageHeight,
                },
              ]}
            />
          ) : null}
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[styles.title, isSmallScreen && styles.titleSmall]}
              numberOfLines={1}
            >
              {tituloLivro}
            </Text>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: currentStatus.backgroundColor,
                  borderColor: currentStatus.borderColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: currentStatus.textColor },
                  isSmallScreen && styles.badgeTextSmall,
                ]}
              >
                {currentStatus.label}
              </Text>
            </View>
          </View>

          <View style={styles.dates}>
            <View style={styles.infoRow}>
              <CalendarDays size={isSmallScreen ? 13 : 14} color="#6B7280" />
              <Text
                style={[styles.infoText, isSmallScreen && styles.infoTextSmall]}
                numberOfLines={1}
              >
                Locação: {dataLocacao}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <CalendarDays size={isSmallScreen ? 13 : 14} color="#6B7280" />
              <Text
                style={[styles.infoText, isSmallScreen && styles.infoTextSmall]}
                numberOfLines={1}
              >
                Devolução: {dataPrevistaDevolucao}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 146,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 0.83,
    borderColor: "#E5E7EB",
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  inner: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },

  imageArea: {
    justifyContent: "center",
    alignItems: "flex-start",
  },

  bookImage: {
    borderRadius: 6,
    resizeMode: "cover",
  },

  content: {
    flex: 1,
    minWidth: 0,
    justifyContent: "space-between",
    gap: 12,
  },

  header: {
    gap: 8,
  },

  title: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "500",
    color: "#222222",
    flexShrink: 1,
  },

  titleSmall: {
    fontSize: 20,
    lineHeight: 24,
  },

  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },

  badgeText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "500",
  },

  badgeTextSmall: {
    fontSize: 13,
    lineHeight: 17,
  },

  dates: {
    gap: 4,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  infoText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#6B7280",
    flexShrink: 1,
  },

  infoTextSmall: {
    fontSize: 14,
    lineHeight: 18,
  },
});
