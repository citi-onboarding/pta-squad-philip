import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { LoanCard } from "../src/components/LoanCard";
import { SearchButton } from "../src/components/SearchButton";
import { SearchInput } from "../src/components/SearchInput";
import api from "../src/services/api";

interface Emprestimo {
  id: string;
  tituloLivro: string;
  nomeCliente: string;
  status: "Em_andamento" | "Devolvido" | "Atrasado";
  dataLocacao: string;
  dataPrevistaDevolucao: string;
  imagemLivro: string;
}

export default function Home() {
  const { width } = useWindowDimensions();

  const isSmallScreen = width <= 360;

  const [nome, setNome] = useState("");
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  async function handleSearch() {
    const nomeCliente = nome.trim();

    if (!nomeCliente) {
      setEmprestimos([]);
      setErro("Digite um nome ou título para buscar.");
      setBuscaRealizada(true);
      return;
    }

    try {
      setLoading(true);
      setErro("");
      setBuscaRealizada(true);

      const response = await api.get(
        `/emprestimos/cliente?nome=${encodeURIComponent(nomeCliente)}`,
      );

      setEmprestimos(response.data);
    } catch {
      setEmprestimos([]);
      setErro("Não foi possível buscar os empréstimos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingHorizontal: isSmallScreen ? 24 : 42,
            paddingTop: isSmallScreen ? 24 : 30,
          },
        ]}
      >
        <SearchInput
          value={nome}
          onChangeText={setNome}
          placeholder="Nome ou título do livro"
        />

        <View style={styles.buttonContainer}>
          <SearchButton onPress={handleSearch} disabled={loading} />

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#00C389" />
            </View>
          ) : null}
        </View>

        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

        {!erro && buscaRealizada && emprestimos.length > 0 ? (
          <Text style={styles.resultCounter}>
            {emprestimos.length} empréstimo(s) encontrado(s)
          </Text>
        ) : null}

        <FlatList
          data={emprestimos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            emprestimos.length === 0 ? styles.emptyListContent : null,
          ]}
          renderItem={({ item }) => (
            <LoanCard
              tituloLivro={item.tituloLivro}
              nomeCliente={item.nomeCliente}
              status={item.status}
              dataLocacao={item.dataLocacao}
              dataPrevistaDevolucao={item.dataPrevistaDevolucao}
              imagemLivro={item.imagemLivro}
            />
          )}
          ListEmptyComponent={
            buscaRealizada && !loading && !erro ? (
              <Text style={styles.emptyText}>Nenhum empréstimo encontrado</Text>
            ) : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F7",
  },

  content: {
    flex: 1,
  },

  buttonContainer: {
    marginTop: 16,
  },

  loadingContainer: {
    marginTop: 12,
    alignItems: "center",
  },

  resultCounter: {
    fontSize: 17,
    color: "#6B7280",
    marginTop: 32,
    marginBottom: 20,
  },

  errorText: {
    fontSize: 15,
    color: "#D92D2D",
    marginTop: 16,
  },

  listContent: {
    gap: 22,
    paddingBottom: 24,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 18,
    color: "#6B7280",
  },
});
