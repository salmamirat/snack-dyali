import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RefreshCcw, WifiOff } from "lucide-react-native";

interface SyncBannerProps {
  isOffline: boolean;
  lastSyncText: string;
  onForceSync?: () => void;
}

export default function SyncBanner({ isOffline, lastSyncText, onForceSync }: SyncBannerProps) {
  return (
    <View>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <WifiOff size={14} color="#ffffff" />
          <Text style={styles.offlineText}>Mode hors ligne : affichage des données enregistrées.</Text>
        </View>
      )}
      <View style={styles.syncStatusContainer}>
        <View style={styles.syncStatus}>
          <RefreshCcw size={14} color="#564338" />
          <Text style={styles.syncStatusText}>Dernière synchro : {lastSyncText}</Text>
        </View>
        {onForceSync && (
          <TouchableOpacity onPress={onForceSync} style={styles.forceSyncBtn}>
            <Text style={styles.forceSyncText}>Forcer la synchro</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  offlineBanner: { backgroundColor: "#5f5e5e", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 8, gap: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  offlineText: { color: "#ffffff", fontSize: 12, fontWeight: "600" },
  syncStatusContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#f3f3f3", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginBottom: 16 },
  syncStatus: { flexDirection: "row", alignItems: "center", gap: 6 },
  syncStatusText: { color: "#564338", fontSize: 12 },
  forceSyncBtn: { backgroundColor: "#ff8c42", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  forceSyncText: { color: "#ffffff", fontSize: 11, fontWeight: "600" },
});
