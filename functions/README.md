# Propagentic Firebase Cloud Functions

This directory contains Firebase Cloud Functions for the Propagentic application.

## Maintenance Request Classification

The `classifyMaintenanceRequest` function automatically categorizes maintenance requests using OpenAI's GPT-4 model. It analyzes the description and determines:

1. The appropriate category (plumbing, electrical, HVAC, etc.)
2. The urgency level (1-5)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key

3. Deploy the function:
   ```bash
   npm run deploy
   ```

### How It Works

1. When a new document is added to the `maintenanceRequests` collection with `status: 'pending_classification'`, the function triggers.
2. It extracts the description and sends it to OpenAI.
3. The AI analyzes the description and returns a category and urgency level.
4. The function updates the document with:
   - `category`: The determined category (plumbing, electrical, etc.)
   - `urgency`: A number from 1 (low) to 5 (emergency)
   - `status`: Changed to `ready_to_dispatch`
   - `classifiedAt`: Server timestamp

### Example Request Document

```javascript
{
  "description": "The bathroom sink faucet is constantly dripping, wasting water and making noise at night.",
  "photoUrl": "https://example.com/photo.jpg",
  "submittedBy": "user123",
  "unitNumber": "101",
  "status": "pending_classification",
  "timestamp": "2023-11-10T12:34:56Z"
}
```

### Example Classified Document

After processing:

```javascript
{
  "description": "The bathroom sink faucet is constantly dripping, wasting water and making noise at night.",
  "photoUrl": "https://example.com/photo.jpg",
  "submittedBy": "user123",
  "unitNumber": "101",
  "status": "ready_to_dispatch",
  "timestamp": "2023-11-10T12:34:56Z",
  "category": "plumbing",
  "urgency": 3,
  "classifiedAt": "2023-11-10T12:35:30Z"
}
```

### OpenAI Prompt

The prompt used for classification is designed to guide the AI to accurately determine the appropriate category and urgency:

```
You are a building maintenance expert. Analyze the following maintenance request description:

"[DESCRIPTION]"

Based on the description, determine:
1. The most appropriate category: plumbing, electrical, HVAC, structural, appliance, or general
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
}
``` 