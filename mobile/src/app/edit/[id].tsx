import { View, StyleSheet, Alert, ActivityIndicator, Text } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../api/axios";
import PlatForm from "../../components/PlatForm";

export default function EditPlat() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: plat, isLoading, isError } = useQuery({
    queryKey: ["plat", id],
    queryFn: async () => {
      const { data } = await api.get(`/plats/${id}`);
      return data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (updatedPlat: any) => {
      const { data } = await api.put(`/plats/${id}`, {
        ...updatedPlat,
        prix: Number(updatedPlat.prix)
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plats"] });
      queryClient.invalidateQueries({ queryKey: ["plat", id] });
      router.back();
    },
    onError: () => {
      Alert.alert("Erreur", "Une erreur est survenue");
    }
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F2994A" />
      </View>
    );
  }

  if (isError || !plat) {
    return (
      <View style={styles.center}>
        <Text>Erreur de chargement du plat</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PlatForm 
        initialValues={{
          nom: plat.nom,
          categorie: plat.categorie,
          prix: plat.prix.toString(),
          disponible: plat.disponible,
        }}
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
