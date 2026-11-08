# 🚀 Quick Start Guide - ImageGallery 3.0 Enhancements

## ⚡ TL;DR - Get Running in 5 Minutes

### Step 1: Run Migration (Optional)
```bash
node server/migrations/migrateMediaHideFields.js
```

### Step 2: Start Server
```bash
cd server
npm start
```

### Step 3: Start Client
```bash
cd client
npm start
```

### Step 4: Test New Features! 🎉

---

## 🎨 What's New?

### 1. **Beautiful Admin Dashboard**
- Navigate to `/admin` (login as admin)
- See modern gradient cards, animated stats
- Professional design matching the app theme

### 2. **Advanced Hide/Unhide**
- Open any image
- Click "🚫 Hide" button
- See beautiful modal with 4 visibility levels
- Add reason and notes
- Complete audit trail!

### 3. **Bulk Operations**
Use API directly (UI coming soon):
```javascript
// Hide multiple images at once
const response = await fetch('http://localhost:4000/api/media/bulk/hide', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${your_token}`
  },
  body: JSON.stringify({
    mediaIds: ['id1', 'id2', 'id3'],
    hideLevel: 'hard_hide',
    reason: '🚫 Violates terms of service',
    note: 'Reported by multiple users'
  })
});
```

---

## 📖 Hide Levels Explained

| Level | Who Can See | Use Case |
|-------|------------|----------|
| 👁️ **Visible** | Everyone | Normal content |
| 🟡 **Soft Hide** | Direct link only | Unlisted/shareable |
| 🟠 **Hard Hide** | Owner & Admin | Under review |
| 🔴 **Archived** | Admin only | Before deletion |

---

## 🔑 Quick API Reference

### Hide an Image
```http
PUT /api/media/:mediaId/hide
Content-Type: application/json

{
  "hideLevel": "hard_hide",
  "reason": "🚫 Violates terms",
  "note": "Additional context here"
}
```

### View Hide History
```http
GET /api/media/:mediaId/hide-history
```

### Bulk Hide
```http
POST /api/media/bulk/hide
Content-Type: application/json

{
  "mediaIds": ["id1", "id2"],
  "hideLevel": "archived",
  "reason": "Spam account",
  "note": "All images removed"
}
```

---

## 🧪 Quick Test

1. **Login as Admin**
2. **Upload test image**
3. **Click image to open modal**
4. **Click "🚫 Hide" button**
5. **See beautiful modal appear! ✨**
6. **Select hide level**
7. **Add reason (optional)**
8. **Click "✓ Apply Settings"**
9. **Image hidden! Check gallery - it's gone! 🎉**

---

## 📁 Important Files

### Backend
- `server/models/Media.js` - Enhanced model
- `server/models/MediaHideHistory.js` - New history model
- `server/controllers/media/interactionController.js` - Enhanced hide logic
- `server/routes/mediaRoutes.js` - New routes

### Frontend
- `client/src/components/gallery/HideReasonModal.js` - Beautiful modal
- `client/src/styles/HideReasonModal.css` - Modal styles
- `client/src/components/gallery/ImageModal.js` - Updated modal
- `client/src/services/mediaService.js` - Enhanced API calls

### Documentation
- `HIDE_UNHIDE_ENHANCEMENTS.md` - Complete feature guide
- `IMPLEMENTATION_SUMMARY.md` - All changes listed
- `QUICK_START.md` - This file!

---

## 🐛 Troubleshooting

### Modal Not Showing?
**Check**: HideReasonModal.css is imported

### Can't Hide Images?
**Check**: You're logged in as owner or admin

### Bulk Operations Fail?
**Check**: You're admin/coadmin, check console for errors

### History Empty?
**Note**: Only tracks actions AFTER upgrade

---

## 📚 Learn More

- **Full Documentation**: See `HIDE_UNHIDE_ENHANCEMENTS.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **API Reference**: Check routes in `server/routes/mediaRoutes.js`

---

## ✨ Key Features

✅ Multiple hide levels (4 options)  
✅ Hide reasons & notes  
✅ Complete audit trail  
✅ Bulk operations  
✅ Beautiful UI  
✅ Backward compatible  
✅ Production ready  

---

## 🎊 You're Ready!

Everything is set up and ready to go. Just start the server and client, then explore the new features!

**Happy Moderating! 🚀**

---

*Need detailed info? Check HIDE_UNHIDE_ENHANCEMENTS.md*