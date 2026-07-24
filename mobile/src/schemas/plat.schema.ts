import { z } from "zod";

export const platSchema = z.object({
  nom: z.string().min(1, "Le nom est obligatoire"),
  prix: z.string().min(1, "Le prix est obligatoire").regex(/^[0-9]+(\.[0-9]{1,2})?$/, "Prix invalide"),
  categorie: z.string().min(1, "La catégorie est obligatoire"),
  disponible: z.boolean(),
});

export type PlatFormData = z.infer<typeof platSchema>;
