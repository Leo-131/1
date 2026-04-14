// Coze Integration Configuration
// Copy this file to config.js and fill in your values

window.COZE_CONFIG = {
  // Required: Your Coze API token (get from Coze Developer Console)
  apiToken: 'YOUR_COZE_API_TOKEN_HERE',
  
  // Required: Your Coze Workflow ID
  workflowId: 'YOUR_WORKFLOW_ID_HERE',
  
  // Optional: Custom endpoint (defaults to Coze API)
  endpoint: 'https://api.coze.com/v1',
  
  // Optional: Webhook secret for security
  webhookSecret: 'YOUR_WEBHOOK_SECRET_HERE',
  
  // Sync settings
  sync: {
    // Enable automatic polling (every 30 seconds)
    autoPoll: true,
    pollInterval: 30000,
    
    // Enable real-time sync via webhook
    webhookEnabled: true,
    
    // Sync directions
    directions: ['both'] // 'to_coze', 'from_coze', 'both'
  },
  
  // Feature flags
  features: {
    aiAnalysis: true,
    autoFollowup: true,
    smartPrioritization: true,
    multiLanguage: true
  }
};

// Uncomment and modify to connect to specific Coze bot
// window.COZE_CONFIG.botId = 'your-bot-id';
