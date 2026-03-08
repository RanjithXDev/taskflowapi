import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskFlow API",
      version: "1.0.0",
      description: "API documentation for TaskFlow backend"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server"
      }
    ],
    tags: [
      { name: "Auth", description: "Authentication APIs" },
      { name: "Tasks", description: "Task management APIs" },
      { name: "Projects", description: "Project APIs" },
      { name: "Users", description: "User APIs" }
    ]
  },

  // swagger will scan these files for API documentation
  apis: ["src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);