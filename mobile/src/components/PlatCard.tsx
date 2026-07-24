import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { Edit2, Trash2 } from "lucide-react-native";
import { Plat } from "../types/plat";

interface PlatCardProps {
  plat: Plat;
  onEdit: () => void;
  onDelete: () => void;
  onToggleDispo: (value: boolean) => void;
}

export default function PlatCard({ plat, onEdit, onDelete, onToggleDispo }: PlatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <View style={styles.dispoBadgeWrapper}>
          <Text style={[styles.dispoBadge, !plat.disponible && styles.ruptureBadge]}>
            {plat.disponible ? "Disponible" : "Indisponible"}
          </Text>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.platCat}>{plat.categorie.toUpperCase()}</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.platNom}>{plat.nom}</Text>
          <Text style={styles.platPrix}>{plat.prix} DH</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardActions}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Disponibilité</Text>
            <Switch
              value={plat.disponible}
              onValueChange={onToggleDispo}
              trackColor={{ false: "#e2e2e2", true: "#ff8c42" }}
              thumbColor="#ffffff"
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
              <Edit2 size={16} color="#564338" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
              <Trash2 size={16} color="#ba1a1a" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#ffffff", borderRadius: 16, overflow: "hidden", marginBottom: 12, elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  imagePlaceholder: { height: 140, backgroundColor: "#eeeeee", padding: 12, alignItems: "flex-end" },
  dispoBadgeWrapper: { backgroundColor: "#ffffff", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  dispoBadge: { color: "#006e1c", fontSize: 11, fontWeight: "700" },
  ruptureBadge: { color: "#ba1a1a" },
  cardInfo: { padding: 12 },
  platCat: { color: "#564338", fontSize: 11, fontWeight: "700", marginBottom: 4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  platNom: { fontSize: 16, fontWeight: "600", color: "#1a1c1c" },
  platPrix: { fontSize: 16, fontWeight: "600", color: "#1a1c1c" },
  divider: { height: 1, backgroundColor: "#f3f3f3", marginVertical: 12 },
  cardActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  switchRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  switchLabel: { fontSize: 12, color: "#564338" },
  actionButtons: { flexDirection: "row", gap: 16 },
  iconBtn: { padding: 4 },
});
