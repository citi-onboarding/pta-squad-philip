import { fireEvent, render } from "@testing-library/react-native";
import { SearchButton } from "../src/components/SearchButton";

describe("SearchButton", () => {
  it("renderiza o texto padrão Buscar", () => {
    const { getByText } = render(<SearchButton onPress={jest.fn()} />);

    expect(getByText("Buscar")).toBeTruthy();
  });

  it("chama onPress quando o botão é pressionado", () => {
    const onPress = jest.fn();

    const { getByText } = render(<SearchButton onPress={onPress} />);

    fireEvent.press(getByText("Buscar"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renderiza Buscando... quando está desabilitado", () => {
    const { getByText } = render(<SearchButton onPress={jest.fn()} disabled />);

    expect(getByText("Buscando...")).toBeTruthy();
  });

  it("não chama onPress quando está desabilitado", () => {
    const onPress = jest.fn();

    const { getByText } = render(<SearchButton onPress={onPress} disabled />);

    fireEvent.press(getByText("Buscando..."));

    expect(onPress).not.toHaveBeenCalled();
  });
});
