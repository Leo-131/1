const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  dailyTarget: 100,
  platforms: {
    linkedin: { target: 60, workHours: { start: 9, end: 17 } },
    facebook: { target: 15, workHours: { start: 9, end: 17 } },
    instagram: { target: 25, workHours: { start: 9, end: 17 } }
  },
  batchSize: 5, // Send 5 messages per batch
  batchInterval: 30, // Minutes between batches
  minInterval: 5, // Minimum minutes between messages
  maxInterval: 15 // Maximum minutes between messages
};

// Timezone configurations
const TIMEZONES = {
  'America/New_York': { region: 'US-East', offset: -5, workStart: 9, workEnd: 17 },
  'America/Chicago': { region: 'US-Central', offset: -6, workStart: 9, workEnd: 17 },
  'America/Denver': { region: 'US-Mountain', offset: -7, workStart: 9, workEnd: 17 },
  'America/Los_Angeles': { region: 'US-West', offset: -8, workStart: 9, workEnd: 17 },
  'Europe/London': { region: 'UK', offset: 0, workStart: 9, workEnd: 17 },
  'Europe/Paris': { region: 'EU-West', offset: 1, workStart: 9, workEnd: 18 },
  'Europe/Zurich': { region: 'EU-Central', offset: 1, workStart: 9, workEnd: 18 },
  'Europe/Berlin': { region: 'EU-Central', offset: 1, workStart: 9, workEnd: 18 },
  'Asia/Tokyo': { region: 'Japan', offset: 9, workStart: 9, workEnd: 18 },
  'Asia/Shanghai': { region: 'China', offset: 8, workStart: 9, workEnd: 18 },
  'Asia/Singapore': { region: 'Singapore', offset: 8, workStart: 9, workEnd: 18 },
  'Australia/Sydney': { region: 'Australia', offset: 10, workStart: 9, workEnd: 17 }
};

