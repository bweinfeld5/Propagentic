/**
 * Firebase Cloud Function to classify maintenance requests using OpenAI GPT-4
 * This function automatically categorizes maintenance issues and assigns urgency levels
 */

// Import Firebase Functions v2
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const {OpenAI} = require("openai");
const logger = require("firebase-functions/logger");

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

logger.info("OpenAI API Key set:", !!process.env.OPENAI_API_KEY);

/**
 * Cloud Function that triggers when a new maintenance request is added to Firestore
 * with status 'pending_classification'
 */
exports.classifyMaintenanceRequest = onDocumentCreated(
    {
      document: "maintenanceRequests/{requestId}",
      region: "us-central1",
    }, 
    async (event) => {
      try {
        const snapshot = event.data;
        if (!snapshot) {
          logger.error("No data associated with the event");
          return;
        }
        
        const requestData = snapshot.data();
        
        // Only process documents with 'pending_classification' status
        if (requestData.status !== "pending_classification") {
          logger.info(
              `Document ${event.params.requestId} already processed. ` +
              `Status: ${requestData.status}`
          );
          return;
        }
        
        logger.info(`Processing maintenance request: ${event.params.requestId}`);
        
        // Extract the description from the document
        const description = requestData.description;
        
        if (!description) {
          logger.error("No description found in the document");
          await snapshot.ref.update({
            status: "classification_failed",
            classificationError: "No description provided",
          });
          return;
        }
        
        // Send the description to OpenAI for classification
        const classification = await classifyWithOpenAI(description);
        
        // Update the Firestore document with the classification results
        await snapshot.ref.update({
          category: classification.category,
          urgency: classification.urgency,
          status: "ready_to_dispatch",
          classifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        logger.info(
            `Successfully classified request ${event.params.requestId} as ` +
            `${classification.category} with urgency ${classification.urgency}`
        );
      } catch (error) {
        logger.error("Error classifying maintenance request:", error);
        
        try {
          // Update the document with error information
          await event.data.ref.update({
            status: "classification_failed",
            classificationError: error.message,
          });
        } catch (updateError) {
          logger.error("Error updating document with error status:", updateError);
        }
      }
    }
);

/**
 * Function to classify a maintenance request description using OpenAI's GPT-4
 * @param {string} description - The maintenance request description
 * @return {Promise<{category: string, urgency: number}>} - Classification results
 */
async function classifyWithOpenAI(description) {
  // Example prompt structure for OpenAI
  const prompt = `
You are a building maintenance expert. Analyze the following maintenance request:

"${description}"

Based on the description, determine:
1. The most appropriate category: plumbing, electrical, HVAC, structural, 
   appliance, or general
2. The urgency level (1-5) where:
   1 = Low priority (can be scheduled anytime)
   2 = Minor issue (should be addressed within 2 weeks)
   3 = Normal priority (should be addressed within a week)
   4 = Important (should be addressed within 48 hours)
   5 = Emergency (requires immediate attention)

Respond with JSON in the following format only, no other text:
{
  "category": "category_name",
  "urgency": urgency_number
}`;

  logger.info("Sending classification request to OpenAI");

  try {
    // Call OpenAI API for classification
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Use the model name as specified in OpenAI docs
      messages: [
        {role: "system", content: "You are a maintenance issue classifier."},
        {role: "user", content: prompt},
      ],
      temperature: 0.3, // Lower temperature for more deterministic results
      max_tokens: 150, // Limit token usage
    });
    
    // Parse the response from OpenAI
    const content = response.choices[0].message.content.trim();
    logger.info("Received response from OpenAI:", content);
    
    const classification = JSON.parse(content);
    
    // Validate the response format
    if (!classification.category || !classification.urgency) {
      throw new Error("Invalid classification response format");
    }
    
    // Ensure urgency is a number between 1-5
    const urgency = Number(classification.urgency);
    if (isNaN(urgency) || urgency < 1 || urgency > 5) {
      throw new Error("Invalid urgency value: must be a number between 1-5");
    }
    
    return {
      category: classification.category.toLowerCase(),
      urgency: urgency,
    };
  } catch (error) {
    logger.error("Error processing OpenAI response:", error);
    if (error.response) {
      logger.error("OpenAI API Error:", error.response.data);
    }
    throw new Error(`Failed to classify issue: ${error.message}`);
  }
}
