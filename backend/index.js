import express from "express";
import cors from "cors";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    credentials: true
}));

// Initialize Firebase Admin
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        })
    });
}

const db = getFirestore();

// Routes

// GET /notes - Get all notes
app.get("/notes", async (req, res) => {
    try {
        const notesRef = db.collection("notes");
        const snapshot = await notesRef.orderBy("createdAt", "desc").get();
        
        const notes = [];
        snapshot.forEach(doc => {
            notes.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        res.json(notes);
    } catch (error) {
        console.error("Error getting notes:", error);
        res.status(500).json({ error: "Failed to get notes" });
    }
});

// POST /notes - Create a new note
app.post("/notes", async (req, res) => {
    try {
        const { title, content } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }
        
        const noteData = {
            title,
            content: content || "",
            createdAt: new Date()
        };
        
        const docRef = await db.collection("notes").add(noteData);
        
        res.status(201).json({
            id: docRef.id,
            ...noteData
        });
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: "Failed to create note" });
    }
});

// DELETE /notes/:id - Delete a note
app.delete("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const noteRef = db.collection("notes").doc(id);
        const noteDoc = await noteRef.get();
        
        if (!noteDoc.exists) {
            return res.status(404).json({ error: "Note not found" });
        }
        
        await noteRef.delete();
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ error: "Failed to delete note" });
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "FSAB Notes API is running" });
});

// Start server
app.listen(port, () => {
    console.log(`FSAB Notes Backend running at http://localhost:${port}`);
});