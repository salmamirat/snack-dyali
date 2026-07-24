import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Switch } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { platSchema, PlatFormData } from "../schemas/plat.schema";

interface PlatFormProps {
  initialValues?: Partial<PlatFormData>;
  onSubmit: (data: PlatFormData) => void;
  isLoading: boolean;
  submitLabel: string;
  onCancel: () => void;
}

export default function PlatForm({ initialValues, onSubmit, isLoading, submitLabel, onCancel }: PlatFormProps) {
  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<PlatFormData>({
    resolver: zodResolver(platSchema),
    defaultValues: {
      nom: initialValues?.nom || "",
      categorie: initialValues?.categorie || "",
      prix: initialValues?.prix || "",
      disponible: initialValues?.disponible ?? true,
    }
  });

  const disponible = watch("disponible");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un nouveau plat</Text>
      <Text style={styles.subtitle}>Remplissez les informations ci-dessous pour mettre à jour votre carte.</Text>

      <View style={styles.field}>
        <Text style={styles.label}>NOM DU PLAT</Text>
        <Controller
          control={control}
          name="nom"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.nom && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Ex: Tacos Mixte"
              placeholderTextColor="#5f5e5e"
            />
          )}
        />
        {errors.nom && <Text style={styles.errorText}>{errors.nom.message}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>PRIX (MAD)</Text>
        <Controller
          control={control}
          name="prix"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={[styles.inputWrapper, errors.prix && styles.inputError]}>
              <TextInput
                style={styles.inputNoBorder}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#5f5e5e"
              />
              <Text style={styles.currency}>DH</Text>
            </View>
          )}
        />
        {errors.prix && <Text style={styles.errorText}>{errors.prix.message}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>CATÉGORIE</Text>
        <Controller
          control={control}
          name="categorie"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.categorie && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Choisir une catégorie"
              placeholderTextColor="#5f5e5e"
            />
          )}
        />
        {errors.categorie && <Text style={styles.errorText}>{errors.categorie.message}</Text>}
      </View>

      <View style={styles.switchContainer}>
        <View>
          <Text style={styles.switchLabel}>Disponible</Text>
          <Text style={styles.switchSub}>Affiché sur le menu client</Text>
        </View>
        <Switch
          value={disponible}
          onValueChange={(val) => setValue("disponible", val)}
          trackColor={{ false: "#e2e2e2", true: "#ff8c42" }}
          thumbColor="#ffffff"
        />
      </View>

      <TouchableOpacity 
        style={styles.btnPrimary} 
        onPress={handleSubmit(onSubmit as any)}
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
