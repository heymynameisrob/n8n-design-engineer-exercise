import { NodesProvider } from "@/components/provider/provider-node";
import { ThemeProvider } from "@/components/provider/provider-theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NodesProvider>{children}</NodesProvider>
    </ThemeProvider>
  );
}
