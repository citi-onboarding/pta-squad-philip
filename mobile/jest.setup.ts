/// <reference types="jest" />

jest.mock("lucide-react-native", () => ({
  CalendarDays: () => null,
  Search: () => null,
}));
