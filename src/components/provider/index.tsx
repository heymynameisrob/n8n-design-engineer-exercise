import { ThemeProvider } from "@/components/provider/provider-theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
