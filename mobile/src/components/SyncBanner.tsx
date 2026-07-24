import { View, Text, StyleSheet } from "react-native";
import { RefreshCcw, WifiOff } from "lucide-react-native";

interface SyncBannerProps {
  isOffline: boolean;
  lastSyncText: string;
}

export default function SyncBanner({ isOffline, lastSyncText }: SyncBannerProps) {
  return (
    <View>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <WifiOff size={14} color="#ffffff" />
          <Text style={styles.offlineText}>Mode hors ligne : affichage des données enregistrées.</Text>
        </View>
      )}
      <View style={styles.syncStatus}>
        <RefreshCcw size={14} color="#5f5e5e" />
        <Text style={styles.syncStatusText}>Dernière synchronisation : {lastSyncText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  offlineBanner: { backgroundColor: "#5f5e5e", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 8, gap: 8 },
  offlineText: { color: "#ffffff", fontSize: 12, fontWeight: "600" },
  syncStatus: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#f3f3f3", padding: 8, borderRadius: 8, marginBottom: 16 },
  syncStatusText: { color: "#564338", fontSize: 12 },
});
