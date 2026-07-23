const openapi = {
  openapi: "3.0.0",

  info: {
    title: "Snack Dyali API",
    version: "1.0.0",
    description: "API de gestion des plats"
  },

  servers: [
    {
      url: "http://localhost:3000"
    }
  ],

  paths: {
    "/api/plats": {
      get: {
        summary: "Liste des plats",
        responses: {
          200: {
            description: "Liste des plats"
          }
        }
      },

      post: {
        summary: "Créer un plat",
        responses: {
          201: {
            description: "Plat créé"
          }
        }
      }
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
              type: "integer"
            }
          }
        ],
        responses: {
          200: {
            description: "Plat trouvé"
          },
          404: {
            description: "Plat introuvable"
          }
        }
      },

      put: {
        summary: "Modifier un plat",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          200: {
            description: "Plat modifié"
          }
        }
      },

      delete: {
        summary: "Supprimer un plat",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          204: {
            description: "Plat supprimé"
          }
        }
      }
    }
  }
};

module.exports = openapi;