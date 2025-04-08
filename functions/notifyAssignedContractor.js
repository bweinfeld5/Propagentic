/**
 * Firebase Cloud Function to send notifications when a contractor is assigned to a ticket
 * This function sends emails and optional push notifications to the assigned contractor
 */

// Import Firebase Functions v2
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

/**
 * Cloud Function that triggers when a maintenance ticket is updated with an assigned contractor
 */
exports.notifyAssignedContractor = onDocumentUpdated({
  document: "tickets/{ticketId}",
  region: "us-central1",
}, async (event) => {
  try {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    
    // Check if a contractor was just assigned to this ticket
    if (!afterData.assignedTo || 
        (beforeData.assignedTo === afterData.assignedTo && 
         beforeData.status === afterData.status)) {
      // No new assignment happened
      return;
    }

    // Verify the status is 'assigned'
    if (afterData.status !== "assigned") {
      logger.info(
        `Ticket ${event.params.ticketId} assigned but status is not 'assigned'. ` +
        `Current status: ${afterData.status}`
      );
      return;
    }
    
    logger.info(`Contractor ${afterData.assignedTo} assigned to ticket ${event.params.ticketId}`);
    
    // Get the contractor user data
    const contractorSnapshot = await admin.firestore()
      .collection('users')
      .doc(afterData.assignedTo)
      .get();
    
    if (!contractorSnapshot.exists) {
      throw new Error(`Contractor user ${afterData.assignedTo} not found`);
    }
    
    const contractorData = contractorSnapshot.data();
    
    // Get property details
    const propertySnapshot = await admin.firestore()
      .collection('properties')
      .doc(afterData.propertyId)
      .get();
    
    if (!propertySnapshot.exists) {
      throw new Error(`Property ${afterData.propertyId} not found`);
    }
    
    const propertyData = propertySnapshot.data();
    
    // Prepare notification data
    const notificationData = {
      ticketId: event.params.ticketId,
      propertyName: propertyData.propertyName,
      propertyAddress: `${propertyData.address.street}, ${propertyData.address.city}, ${propertyData.address.state} ${propertyData.address.zip}`,
      unitNumber: afterData.unitNumber,
      category: afterData.category,
      urgency: afterData.urgency,
      description: afterData.description,
      assignedAt: new Date().toISOString(),
    };
    
    // Add to contractor's notifications collection
    await admin.firestore()
      .collection('notifications')
      .add({
        userId: afterData.assignedTo,
        userRole: 'contractor',
        type: 'assignment',
        data: notificationData,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    
    // Check if we should send an email notification
    if (contractorData.email) {
      await sendEmailNotification(
        contractorData.email,
        contractorData.name,
        notificationData
      );
    }
    
    // Check if we need to send a push notification
    // (This would use Firebase Cloud Messaging)
    await sendPushNotification(afterData.assignedTo, notificationData);
    
    logger.info(`Successfully notified contractor ${afterData.assignedTo} about assignment`);
    
  } catch (error) {
    logger.error("Error notifying assigned contractor:", error);
  }
});

/**
 * Send an email notification to the assigned contractor
 * 
 * @param {string} email - Contractor's email address
 * @param {string} name - Contractor's name
 * @param {Object} data - Notification data
 */
async function sendEmailNotification(email, name, data) {
  try {
    // In a production system, you would implement email sending here
    // using a service like SendGrid, Mailgun, or AWS SES
    
    logger.info(`Would send email to ${email} for ${name} about ticket ${data.ticketId}`);
    
    // Using Firebase Extensions for email would look something like this:
    // await admin.firestore().collection('mail').add({
    //   to: email,
    //   message: {
    //     subject: `New Maintenance Assignment: ${data.category} at ${data.propertyName}`,
    //     text: `Hello ${name},\n\nYou have been assigned a new maintenance request:\n\n` +
    //           `Property: ${data.propertyName}\n` +
    //           `Address: ${data.propertyAddress}\n` +
    //           `Unit: ${data.unitNumber}\n` +
    //           `Category: ${data.category}\n` +
    //           `Urgency: ${data.urgency}/5\n\n` +
    //           `Description: ${data.description}\n\n` +
    //           `Please log in to the Propagentic app to view details and respond.\n\n` +
    //           `Thank you,\nThe Propagentic Team`,
    //   }
    // });
    
  } catch (error) {
    logger.error(`Error sending email notification to ${email}:`, error);
  }
}

/**
 * Send a push notification to the assigned contractor
 * 
 * @param {string} contractorId - Contractor's user ID
 * @param {Object} data - Notification data
 */
async function sendPushNotification(contractorId, data) {
  try {
    // Check if the user has registered FCM tokens
    const tokensSnapshot = await admin.firestore()
      .collection('fcmTokens')
      .where('userId', '==', contractorId)
      .get();
    
    if (tokensSnapshot.empty) {
      logger.info(`No FCM tokens found for contractor ${contractorId}`);
      return;
    }
    
    // Get all valid tokens for the user
    const tokens = [];
    tokensSnapshot.forEach(doc => {
      tokens.push(doc.data().token);
    });
    
    if (tokens.length === 0) {
      return;
    }
    
    // Craft notification message
    const message = {
      notification: {
        title: `New Assignment: ${data.category}`,
        body: `You've been assigned to a ${data.urgency}/5 ${data.category} task at ${data.propertyName}`,
      },
      data: {
        ticketId: data.ticketId,
        type: 'new_assignment',
        propertyId: data.propertyId,
        createdAt: data.assignedAt,
      },
      tokens: tokens,
    };
    
    // Send the notifications - in a production app, you would uncomment this
    // const response = await admin.messaging().sendMulticast(message);
    logger.info(`Would send push notifications to ${tokens.length} devices for contractor ${contractorId}`);
    
    // Clean up invalid tokens
    // if (response.failureCount > 0) {
    //   // Loop through failed messages
    //   response.responses.forEach((resp, idx) => {
    //     if (!resp.success) {
    //       logger.warn(`Failed to send notification to token: ${tokens[idx]}`, resp.error);
    //       // Remove invalid tokens
    //       if (resp.error.code === 'messaging/invalid-registration-token' || 
    //           resp.error.code === 'messaging/registration-token-not-registered') {
    //         deleteInvalidToken(tokens[idx]);
    //       }
    //     }
    //   });
    // }
    
  } catch (error) {
    logger.error(`Error sending push notification to contractor ${contractorId}:`, error);
  }
}

/**
 * Delete invalid FCM token from Firestore
 * 
 * @param {string} token - The invalid FCM token to remove
 */
async function deleteInvalidToken(token) {
  try {
    const snapshot = await admin.firestore()
      .collection('fcmTokens')
      .where('token', '==', token)
      .get();
    
    snapshot.forEach(doc => {
      doc.ref.delete();
    });
  } catch (error) {
    logger.error(`Error removing invalid token ${token}:`, error);
  }
} 