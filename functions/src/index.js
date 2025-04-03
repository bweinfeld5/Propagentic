// Initialize Firebase Admin SDK
const admin = require("firebase-admin");
admin.initializeApp();

// Import the classifyMaintenanceRequest function
const {classifyMaintenanceRequest} = require("./classifyMaintenanceRequest");

// Export the cloud functions
exports.classifyMaintenanceRequest = classifyMaintenanceRequest;
