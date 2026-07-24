import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axios";
import { Plat } from "../types/plat";

export const usePlats = (setLastSyncDate: (date: string) => void, setIsOffline: (status: boolean) => void) => {
  return useQuery<Plat[]>({
    queryKey: ["plats"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/plats");
        await AsyncStorage.setItem("plats_cache", JSON.stringify(data));
        const now = new Date().toISOString();
        await AsyncStorage.setItem("last_sync", now);
        setLastSyncDate(now);
        setIsOffline(false);
        return data;
      } catch (error) {
        setIsOffline(true);
        const cached = await AsyncStorage.getItem("plats_cache");
        const lastSync = await AsyncStorage.getItem("last_sync");
        if (lastSync) setLastSyncDate(lastSync);
        if (cached) return JSON.parse(cached);
        throw error;
      }
    }
  });
};
