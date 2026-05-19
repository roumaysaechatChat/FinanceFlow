// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permet au serveur de lire le format JSON

// 1. Connexion à MongoDB (en local sur ton PC)
const MONGO_URI = 'mongodb://127.0.0.1:27017/financeflow';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connecté à MongoDB avec succès !'))
    .catch(err => console.error('Erreur de connexion à la DB:', err));

// 2. Création du Modèle (Schema) pour les Transactions
const TransactionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);


app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/api/transactions', async (req, res) => {
    const { text, amount } = req.body;
    const newTransaction = new Transaction({ text, amount });

    try {
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.delete('/api/transactions/:id', async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction supprimée avec succès !' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));