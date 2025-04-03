/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/**
 * Firebase Cloud Functions for Propagentic
 * Maintenance request classification using OpenAI
 */

// Load environment variables from .env file
require("dotenv").config();

// Initialize Firebase Admin SDK
const admin = require("firebase-admin");
admin.initializeApp();

// Import and export the classifyMaintenanceRequest function
exports.classifyMaintenanceRequest = require("./classifyMaintenanceRequest").classifyMaintenanceRequest;

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
