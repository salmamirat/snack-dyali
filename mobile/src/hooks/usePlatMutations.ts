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
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["plats"] });
      const previousPlats = queryClient.getQueryData(["plats"]);
      queryClient.setQueryData(["plats"], (old: any) => {
        if (!old) return old;
        return old.map((plat: any) => 
          plat.id === variables.id ? { ...plat, disponible: variables.disponible } : plat
        );
      });
      return { previousPlats };
    },
    onError: (err, variables, context) => {
      if (context?.previousPlats) queryClient.setQueryData(["plats"], context.previousPlats);
      Alert.alert("Erreur", "Modification impossible hors-ligne.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["plats"] });
    }
  });

  return { deleteMutation, toggleDispoMutation };
};
