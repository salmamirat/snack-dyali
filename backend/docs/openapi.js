const openapi = {
  openapi: "3.0.0",

  info: {
    title: "Snack Dyali API",
    version: "1.0.0",
    description: "API de gestion des plats",
  },

  servers: [
    {
      url: "http://localhost:3000",
    },
  ],

  paths: {
    "/api/plats": {
      get: {
        summary: "Liste des plats",
        responses: {
          200: {
            description: "Liste des plats",
          },
        },
      },

      post: {
        summary: "Créer un plat",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PlatInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Plat créé",
          },
        },
      },
    },

    "/api/plats/{id}": {
      get: {
        summary: "Afficher un plat",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Plat trouvé",
          },
          404: {
            description: "Plat introuvable",
          },
        },
      },

      put: {
        summary: "Modifier un plat",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PlatInput",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Plat modifié",
          },
        },
      },

      delete: {
        summary: "Supprimer un plat",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          204: {
            description: "Plat supprimé",
          },
        },
      },
    },
  },

  components: {
    schemas: {
      Plat: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          nom: {
            type: "string",
            example: "Pizza",
          },
          prix: {
            type: "number",
            example: 55,
          },
          categorie: {
            type: "string",
            example: "Fast Food",
          },
          disponible: {
            type: "boolean",
            example: true,
          },
          created_at: {
            type: "string",
            format: "date-time",
          },
        },
      },
      PlatInput: {
        type: "object",
        properties: {
          nom: {
            type: "string",
            example: "Pizza",
          },
          prix: {
            type: "number",
            example: 55,
          },
          categorie: {
            type: "string",
            example: "Fast Food",
          },
          disponible: {
            type: "boolean",
            example: true,
          },
        },
        required: ["nom", "prix", "categorie"],
      },
    },
  },
};

module.exports = openapi;