// Example: How to send policy acceptance/rejection from frontend with full tracking

// Helper function to collect client information
function collectClientInfo() {
  return {
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    platform: navigator.platform,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    // Optional: Add session ID or fingerprint if you have one
    sessionId: sessionStorage.getItem('sessionId') || null,
    fingerprint: null // You can use FingerprintJS or similar library
  };
}

// Example 1: Accept Terms & Conditions with ALL cookies
async function acceptTermsWithAllCookies() {
  try {
    const response = await fetch('http://localhost:4000/api/auth/tc/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cookiePreference: 'all',
        clientInfo: collectClientInfo()
      })
    });
    
    const data = await response.json();
    console.log('✅ Terms accepted:', data);
    return data;
  } catch (error) {
    console.error('❌ Error accepting terms:', error);
  }
}

// Example 2: Reject (Accept with essential cookies only)
async function rejectTermsEssentialOnly() {
  try {
    const response = await fetch('http://localhost:4000/api/auth/tc/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientInfo: collectClientInfo()
      })
    });
    
    const data = await response.json();
    console.log('⚠️ Terms rejected (essential only):', data);
    return data;
  } catch (error) {
    console.error('❌ Error rejecting terms:', error);
  }
}

// Example 3: Check current status
async function checkTermsStatus() {
  try {
    const response = await fetch('http://localhost:4000/api/auth/tc/status');
    const data = await response.json();
    console.log('📋 Current status:', data);
    return data;
  } catch (error) {
    console.error('❌ Error checking status:', error);
  }
}

// Example 4: Admin - Get all TC history (requires admin token)
async function getAdminTCHistory(adminToken, page = 1, limit = 50) {
  try {
    const response = await fetch(
      `http://localhost:4000/api/auth/tc/history?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    
    const data = await response.json();
    console.log('📊 TC History:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching TC history:', error);
  }
}

// Example 5: Admin - Get history for specific IP
async function getAdminTCHistoryByIP(adminToken, ipAddress) {
  try {
    const response = await fetch(
      `http://localhost:4000/api/auth/tc/history/${encodeURIComponent(ipAddress)}`,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    
    const data = await response.json();
    console.log(`📋 TC History for IP ${ipAddress}:`, data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching TC history by IP:', error);
  }
}

// Example usage in a Terms modal component
class TermsModal {
  constructor() {
    this.init();
  }

  async init() {
    // Check if user has already accepted
    const status = await checkTermsStatus();
    
    if (!status.data.hasAccepted) {
      this.showModal();
    }
  }

  showModal() {
    // Your modal display logic here
    console.log('Showing terms modal...');
  }

  async onAcceptClicked() {
    const result = await acceptTermsWithAllCookies();
    if (result.success) {
      this.hideModal();
      console.log('✅ User accepted terms with all cookies');
      console.log('📝 Record ID:', result.data.recordId);
      console.log('⏰ Timestamp:', result.data.timestamp);
    }
  }

  async onRejectClicked() {
    const result = await rejectTermsEssentialOnly();
    if (result.success) {
      this.hideModal();
      console.log('⚠️ User rejected (essential cookies only)');
      console.log('📝 Record ID:', result.data.recordId);
      console.log('⏰ Timestamp:', result.data.timestamp);
    }
  }

  hideModal() {
    // Your modal hide logic here
    console.log('Hiding terms modal...');
  }
}

// Initialize when DOM is ready
// new TermsModal();

/* 
MongoDB Collection Structure Example:
====================================
{
  "_id": "65f1234567890abcdef12345",
  "action": "accept",
  "ipAddress": "192.168.1.100",
  "ipVersion": "IPv4",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "termsAccepted": true,
  "privacyAccepted": true,
  "cookiePreference": "all",
  "browser": {
    "name": "Chrome",
    "version": "120.0.0.0"
  },
  "operatingSystem": {
    "name": "Windows",
    "version": "10"
  },
  "device": {
    "type": "desktop",
    "vendor": null,
    "model": null
  },
  "referer": "https://example.com",
  "acceptLanguage": "en-US,en;q=0.9",
  "acceptEncoding": "gzip, deflate, br",
  "clientInfo": {
    "screenResolution": "1920x1080",
    "colorDepth": 24,
    "timezone": "America/New_York",
    "timezoneOffset": 300,
    "platform": "Win32",
    "language": "en-US",
    "cookiesEnabled": true
  },
  "acceptedAt": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
*/