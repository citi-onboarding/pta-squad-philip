import { CalendarDays } from "lucide-react-native";
import { Image, StyleSheet, Text, View } from "react-native";

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
  const currentStatus = statusConfig[status];

  return (
    <View style={styles.card}>
      <View style={styles.inner}>
        <View style={styles.imageArea}>
          {imagemLivro ? (
            <Image source={{ uri: imagemLivro }} style={styles.bookImage} />
          ) : null}
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
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
                style={[styles.badgeText, { color: currentStatus.textColor }]}
              >
                {currentStatus.label}
              </Text>
            </View>
          </View>

          <View style={styles.dates}>
            <View style={styles.infoRow}>
              <CalendarDays size={14} color="#6B7280" />
              <Text style={styles.infoText}>Locação: {dataLocacao}</Text>
            </View>

            <View style={styles.infoRow}>
              <CalendarDays size={14} color="#6B7280" />
              <Text style={styles.infoText}>
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
    height: 146,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 0.83,
    borderColor: "#E5E7EB",
    paddingTop: 16.82,
    paddingRight: 16.82,
    paddingBottom: 0.83,
    paddingLeft: 16.82,
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
    height: 112,
    flexDirection: "row",
    gap: 12,
  },

  imageArea: {
    width: 80,
    height: 112,
  },

  bookImage: {
    width: 80,
    height: 112,
    borderRadius: 6,
    resizeMode: "cover",
  },

  content: {
    width: 290,
    height: 112,
    justifyContent: "space-between",
  },

  header: {
    width: 290,
    height: 59,
  },

  title: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "500",
    color: "#222222",
    marginBottom: 8,
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

  dates: {
    width: 290,
    height: 44,
    gap: 4,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 20,
  },

  infoText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#6B7280",
  },
});
