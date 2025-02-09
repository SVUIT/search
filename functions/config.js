export async function onRequest(context) {
    return new Response(JSON.stringify({
      endpoint: context.env.APPWRITE_ENDPOINT,
      projectId: context.env.APPWRITE_PROJECT_ID,
      databaseId: context.env.APPWRITE_DATABASE_ID,
      collectionId: context.env.APPWRITE_COLLECTION_ID,
      appwriteApiKey: context.env.APPWRITE_API_KEY
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  