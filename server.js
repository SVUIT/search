require('dotenv').config();
const express = require('express');
const { Client, Databases } = require('node-appwrite');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Appwrite client
const client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.get('/api/subjects', async (req, res) => {
    const search = req.query.search || '';
    try {
        const response = await databases.listDocuments(process.env.APPWRITE_DATABASE_ID,process.env.APPWRITE_COLLECTION_ID, [
        ]);
        const subjects = response.documents.filter(subject => subject.name.includes(search));
        res.json({ subjects });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});