import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "import.meta.env.VITE_ENDPOINT": JSON.stringify(process.env.VITE_ENDPOINT),
    "import.meta.env.VITE_PROJECT_ID": JSON.stringify(process.env.VITE_PROJECT_ID),
    "import.meta.env.VITE_DATABASE_ID": JSON.stringify(process.env.VITE_DATABASE_ID),
    "import.meta.env.VITE_COLLECTION_ID": JSON.stringify(process.env.VITE_COLLECTION_ID),
    "import.meta.env.VITE_APPWRITE_ID": JSON.stringify(process.env.VITE_APPWRITE_ID),
  },
});