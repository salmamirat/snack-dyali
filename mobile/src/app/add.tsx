import { View, StyleSheet, Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import api from "../api/axios";
import PlatForm from "../components/PlatForm";

export default function AddPlat() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newPlat: any) => {
      const { data } = await api.post("/plats", {
        ...newPlat,
        prix: Number(newPlat.prix)
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plats"] });
      router.back();
    },
    onError: () => {
      Alert.alert("Erreur", "Une erreur est survenue");
    }
  });

  return (
    <View style={styles.container}>
      <PlatForm 
        onSubmit={(data) => mutation.mutate(data)} 
        isLoading={mutation.isPending} 
        submitLabel="Enregistrer" 
        onCancel={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
});
