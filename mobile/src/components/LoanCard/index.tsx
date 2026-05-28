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
  nomeCliente: string;
  status: "Em_andamento" | "Devolvido" | "Atrasado";
  dataLocacao: string;
  dataPrevistaDevolucao: string;
  imagemLivro: string;
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
  nomeCliente,
  status,
  dataLocacao,
  dataPrevistaDevolucao,
  imagemLivro,
}: LoanCardProps) {
  const { width } = useWindowDimensions();

  const isSmallScreen = width <= 360;
  const currentStatus = statusConfig[status];

  const imageAreaWidth = isSmallScreen ? 60 : 76;
  const imageWidth = isSmallScreen ? 52 : 64;
  const imageHeight = isSmallScreen ? 78 : 96;

  return (
    <View style={styles.card}>
      <View style={styles.inner}>
        <View style={[styles.imageArea, { width: imageAreaWidth }]}>
          <Image
            source={{ uri: imagemLivro }}
            style={[
              styles.bookImage,
              {
                width: imageWidth,
                height: imageHeight,
              },
            ]}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[styles.title, isSmallScreen && styles.titleSmall]}
              numberOfLines={1}
            >
              {tituloLivro}
            </Text>

            <Text
              style={[
                styles.clientName,
                isSmallScreen && styles.clientNameSmall,
              ]}
              numberOfLines={1}
            >
              {nomeCliente}
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
    padding: 16,
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
    backgroundColor: "#E5E7EB",
  },

  content: {
    flex: 1,
    minWidth: 0,
    justifyContent: "space-between",
    gap: 10,
  },

  header: {
    gap: 4,
  },

  title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "500",
    color: "#222222",
    flexShrink: 1,
  },

  titleSmall: {
    fontSize: 18,
    lineHeight: 22,
  },

  clientName: {
    fontSize: 14,
    lineHeight: 18,
    color: "#6B7280",
    flexShrink: 1,
  },

  clientNameSmall: {
    fontSize: 12,
    lineHeight: 16,
  },

  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },

  badgeText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "500",
  },

  badgeTextSmall: {
    fontSize: 12,
    lineHeight: 16,
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
    fontSize: 14,
    lineHeight: 18,
    color: "#6B7280",
    flexShrink: 1,
  },

  infoTextSmall: {
    fontSize: 13,
    lineHeight: 17,
  },
});
