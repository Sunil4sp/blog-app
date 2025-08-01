const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact.js');

router.post('/contact', async (req, res) => {
try {
    const { name, email, subject, message } = req.body;

    const newContact = new Contact({
        name,
        email,
        subject,
        message
    });

    await newContact.save();
    res.status(200).json({ message: 'Contact form submitted successfully!' });
    } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;