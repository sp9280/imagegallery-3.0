# 🌐 Network Access Configuration Guide

## Issues Fixed
1. ✅ Removed duplicate cookie/policy popups
2. ✅ Configured CORS for cross-device access
3. ✅ Set up network API URL

---

## 🚀 How to Run for Network Access

### Step 1: Find Your Machine's IP Address
```powershell
ipconfig | Select-String "IPv4"
```
Look for something like: `192.168.x.x` or `10.x.x.x`

### Step 2: Update Client .env File
Edit `client/.env` and set:
```env
REACT_APP_API_URL=http://YOUR_IP_HERE:4000/api
```

Example:
```env
REACT_APP_API_URL=http://10.207.201.94:4000/api
```

### Step 3: Start the Server
```powershell
Set-Location "c:\Users\Admin\Downloads\Imagegallery 3.0\server"
npm start
```

The server will run on: `http://0.0.0.0:4000` (accessible from all network interfaces)

### Step 4: Start the Client
```powershell
Set-Location "c:\Users\Admin\Downloads\Imagegallery 3.0\client"
npm start
```

The client will run on: `http://localhost:3000`

### Step 5: Access from Other Devices
On other devices on the same network, open:
```
http://YOUR_IP_HERE:3000
```

Example: `http://10.207.201.94:3000`

---

## 🔧 Server Binding Configuration

### Option 1: Bind to All Interfaces (Recommended for LAN)
In `server/server.js`, the server listens on port 4000 by default, which binds to all interfaces.

### Option 2: Explicitly Bind to 0.0.0.0
If the server only listens on localhost, change:
```javascript
app.listen(PORT, '0.0.0.0', () => logger.info(`✅ Server running on port ${PORT}`));
```

---

## 🔒 Firewall Configuration

### Windows Firewall
You may need to allow Node.js through Windows Firewall:

1. Open **Windows Defender Firewall**
2. Click **Allow an app or feature through Windows Defender Firewall**
3. Click **Change settings** → **Allow another app**
4. Browse to your Node.js executable (usually `C:\Program Files\nodejs\node.exe`)
5. Check both **Private** and **Public** networks
6. Click **Add**

### Quick PowerShell Command (Run as Administrator):
```powershell
New-NetFirewallRule -DisplayName "Node.js Server" -Direction Inbound -Program "C:\Program Files\nodejs\node.exe" -Action Allow
```

---

## 🧪 Testing Network Access

### From Another Device:
1. **Check connectivity**: `ping YOUR_IP_HERE`
2. **Test API**: Open browser to `http://YOUR_IP_HERE:4000/`
3. **Test Client**: Open browser to `http://YOUR_IP_HERE:3000/`

### Test Registration/Login:
1. Open `http://YOUR_IP_HERE:3000` on another device
2. Accept the Terms & Conditions popup (should only show ONCE now!)
3. Click "Register" → Create account
4. Login with new account
5. Upload an image

---

## 📱 Mobile Device Testing

### Android/iPhone on Same WiFi:
1. Connect to same WiFi network as your PC
2. Open browser (Chrome/Safari)
3. Navigate to: `http://YOUR_IP_HERE:3000`
4. Accept terms popup
5. Register and test features

---

## ❌ Troubleshooting

### Problem: "Network Error" or "Cannot connect to server"
**Solution**: 
- Verify server is running: `http://YOUR_IP_HERE:4000/` should show "Image Gallery API Running"
- Check Windows Firewall is allowing Node.js
- Ensure both devices are on same network

### Problem: Cookie popup still appearing twice
**Solution**:
- Clear browser cache and localStorage
- Hard refresh: `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
- Restart the client dev server

### Problem: Registration fails with CORS error
**Solution**:
- Server CORS is now configured to allow all origins
- Restart the server: `Set-Location "c:\Users\Admin\Downloads\Imagegallery 3.0\server"; npm start`

### Problem: Can't access from other device
**Solution**:
- Ensure server binds to `0.0.0.0` not `localhost`
- Check if antivirus/firewall is blocking port 3000 and 4000
- Verify both devices are on same network subnet

### Problem: IP tracking not working / Popup appearing every time
**Solution**:
- Check MongoDB is running and connected
- Check server logs for errors: `server/error.log`
- Verify Visitor model is saving: Check MongoDB for `visitors` collection

---

## 🎯 Localhost vs Network Access

### For Local Development (Same Machine):
```env
# client/.env
REACT_APP_API_URL=http://localhost:4000/api
```

### For Network Access (Other Devices):
```env
# client/.env
REACT_APP_API_URL=http://10.207.201.94:4000/api
```

**Note**: You need to **restart the client** after changing `.env` file!

---

## 🔍 Verify Configuration

### Check Current API URL:
Open browser console on client and run:
```javascript
console.log(process.env.REACT_APP_API_URL);
```

### Check Server CORS:
Check server logs, you should see CORS headers in responses

### Check Visitor Tracking:
Open MongoDB and check `visitors` collection:
```javascript
db.visitors.find().pretty()
```

---

## ✅ Success Checklist

- [ ] Server running on `http://0.0.0.0:4000`
- [ ] Client `.env` file has correct IP address
- [ ] Client restarted after changing `.env`
- [ ] Firewall allows Node.js connections
- [ ] Can access `http://YOUR_IP:4000/` from other device
- [ ] Can access `http://YOUR_IP:3000/` from other device
- [ ] Terms popup appears ONCE (not twice)
- [ ] Can register new user from other device
- [ ] Can login from other device
- [ ] After accepting terms, popup doesn't reappear