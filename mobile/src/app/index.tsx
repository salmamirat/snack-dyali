import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Plus, RefreshCcw, Search, Home as HomeIcon, ShoppingBag, User } from "lucide-react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axios";
import { formatLastSync } from "../utils/date";
import { Plat } from "../types/plat";
import Loading from "../components/Loading";
import SyncBanner from "../components/SyncBanner";
import PlatCard from "../components/PlatCard";

export default function Home() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const netInfo = useNetInfo();
  const [isApiOffline, setIsApiOffline] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tout");

  const categories = ["Tout", "Sandwichs", "Tacos", "Boissons"];

  useEffect(() => {
    const loadInitialSyncTime = async () => {
      try {
        const storedSync = await AsyncStorage.getItem("last_sync");
        if (storedSync) {
          setLastSyncDate(storedSync);
        }
      } catch (error) {
        console.error("Error loading initial last_sync:", error);
      }
    };
    loadInitialSyncTime();
  }, []);

  const { data: plats, isLoading, refetch, isFetching } = useQuery<Plat[]>({
    queryKey: ["plats"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/plats");
        await AsyncStorage.setItem("plats_cache", JSON.stringify(data));
        const now = new Date().toISOString();
        await AsyncStorage.setItem("last_sync", now);
        setLastSyncDate(now);
        setIsApiOffline(false);
        return data;
      } catch (error) {
        setIsApiOffline(true);
        const cached = await AsyncStorage.getItem("plats_cache");
        const lastSync = await AsyncStorage.getItem("last_sync");
        if (lastSync) setLastSyncDate(lastSync);
        if (cached) return JSON.parse(cached);
        throw error;
      }
    }
  });

  const isOffline = netInfo.isConnected === false || isApiOffline;

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

  const handleDelete = (id: number) => {
    Alert.alert(
      "Supprimer ce plat ?",
      "Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => deleteMutation.mutate(id) },
      ]
    );
  };

  const filteredPlats = plats?.filter((p: Plat) => {
    const matchesSearch = p.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Tout" || p.categorie.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading && !plats) return <Loading />;

  return (
    <View style={styles.container}>
      <SyncBanner isOffline={isOffline} lastSyncText={formatLastSync(lastSyncDate)} onForceSync={refetch} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍔 Snack Dyali</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <RefreshCcw size={20} color="#ff8c42" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.pageTitle}>Liste des plats</Text>

        <View style={styles.searchContainer}>
          <Search size={20} color="#5f5e5e" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un plat..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#5f5e5e"
          />
        </View>

        <View style={styles.categories}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredPlats}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
          renderItem={({ item }) => (
            <PlatCard
              plat={item}
              onEdit={() => router.push(`/edit/${item.id}` as any)}
              onDelete={() => handleDelete(item.id)}
              onToggleDispo={(val) => toggleDispoMutation.mutate({ id: item.id, disponible: val })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Aucun plat trouvé</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <HomeIcon size={24} color="#ff8c42" />
          <Text style={[styles.navText, { color: "#ff8c42" }]}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <ShoppingBag size={24} color="#5f5e5e" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <User size={24} color="#5f5e5e" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add" as any)}>
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#ffffff" },
  headerTitle: { fontSize: 24, fontWeight: "600", color: "#9b4500" },
  content: { flex: 1, padding: 16 },
  pageTitle: { fontSize: 20, fontWeight: "600", color: "#1a1c1c", marginBottom: 16 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 8, paddingHorizontal: 12, height: 48, marginBottom: 16, borderWidth: 1, borderColor: "#e2e2e2" },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#1a1c1c" },
  categories: { flexDirection: "row", gap: 8, marginBottom: 16 },
  categoryPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#e2e2e2" },
  categoryPillActive: { backgroundColor: "#9b4500", borderColor: "#9b4500" },
  categoryText: { color: "#564338", fontSize: 14, fontWeight: "400" },
  categoryTextActive: { color: "#ffffff" },
  listContent: { paddingBottom: 100 },
  empty: { alignItems: "center", paddingTop: 48 },
  emptyText: { color: "#5f5e5e", fontSize: 14 },
  bottomNav: { flexDirection: "row", backgroundColor: "#ffffff", paddingVertical: 12, paddingHorizontal: 32, justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#f3f3f3" },
  navItem: { alignItems: "center", gap: 4 },
  navText: { fontSize: 11, color: "#5f5e5e", fontWeight: "700" },
  fab: { position: "absolute", bottom: 24, right: 16, backgroundColor: "#ff8c42", width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 },
});
