import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { registerBackgroundSync } from "../services/backgroundTask";
import { Stack as ExpoStack } from "expo-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

export default function Layout() {
  useEffect(() => {
    registerBackgroundSync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ExpoStack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f9f9f9",
          },
          headerTintColor: "#9b4500",
          headerTitleStyle: {
            fontFamily: "Inter",
            fontWeight: "bold",
          },
          headerShadowVisible: false,
        }}
      >
        <ExpoStack.Screen name="index" options={{ headerShown: false }} />
        <ExpoStack.Screen name="add" options={{ title: "Snack Dyali", presentation: "modal" }} />
        <ExpoStack.Screen name="edit/[id]" options={{ title: "Snack Dyali", presentation: "modal" }} />
      </ExpoStack>
    </QueryClientProvider>
  );
}
