import { fireEvent, render } from "@testing-library/react-native";
import { SearchInput } from "../src/components/SearchInput";

describe("SearchInput", () => {
  it("renderiza o placeholder padrão", () => {
    const { getByPlaceholderText } = render(
      <SearchInput value="" onChangeText={jest.fn()} />,
    );

    expect(getByPlaceholderText("Nome ou título do livro")).toBeTruthy();
  });

  it("chama onChangeText quando o usuário digita", () => {
    const onChangeText = jest.fn();

    const { getByPlaceholderText } = render(
      <SearchInput value="" onChangeText={onChangeText} />,
    );

    fireEvent.changeText(
      getByPlaceholderText("Nome ou título do livro"),
      "Dom Casmurro",
    );

    expect(onChangeText).toHaveBeenCalledWith("Dom Casmurro");
  });

  it("renderiza placeholder customizado", () => {
    const { getByPlaceholderText } = render(
      <SearchInput
        value=""
        onChangeText={jest.fn()}
        placeholder="Buscar empréstimo"
      />,
    );

    expect(getByPlaceholderText("Buscar empréstimo")).toBeTruthy();
  });
});
