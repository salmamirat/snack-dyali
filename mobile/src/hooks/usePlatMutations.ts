import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import api from "../api/axios";

export const usePlatMutations = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/plats/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plats"] });
    },
    onError: () => {
      Alert.alert("Erreur", "Impossible de supprimer en mode hors-ligne.");
    }
  });

  const toggleDispoMutation = useMutation({
    mutationFn: async ({ id, disponible }: { id: number, disponible: boolean }) => {
      await api.put(`/plats/${id}`, { disponible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plats"] });
    },
    onError: () => {
      Alert.alert("Erreur", "Modification impossible hors-ligne.");
    }
  });

  return { deleteMutation, toggleDispoMutation };
};
