/**
 * Firebase Cloud Functions for Propagentic
 * Using lazy loading and optimized initialization for all functions.
 */

const {onInit} = require("firebase-functions/v2/core");
const logger = require("firebase-functions/logger");

// Initialize Firebase Admin SDK ONLY when needed, not at the top level
let admin; 
function getAdmin() {
  if (!admin) {
    admin = require("firebase-admin");
    if (!admin.apps.length) {
      admin.initializeApp();
      logger.info("Firebase Admin initialized.");
    }
  }
  return admin;
}

// Use onInit to load environment variables during cold start
onInit(async () => {
  try {
    // Load environment variables during cold start, not during deployment
    require("dotenv").config();
    logger.info("Environment variables loaded via dotenv.");
    
    logger.info("Function initialization completed via onInit.");
  } catch (error) {
    logger.error("Error during onInit initialization:", error);
  }
});

// Helper function for creating lazy-loaded exports
function defineLazyLoadedFunction(exportName, filePath, functionName) {
  let loadedFunction;
  Object.defineProperty(exports, exportName, {
    enumerable: true, // Make it show up during discovery
    get: function() {
      if (!loadedFunction) {
        logger.info(`Lazy loading ${exportName} function from ${filePath}...`);
        getAdmin(); // Ensure admin is initialized if needed by any function
        loadedFunction = require(filePath)[functionName];
        if (!loadedFunction) {
            logger.error(`Failed to load function ${functionName} from ${filePath}. Check the file and export name.`);
            // Optionally throw an error or return a dummy function
            throw new Error(`Function ${functionName} not found in ${filePath}`);
        }
        logger.info(`${exportName} function loaded.`);
      }
      return loadedFunction;
    }
  });
}

// Define all your functions using the lazy loader helper with correct file paths
defineLazyLoadedFunction('classifyMaintenanceRequest', './classifyMaintenanceRequest', 'classifyMaintenanceRequest');
defineLazyLoadedFunction('matchContractorToTicket', './matchContractorToTicket', 'matchContractorToTicket');
defineLazyLoadedFunction('notifyAssignedContractor', './notifyAssignedContractor', 'notifyAssignedContractor');

// Functions from userRelationships.js
defineLazyLoadedFunction('sendTenantInvitation', './userRelationships', 'sendTenantInvitation');
defineLazyLoadedFunction('addContractorToRolodex', './userRelationships', 'addContractorToRolodex');

// Functions from notificationTriggers.js
defineLazyLoadedFunction('notifyNewMaintenanceRequest', './notificationTriggers', 'notifyNewMaintenanceRequest');
defineLazyLoadedFunction('notifyTicketStatusChange', './notificationTriggers', 'notifyTicketStatusChange');

// Function from cleanupNotifications.js
defineLazyLoadedFunction('cleanupOldNotifications', './cleanupNotifications', 'cleanupOldNotifications');

logger.info("Lazy function definitions complete in index.js.");
