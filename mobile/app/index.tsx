import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageSourcePropType,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { LoanCard } from "../src/components/LoanCard";
import { SearchButton } from "../src/components/SearchButton";
import { SearchInput } from "../src/components/SearchInput";
import api from "../src/services/api";

interface EmprestimoApi {
  id: string;
  livro_id: string;
  nome_cliente: string;
  email_cliente: string;
  data_locacao: string;
  data_prevista_devolucao: string;
  data_devolucao_real: string | null;
  data_lembrete_preventivo_enviado?: string | null;
  data_ultimo_lembrete_atraso?: string | null;
  status: "Em_andamento" | "Devolvido" | "Atrasado";
}

interface LivroApi {
  id: string;
  titulo: string;
  autor?: string;
  categoria?: string;
  genero?: string;
}

interface Emprestimo {
  id: string;
  tituloLivro: string;
  nomeCliente: string;
  status: "Em_andamento" | "Devolvido" | "Atrasado";
  dataLocacao: string;
  dataPrevistaDevolucao: string;
  imagemLivro?: ImageSourcePropType;
}

const capasPorCategoria: Record<string, ImageSourcePropType> = {
  ciencias: require("../src/assets/capasLivros/ciencia.png"),
  ciências: require("../src/assets/capasLivros/ciencia.png"),
  historia: require("../src/assets/capasLivros/historia.png"),
  história: require("../src/assets/capasLivros/historia.png"),
  infantil: require("../src/assets/capasLivros/infantil.png"),
  tecnologia: require("../src/assets/capasLivros/tecnologia.png"),
  romance: require("../src/assets/capasLivros/romance.png"),
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getLivroImagem(livro?: LivroApi) {
  const categoria = livro?.categoria || livro?.genero;

  if (!categoria) {
    return undefined;
  }

  return capasPorCategoria[normalizeText(categoria)];
}

function mapEmprestimoApiToEmprestimo(
  emprestimo: EmprestimoApi,
  livros: LivroApi[],
): Emprestimo {
  const livro = livros.find((item) => item.id === emprestimo.livro_id);

  return {
    id: emprestimo.id,
    tituloLivro: livro?.titulo || "Livro não informado",
    nomeCliente: emprestimo.nome_cliente,
    status: emprestimo.status,
    dataLocacao: formatDate(emprestimo.data_locacao),
    dataPrevistaDevolucao: formatDate(emprestimo.data_prevista_devolucao),
    imagemLivro: getLivroImagem(livro),
  };
}

export default function Home() {
  const { width } = useWindowDimensions();

  const isSmallScreen = width <= 360;

  const [nome, setNome] = useState("");
  const [todosEmprestimos, setTodosEmprestimos] = useState<Emprestimo[]>([]);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  async function loadEmprestimos() {
    try {
      setLoading(true);
      setErro("");

      const [emprestimosResponse, livrosResponse] = await Promise.all([
        api.get("/emprestimos/"),
        api.get("/livros/"),
      ]);

      const emprestimosData = Array.isArray(emprestimosResponse.data)
        ? emprestimosResponse.data
        : [];

      const livrosData = Array.isArray(livrosResponse.data)
        ? livrosResponse.data
        : [];

      const emprestimosFormatados = emprestimosData.map(
        (emprestimo: EmprestimoApi) =>
          mapEmprestimoApiToEmprestimo(emprestimo, livrosData),
      );

      setTodosEmprestimos(emprestimosFormatados);
      setEmprestimos(emprestimosFormatados);
    } catch {
      setTodosEmprestimos([]);
      setEmprestimos([]);
      setErro("Não foi possível carregar os empréstimos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    const termoBusca = normalizeText(nome);

    setErro("");
    setBuscaRealizada(true);

    if (!termoBusca) {
      setEmprestimos(todosEmprestimos);
      return;
    }

    const emprestimosFiltrados = todosEmprestimos.filter((emprestimo) => {
      const nomeCliente = normalizeText(emprestimo.nomeCliente);
      const tituloLivro = normalizeText(emprestimo.tituloLivro);

      return (
        nomeCliente.includes(termoBusca) || tituloLivro.includes(termoBusca)
      );
    });

    setEmprestimos(emprestimosFiltrados);
  }

  useEffect(() => {
    loadEmprestimos();
  }, []);

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
          placeholder="Nome do cliente ou livro"
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

        {!erro && emprestimos.length > 0 ? (
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
            !loading && !erro && buscaRealizada ? (
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
    paddingTop: 20,
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
