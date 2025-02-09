export async function onRequest(context) {
    return new Response(JSON.stringify({
        ENDPOINT: context.env.ENDPOINT,
        PROJECT_ID: context.env.PROJECT_ID,
        DATABASE_ID: context.env.DATABASE_ID,
        COLLECTION_ID: context.env.COLLECTION_ID,
        APPWRITE_ID: context.env.APPWRITE_ID
    }), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
        }
    });
}
