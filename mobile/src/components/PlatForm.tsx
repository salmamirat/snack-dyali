import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Switch } from "react-native";

interface PlatFormProps {
  initialValues?: {
    nom: string;
    prix: string;
    categorie: string;
    disponible: boolean;
  };
  onSubmit: (data: { nom: string; prix: string; categorie: string; disponible: boolean }) => void;
  isLoading: boolean;
  submitLabel: string;
  onCancel: () => void;
}

export default function PlatForm({ initialValues, onSubmit, isLoading, submitLabel, onCancel }: PlatFormProps) {
  const isEditing = !!initialValues?.nom;

  const [nom, setNom] = useState(initialValues?.nom || "");
  const [prix, setPrix] = useState(initialValues?.prix || "");
  const [categorie, setCategorie] = useState(initialValues?.categorie || "");
  const [disponible, setDisponible] = useState(initialValues?.disponible ?? true);

  const [errors, setErrors] = useState<{ nom?: string; prix?: string; categorie?: string }>({});

  const validate = () => {
    const newErrors: { nom?: string; prix?: string; categorie?: string } = {};

    if (!nom.trim()) {
      newErrors.nom = "Le nom est obligatoire";
    }

    if (!prix.trim()) {
      newErrors.prix = "Le prix est obligatoire";
    } else if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(prix)) {
      newErrors.prix = "Prix invalide";
    }

    if (!categorie.trim()) {
      newErrors.categorie = "La catégorie est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePressSubmit = () => {
    if (validate()) {
      onSubmit({ nom, prix, categorie, disponible });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? "Modifier le plat" : "Ajouter un nouveau plat"}</Text>
      <Text style={styles.subtitle}>
        {isEditing 
          ? "Modifier les informations ci-dessous pour mettre à jour le plat." 
          : "Remplissez les informations ci-dessous pour mettre à jour votre carte."}
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>NOM DU PLAT</Text>
        <TextInput
          style={[styles.input, errors.nom && styles.inputError]}
          onChangeText={setNom}
          value={nom}
          placeholder="Ex: Tacos Poulet"
          placeholderTextColor="#5f5e5e"
        />
        {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>PRIX (MAD)</Text>
        <View style={[styles.inputWrapper, errors.prix && styles.inputError]}>
          <TextInput
            style={styles.inputNoBorder}
            onChangeText={setPrix}
            value={prix}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor="#5f5e5e"
          />
          <Text style={styles.currency}>DH</Text>
        </View>
        {errors.prix && <Text style={styles.errorText}>{errors.prix}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>CATÉGORIE</Text>
        <TextInput
          style={[styles.input, errors.categorie && styles.inputError]}
          onChangeText={setCategorie}
          value={categorie}
          placeholder="Ex: Sandwichs"
          placeholderTextColor="#5f5e5e"
        />
        {errors.categorie && <Text style={styles.errorText}>{errors.categorie}</Text>}
      </View>

      <View style={styles.switchContainer}>
        <View>
          <Text style={styles.switchLabel}>Disponible</Text>
          <Text style={styles.switchSub}>Affiché sur le menu client</Text>
        </View>
        <Switch
          value={disponible}
          onValueChange={setDisponible}
          trackColor={{ false: "#e2e2e2", true: "#ff8c42" }}
          thumbColor="#ffffff"
        />
      </View>

      <TouchableOpacity 
        style={styles.btnPrimary} 
        onPress={handlePressSubmit}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.btnPrimaryText}>{submitLabel}</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSecondary} onPress={onCancel}>
        <Text style={styles.btnSecondaryText}>Annuler</Text>
      </TouchableOpacity>

      <Text style={styles.footerNote}>Toutes les modifications sont synchronisées.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", padding: 16 },
  title: { fontSize: 24, fontWeight: "600", color: "#1a1c1c", marginBottom: 8, fontFamily: "Inter", letterSpacing: -0.01 },
  subtitle: { fontSize: 14, color: "#564338", marginBottom: 24, lineHeight: 20, fontFamily: "Inter" },
  field: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: "600", color: "#564338", marginBottom: 8, letterSpacing: 0.05, fontFamily: "Inter" },
  input: { backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#e2e2e2", borderRadius: 8, padding: 12, fontSize: 16, color: "#1a1c1c", fontFamily: "Inter" },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#e2e2e2", borderRadius: 8, paddingHorizontal: 12 },
  inputNoBorder: { flex: 1, paddingVertical: 12, fontSize: 16, color: "#1a1c1c", fontFamily: "Inter" },
  inputError: { borderColor: "#ba1a1a" },
  errorText: { color: "#ba1a1a", fontSize: 11, fontWeight: "700", fontFamily: "Inter", marginTop: 4 },
  currency: { color: "#1a1c1c", fontSize: 16, fontWeight: "600", fontFamily: "Inter" },
  switchContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#f3f3f3" },
  switchLabel: { fontSize: 16, color: "#1a1c1c", fontWeight: "400", marginBottom: 2, fontFamily: "Inter" },
  switchSub: { fontSize: 14, color: "#564338", fontFamily: "Inter" },
  btnPrimary: { backgroundColor: "#ff8c42", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  btnPrimaryText: { color: "#ffffff", fontSize: 16, fontWeight: "600", fontFamily: "Inter" },
  btnSecondary: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, alignItems: "center" },
  btnSecondaryText: { color: "#212121", fontSize: 16, fontWeight: "600", fontFamily: "Inter" },
  footerNote: { textAlign: "center", fontSize: 12, color: "#5f5e5e", marginTop: 24, fontFamily: "Inter", fontWeight: "600" },
});
