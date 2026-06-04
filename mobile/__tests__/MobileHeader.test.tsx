import { render } from "@testing-library/react-native";
import { MobileHeader } from "../src/components/MobileHeader";

describe("MobileHeader", () => {
  it("renderiza o título da tela", () => {
    const { getByText } = render(<MobileHeader />);

    expect(getByText("Meus Empréstimos")).toBeTruthy();
  });
});
