import { render } from "@testing-library/react-native";
import { LoanCard } from "../src/components/LoanCard";

const loanCardProps = {
  tituloLivro: "Dom Casmurro",
  nomeCliente: "Bentinho",
  status: "Em_andamento" as const,
  dataLocacao: "01/06/2026",
  dataPrevistaDevolucao: "10/06/2026",
};

describe("LoanCard", () => {
  it("renderiza o título do livro", () => {
    const { getByText } = render(<LoanCard {...loanCardProps} />);

    expect(getByText("Dom Casmurro")).toBeTruthy();
  });

  it("renderiza o nome do cliente", () => {
    const { getByText } = render(<LoanCard {...loanCardProps} />);

    expect(getByText("Nome do Cliente: Bentinho")).toBeTruthy();
  });

  it("renderiza o status em andamento formatado", () => {
    const { getByText } = render(<LoanCard {...loanCardProps} />);

    expect(getByText("Em andamento")).toBeTruthy();
  });

  it("renderiza o status devolvido formatado", () => {
    const { getByText } = render(
      <LoanCard {...loanCardProps} status="Devolvido" />,
    );

    expect(getByText("Devolvido")).toBeTruthy();
  });

  it("renderiza o status atrasado formatado", () => {
    const { getByText } = render(
      <LoanCard {...loanCardProps} status="Atrasado" />,
    );

    expect(getByText("Atrasado")).toBeTruthy();
  });

  it("renderiza as datas do empréstimo", () => {
    const { getByText } = render(<LoanCard {...loanCardProps} />);

    expect(getByText("Locação: 01/06/2026")).toBeTruthy();
    expect(getByText("Devolução: 10/06/2026")).toBeTruthy();
  });

  it("renderiza fallback quando não possui imagem", () => {
    const { getByText } = render(<LoanCard {...loanCardProps} />);

    expect(getByText("Sem capa")).toBeTruthy();
  });
});
