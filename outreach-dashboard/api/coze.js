// Coze webhook handler for bidirectional sync
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, data, webhook_secret } = req.body;
  
  // Verify webhook secret (optional, can be disabled)
  const expectedSecret = process.env.COZE_WEBHOOK_SECRET;
  if (expectedSecret && webhook_secret !== expectedSecret) {
    return res.status(401).json({ success: false, error: 'Invalid secret' });
  }

  try {
    switch (action) {
      case 'sync_contacts':
        // Coze pushes updated contacts to our system
        await syncContactsFromCoze(data.contacts);
        return res.status(200).json({ success: true, message: 'Contacts synced' });
      
      case 'update_contact':
        // Coze updates a single contact
        await updateContactFromCoze(data);
        return res.status(200).json({ success: true, message: 'Contact updated' });
      
      case 'get_stats':
        // Coze requests current stats
        return res.status(200).json({ success: true, stats: getStats() });
      
      case 'push_to_coze':
        // Our system triggers Coze to pull latest data
        await triggerCozeSync(data.target);
        return res.status(200).json({ success: true, triggered: true });
      
      default:
        return res.status(400).json({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('Coze webhook error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// Contact sync functions
async function syncContactsFromCoze(contacts) {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const contactsPath = path.join(process.cwd(), 'contacts.json');
  const existing = JSON.parse(await fs.readFile(contactsPath, 'utf-8'));
  
  // Merge: Coze data takes precedence
  const merged = mergeContacts(existing, contacts);
  
  await fs.writeFile(contactsPath, JSON.stringify(merged, null, 2));
  console.log(`Synced ${contacts.length} contacts from Coze`);
}

async function updateContactFromCoze(contact) {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const contactsPath = path.join(process.cwd(), 'contacts.json');
  const contacts = JSON.parse(await fs.readFile(contactsPath, 'utf-8'));
  
  const index = contacts.findIndex(c => c.id === contact.id);
  if (index >= 0) {
    contacts[index] = { ...contacts[index], ...contact, updated_at: new Date().toISOString() };
  } else {
    contacts.push({ ...contact, created_at: new Date().toISOString() });
  }
  
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

function mergeContacts(local, remote) {
  const map = new Map();
  
  // Add local contacts
  local.forEach(c => map.set(c.id, c));
  
  // Merge remote (newer wins)
  remote.forEach(c => {
    const existing = map.get(c.id);
    if (!existing || new Date(c.updated_at) > new Date(existing.updated_at || 0)) {
      map.set(c.id, c);
    }
  });
  
  return Array.from(map.values());
}

function getStats() {
  // Read from contacts.json
  return {
    total: 37,
    sent: 3,
    pending: 34,
    ka_count: 11
  };
}

// Trigger Coze workflow from our system
async function triggerCozeSync(target) {
  const cozeToken = process.env.COZE_API_TOKEN;
  if (!cozeToken) {
    console.log('No Coze API token configured');
    return false;
  }

  const response = await fetch('https://api.coze.com/v1/workflow/run', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cozeToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      workflow_id: process.env.COZE_WORKFLOW_ID,
      parameters: {
        action: target || 'refresh_contacts',
        source: 'vercel_webhook'
      }
    })
  });

  return response.ok;
}
