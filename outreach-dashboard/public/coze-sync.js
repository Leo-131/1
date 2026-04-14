// Coze Integration Module for Dashboard
// Bidirectional sync between dashboard and Coze

class CozeSync {
  constructor() {
    this.apiBase = '/api';
    this.cozeEndpoint = null; // Set via config
    this.pollingInterval = null;
    this.listeners = [];
  }

  // Initialize Coze connection
  async initialize(config) {
    this.cozeEndpoint = config.endpoint || 'https://api.coze.com/v1';
    this.apiToken = config.apiToken;
    this.workflowId = config.workflowId;
    
    // Test connection
    try {
      const test = await this.testConnection();
      console.log('Coze connection:', test ? 'OK' : 'Failed');
      return test;
    } catch (e) {
      console.error('Coze init error:', e);
      return false;
    }
  }

  // Test Coze API connection
  async testConnection() {
    if (!this.apiToken) return false;
    
    try {
      const response = await fetch(`${this.cozeEndpoint}/workflows`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Subscribe to contact updates (Coze → Dashboard)
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Start polling for updates
  startPolling(intervalMs = 30000) {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
    
    this.pollingInterval = setInterval(async () => {
      try {
        const updates = await this.fetchUpdates();
        if (updates.length > 0) {
          this.listeners.forEach(cb => cb(updates));
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, intervalMs);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // Fetch latest updates from Coze
  async fetchUpdates() {
    try {
      const response = await fetch(`${this.apiBase}/coze?action=get_updates`, {
        credentials: 'same-origin'
      });
      const data = await response.json();
      return data.updates || [];
    } catch {
      return [];
    }
  }

  // Push contact update to Coze (Dashboard → Coze)
  async pushContactUpdate(contact) {
    try {
      const response = await fetch(`${this.apiBase}/coze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_contact',
          data: contact,
          source: 'dashboard'
        })
      });
      return response.ok;
    } catch (e) {
      console.error('Push error:', e);
      return false;
    }
  }

  // Sync all contacts
  async syncAll() {
    try {
      const response = await fetch(`${this.apiBase}/coze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_contacts',
          data: { trigger: 'manual' }
        })
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get analytics from Coze AI
  async getAIAnalysis(contacts) {
    if (!this.apiToken || !this.workflowId) {
      return { error: 'Coze not configured' };
    }

    try {
      const response = await fetch(`${this.cozeEndpoint}/workflow/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflow_id: this.workflowId,
          parameters: {
            contacts: JSON.stringify(contacts),
            analysis_type: 'full'
          }
        })
      });

      if (response.ok) {
        return await response.json();
      }
      return { error: 'Analysis failed' };
    } catch (e) {
      return { error: e.message };
    }
  }

  // Trigger Coze webhook
  async triggerWebhook(action, payload = {}) {
    try {
      const response = await fetch(`${this.apiBase}/coze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'push_to_coze',
          data: { target: action, ...payload }
        })
      });
      return await response.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

// Global instance
window.cozeSync = new CozeSync();

// Auto-initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if Coze config exists in localStorage or env
  const config = window.COZE_CONFIG || {
    // These would be set from environment variables
    // endpoint: 'https://api.coze.com/v1',
    // apiToken: 'your-token',
    // workflowId: 'your-workflow-id'
  };
  
  if (config.apiToken) {
    window.cozeSync.initialize(config);
  }
});