// Load contacts from JSON
function loadContacts() {
  const filePath = path.join(__dirname, 'contacts.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return [];
}

// Save contacts to JSON
function saveContacts(contacts) {
  const filePath = path.join(__dirname, 'contacts.json');
  fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
}

// Load daily stats
function loadStats() {
  const filePath = path.join(__dirname, 'daily-stats.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return {
    date: new Date().toISOString().split('T')[0],
    sent: 0,
    pending: 100,
    byPlatform: { linkedin: 0, facebook: 0, instagram: 0, email: 0 },
    scheduled: []
  };
}

// Save daily stats
function saveStats(stats) {
  const filePath = path.join(__dirname, 'daily-stats.json');
  fs.writeFileSync(filePath, JSON.stringify(stats, null, 2));
}

// Check if it's working hours in a specific timezone
function isWorkingHours(timezone) {
  const tz = TIMEZONES[timezone];
  if (!tz) return false;
  
  const now = new Date();
  const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const hour = localTime.getHours();
  const day = localTime.getDay();
  
  // Skip weekends (0 = Sunday, 6 = Saturday)
  if (day === 0 || day === 6) return false;
  
  return hour >= tz.workStart && hour < tz.workEnd;
}

// Get next working hour start in timezone
function getNextWorkingStart(timezone) {
  const tz = TIMEZONES[timezone];
  if (!tz) return null;
  
  const now = new Date();
  const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const hour = localTime.getHours();
  
  if (hour < tz.workStart) {
    // Work day hasn't started yet
    localTime.setHours(tz.workStart, 0, 0, 0);
  } else if (hour >= tz.workEnd) {
    // Work day ended, schedule for tomorrow
    localTime.setDate(localTime.getDate() + 1);
    localTime.setHours(tz.workStart, 0, 0, 0);
    // Skip to Monday if weekend
    while (localTime.getDay() === 0 || localTime.getDay() === 6) {
      localTime.setDate(localTime.getDate() + 1);
    }
  }
  
  return localTime;
}

// Calculate optimal send time for a contact
function calculateSendTime(contact, stats) {
  const tz = TIMEZONES[contact.timezone];
  if (!tz) return null;
  
  // Check if currently working hours
  if (isWorkingHours(contact.timezone)) {
    // Schedule within next 15 minutes
    const now = new Date();
    const delay = Math.floor(Math.random() * (CONFIG.maxInterval - CONFIG.minInterval) + CONFIG.minInterval);
    return new Date(now.getTime() + delay * 60000);
  }
  
  // Schedule for next working day start
  const nextStart = getNextWorkingStart(contact.timezone);
  if (nextStart) {
    // Add random offset within first hour
    const offset = Math.floor(Math.random() * 60);
    nextStart.setMinutes(offset);
    return nextStart;
  }
  
  return null;
}

// Get pending contacts sorted by priority and timezone
function getPendingContacts(contacts) {
  return contacts
    .filter(c => c.status === 'pending' || !c.status)
    .sort((a, b) => {
      // Priority: high > medium > low
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by timezone working hours
      const aWorking = isWorkingHours(a.timezone) ? 0 : 1;
      const bWorking = isWorkingHours(b.timezone) ? 0 : 1;
      return aWorking - bWorking;
    });
}

// Schedule messages for the day
function scheduleDailyMessages() {
  console.log('[' + new Date().toISOString() + '] Scheduling daily messages...');
  
  const contacts = loadContacts();
  const stats = loadStats();
  
  // Reset stats if new day
  const today = new Date().toISOString().split('T')[0];
  if (stats.date !== today) {
    stats.date = today;
    stats.sent = 0;
    stats.pending = CONFIG.dailyTarget;
    stats.byPlatform = { linkedin: 0, facebook: 0, instagram: 0, email: 0 };
    stats.scheduled = [];
  }
  
  const pending = getPendingContacts(contacts);
  const toSchedule = Math.min(pending.length, CONFIG.dailyTarget - stats.sent);
  
  console.log(`Found ${pending.length} pending contacts, scheduling ${toSchedule} for today`);
  
  const scheduled = [];
  
  for (let i = 0; i < toSchedule; i++) {
    const contact = pending[i];
    const sendTime = calculateSendTime(contact, stats);
    
    if (sendTime) {
      contact.scheduledTime = sendTime.toISOString();
      contact.status = 'scheduled';
      scheduled.push({
        id: contact.id,
        name: contact.name,
        platform: contact.platform,
        timezone: contact.timezone,
        scheduledTime: sendTime.toISOString(),
        localTime: sendTime.toLocaleTimeString('en-US', { 
          timeZone: contact.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      });
    }
  }
  
  stats.scheduled = scheduled;
  saveContacts(contacts);
  saveStats(stats);
  
  console.log(`Scheduled ${scheduled.length} messages for today`);
  console.log('Schedule:', scheduled.map(s => 
    `${s.name} (${s.platform}) at ${s.localTime} ${s.timezone}`
  ).join('\n'));
  
  return scheduled;
}

// Execute a scheduled message
async function executeMessage(contact) {
  console.log(`[${new Date().toISOString()}] Executing message to ${contact.name} (${contact.platform})`);
  
  // Simulate API call to send message
  // In production, this would call the actual LinkedIn/Facebook/Instagram APIs
  
  const result = {
    success: true,
    timestamp: new Date().toISOString(),
    platform: contact.platform,
    contactId: contact.id,
    contactName: contact.name
  };
  
  // Update contact status
  const contacts = loadContacts();
  const contactIndex = contacts.findIndex(c => c.id === contact.id);
  if (contactIndex !== -1) {
    contacts[contactIndex].status = 'sent';
    contacts[contactIndex].sentTime = new Date().toISOString();
    contacts[contactIndex].scheduledTime = null;
    saveContacts(contacts);
  }
  
  // Update stats
  const stats = loadStats();
  stats.sent++;
  stats.pending--;
  stats.byPlatform[contact.platform] = (stats.byPlatform[contact.platform] || 0) + 1;
  stats.scheduled = stats.scheduled.filter(s => s.id !== contact.id);
  saveStats(stats);
  
  console.log(`Message sent successfully to ${contact.name}`);
  return result;
}

// Check and execute scheduled messages
async function checkScheduledMessages() {
  const stats = loadStats();
  const now = new Date();
  
  const dueMessages = stats.scheduled.filter(s => {
    const scheduledTime = new Date(s.scheduledTime);
    return scheduledTime <= now;
  });
  
  if (dueMessages.length > 0) {
    console.log(`[${now.toISOString()}] ${dueMessages.length} messages due for execution`);
    
    for (const msg of dueMessages) {
      try {
        await executeMessage(msg);
        // Add small delay between messages to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to send message to ${msg.name}:`, error);
      }
    }
  }
}

// Force complete daily target
async function forceCompleteDailyTarget() {
  console.log('[' + new Date().toISOString() + '] Checking daily target completion...');
  
  const stats = loadStats();
  const remaining = CONFIG.dailyTarget - stats.sent;
  
  if (remaining > 0) {
    console.log(`Daily target not met. ${remaining} messages remaining. Scheduling emergency batch...`);
    
    const contacts = loadContacts();
    const pending = getPendingContacts(contacts);
    
    // Schedule remaining messages for immediate sending
    const toSchedule = Math.min(pending.length, remaining);
    
    for (let i = 0; i < toSchedule; i++) {
      const contact = pending[i];
      // Schedule within next 30 minutes
      const sendTime = new Date(Date.now() + (i + 1) * 5 * 60000);
      
      contact.scheduledTime = sendTime.toISOString();
      contact.status = 'scheduled';
      
      stats.scheduled.push({
        id: contact.id,
        name: contact.name,
        platform: contact.platform,
        timezone: contact.timezone,
        scheduledTime: sendTime.toISOString(),
        localTime: sendTime.toLocaleTimeString('en-US', { 
          timeZone: contact.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      });
    }
    
    saveContacts(contacts);
    saveStats(stats);
    
    console.log(`Emergency scheduled ${toSchedule} messages`);
  } else {
    console.log('Daily target already met!');
  }
}

// Generate daily report
function generateDailyReport() {
  const stats = loadStats();
  const today = new Date().toISOString().split('T')[0];
  
  const report = {
    date: today,
    summary: {
      target: CONFIG.dailyTarget,
      sent: stats.sent,
      completionRate: ((stats.sent / CONFIG.dailyTarget) * 100).toFixed(1) + '%',
      remaining: CONFIG.dailyTarget - stats.sent
    },
    byPlatform: stats.byPlatform,
    scheduled: stats.scheduled.length
  };
  
  const reportPath = path.join(__dirname, 'reports', `report-${today}.json`);
  
  // Ensure reports directory exists
  const reportsDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('Daily report generated:', reportPath);
  console.log('Report:', JSON.stringify(report, null, 2));
  
  return report;
}

// Setup cron jobs
function setupScheduler() {
  console.log('[' + new Date().toISOString() + '] Setting up outreach scheduler...');
  
  // Schedule daily message planning at 6:00 AM
  cron.schedule('0 6 * * *', () => {
    console.log('Running daily schedule...');
    scheduleDailyMessages();
  });
  
  // Check for messages to send every 5 minutes during work hours
  cron.schedule('*/5 9-17 * * 1-5', () => {
    checkScheduledMessages();
  });
  
  // Force complete daily target at 4:00 PM if not met
  cron.schedule('0 16 * * 1-5', () => {
    forceCompleteDailyTarget();
  });
  
  // Generate daily report at 6:00 PM
  cron.schedule('0 18 * * *', () => {
    generateDailyReport();
  });
  
  // Log heartbeat every hour
  cron.schedule('0 * * * *', () => {
    const stats = loadStats();
    console.log(`[Heartbeat] Sent: ${stats.sent}/${CONFIG.dailyTarget}, Pending: ${stats.pending}`);
  });
  
  console.log('Scheduler setup complete!');
  console.log('Jobs:');
  console.log('  - Daily planning: 6:00 AM');
  console.log('  - Message execution: Every 5 min (9AM-5PM, weekdays)');
  console.log('  - Emergency completion: 4:00 PM');
  console.log('  - Daily report: 6:00 PM');
  console.log('  - Heartbeat: Every hour');
}

// Manual trigger functions for testing
function manualSchedule() {
  return scheduleDailyMessages();
}

function manualExecute() {
  return checkScheduledMessages();
}

function manualReport() {
  return generateDailyReport();
}

// Export for use in other modules
module.exports = {
  setupScheduler,
  scheduleDailyMessages,
  checkScheduledMessages,
  forceCompleteDailyTarget,
  generateDailyReport,
  manualSchedule,
  manualExecute,
  manualReport,
  isWorkingHours,
  getNextWorkingStart,
  CONFIG,
  TIMEZONES
};

// Run if called directly
if (require.main === module) {
  setupScheduler();
  
  // Initial schedule
  scheduleDailyMessages();
  
  console.log('Scheduler is running. Press Ctrl+C to stop.');
}
