# 🎯 Hide/Unhide Feature - Complete Enhancement Guide

## 📋 Overview

The ImageGallery hide/unhide feature has been **massively enhanced** with professional-grade content moderation capabilities including:

✅ **Multiple hide levels** (Soft Hide, Hard Hide, Archive)  
✅ **Hide reasons and notes** for audit tracking  
✅ **Complete hide history** for every action  
✅ **Bulk hide/unhide operations** for admins  
✅ **Scheduled hide/unhide** (future enhancement ready)  
✅ **Beautiful modern UI** with modal dialogs  

---

## 🆕 What's New

### 1. **Multiple Visibility Levels**

| Level | Icon | Visibility | Use Case |
|-------|------|------------|----------|
| **Visible** | 👁️ | Public - Everyone can see | Normal published content |
| **Soft Hide (Unlisted)** | 🟡 | Hidden from gallery, accessible via direct link | Unlisted/shareable content |
| **Hard Hide** | 🟠 | Completely hidden from public | Under review, policy violations |
| **Archived** | 🔴 | Admin-only access | Severe violations, pending deletion |

### 2. **Hide Reasons & Notes**

When hiding content, you can now specify:
- **Predefined reasons**: Violates TOS, Inappropriate, Copyright, etc.
- **Custom reasons**: Free-text field for specific cases
- **Additional notes**: Up to 1000 characters of context

### 3. **Complete Audit Trail**

Every hide/unhide action is permanently logged with:
- Who performed the action (user ID, username, role)
- When it happened (timestamp)
- What changed (previous state → new state)
- Why it was done (reason & notes)
- From where (IP address, user agent)

### 4. **Bulk Operations**

Admins can select multiple images and:
- Hide all with one action
- Unhide all with one action
- Apply same reason/level to all

---

## 🗄️ Database Schema Changes

### Updated Media Model

New fields added to `Media` collection:

```javascript
{
  isHidden: Boolean,                    // Legacy compatibility
  hideLevel: String,                    // 'visible', 'soft_hide', 'hard_hide', 'archived'
  hideReason: String,                   // Why it was hidden
  hideNote: String,                     // Additional context
  hiddenBy: ObjectId,                   // User who hid it
  hiddenByUsername: String,             // Username for quick display
  hiddenAt: Date,                       // When it was hidden
  scheduledHideAt: Date,                // Future: Auto-hide at this time
  scheduledUnhideAt: Date               // Future: Auto-unhide at this time
}
```

### New MediaHideHistory Model

Tracks every single hide/unhide action:

```javascript
{
  mediaId: ObjectId,                    // Media being modified
  action: String,                       // 'hide', 'unhide', 'soft_hide', 'hard_hide', 'archive'
  hideLevel: String,                    // New visibility level
  reason: String,                       // Why action was taken
  note: String,                         // Additional context
  performedBy: ObjectId,                // User who did it
  performedByRole: String,              // 'owner', 'admin', 'coadmin'
  performedByUsername: String,          // Username
  ipAddress: String,                    // IP address
  userAgent: String,                    // Browser info
  previousState: Object,                // State before action
  newState: Object,                     // State after action
  scheduledHideAt: Date,                // If scheduled
  scheduledUnhideAt: Date,              // If scheduled
  createdAt: Date                       // Auto timestamp
}
```

**Indexes** for performance:
- `mediaId` + `createdAt` (descending)
- `performedBy` + `createdAt` (descending)
- `action` + `createdAt` (descending)

---

## 🚀 API Endpoints

### 1. Enhanced Hide/Unhide (PUT)
```
PUT /api/media/:mediaId/hide
```

**Authorization**: Owner or Admin only

**Request Body**:
```json
{
  "hideLevel": "hard_hide",
  "reason": "🚫 Violates terms of service",
  "note": "Contains inappropriate content reported by 3 users",
  "scheduledHideAt": null,
  "scheduledUnhideAt": null
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Media hard_hide successfully",
  "data": {
    "isHidden": true,
    "hideLevel": "hard_hide",
    "action": "hard_hide"
  }
}
```

**Backward Compatible**: Calling without body still works (simple toggle).

---

### 2. Get Hide History (GET)
```
GET /api/media/:mediaId/hide-history
```

**Authorization**: Owner or Admin only

**Response**:
```json
{
  "status": "success",
  "message": "Hide history retrieved",
  "data": {
    "history": [
      {
        "_id": "...",
        "mediaId": "...",
        "action": "hard_hide",
        "hideLevel": "hard_hide",
        "reason": "🚫 Violates terms of service",
        "note": "Contains inappropriate content",
        "performedBy": {...},
        "performedByUsername": "admin",
        "performedByRole": "admin",
        "ipAddress": "192.168.1.1",
        "previousState": {
          "isHidden": false,
          "hideLevel": "visible"
        },
        "newState": {
          "isHidden": true,
          "hideLevel": "hard_hide"
        },
        "createdAt": "2025-01-28T10:30:00Z"
      }
    ],
    "total": 1
  }
}
```

---

### 3. Bulk Hide/Unhide (POST)
```
POST /api/media/bulk/hide
```

**Authorization**: Admin or Co-Admin only

**Request Body**:
```json
{
  "mediaIds": ["id1", "id2", "id3"],
  "hideLevel": "archived",
  "reason": "Bulk moderation: spam account",
  "note": "All images from flagged user"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Bulk archive completed",
  "data": {
    "results": {
      "success": ["id1", "id2"],
      "failed": [
        {
          "mediaId": "id3",
          "error": "Media not found"
        }
      ]
    },
    "successCount": 2,
    "failedCount": 1
  }
}
```

---

## 🎨 Frontend Components

### 1. **HideReasonModal Component**

Located at: `client/src/components/gallery/HideReasonModal.js`

**Features**:
- Beautiful gradient design matching app theme
- Visual hide level selection grid
- Predefined reason dropdown
- Custom reason text input
- Additional notes textarea
- Character count display
- Smooth animations

**Usage**:
```jsx
import HideReasonModal from './HideReasonModal';

<HideReasonModal
  isOpen={showHideModal}
  onClose={() => setShowHideModal(false)}
  onConfirm={(settings) => handleHide(settings)}
  currentHideLevel={item.hideLevel || 'visible'}
/>
```

### 2. **Updated ImageModal**

Changes:
- ✨ "Hide" button now opens HideReasonModal
- 🔄 Button text changes to "Change Visibility" when already hidden
- 📊 Ready to display hide history (future enhancement)

---

## 👨‍💼 User Flows

### **Owner/Admin Hiding Content**

1. Open image in modal
2. Click **"🚫 Hide"** button in Content Management section
3. **HideReasonModal appears** with beautiful UI
4. Select visibility level:
   - 👁️ Visible
   - 🟡 Soft Hide (Unlisted)
   - 🟠 Hard Hide
   - 🔴 Archive
5. Choose reason (optional):
   - Predefined dropdown
   - Or custom reason
6. Add notes (optional)
7. Click **"✓ Apply Settings"**
8. ✅ Content hidden, history recorded

### **Owner/Admin Unhiding Content**

1. Open hidden image (only visible to owner/admin)
2. Click **"👁️ Change Visibility"**
3. Select **"👁️ Visible"**
4. Click **"✓ Make Visible"**
5. ✅ Content unhidden, history recorded

### **Admin Bulk Hide**

*Coming soon to UI - API ready!*

Use API directly for now:
```javascript
await mediaService.bulkHide(
  ['id1', 'id2', 'id3'],
  'archived',
  '🚫 Spam account',
  'All images removed'
);
```

---

## 🔐 Security & Permissions

| Action | Owner | Co-Admin | Admin | Public |
|--------|-------|----------|-------|--------|
| Hide own media | ✅ | ❌ | ✅ | ❌ |
| Hide any media | ❌ | ✅ | ✅ | ❌ |
| View hide history | ✅ (own) | ✅ | ✅ | ❌ |
| Bulk operations | ❌ | ✅ | ✅ | ❌ |
| View soft-hidden (direct link) | ✅ | ✅ | ✅ | ✅ |
| View hard-hidden | ✅ (own) | ✅ | ✅ | ❌ |
| View archived | ❌ | ✅ | ✅ | ❌ |

---

## 📊 Hide Level Behavior

### **Visible (Default)**
```javascript
{
  isHidden: false,
  hideLevel: 'visible'
}
```
- Appears in public gallery ✅
- Direct link works ✅
- Search results ✅
- Everyone can view ✅

### **Soft Hide (Unlisted)**
```javascript
{
  isHidden: true,
  hideLevel: 'soft_hide'
}
```
- Hidden from public gallery ❌
- Direct link works ✅
- Not in search ❌
- Like "Unlisted" on YouTube

### **Hard Hide**
```javascript
{
  isHidden: true,
  hideLevel: 'hard_hide'
}
```
- Hidden from gallery ❌
- Direct link = 404 ❌
- Only owner/admin can see ✅
- For content under review

### **Archived**
```javascript
{
  isHidden: true,
  hideLevel: 'archived'
}
```
- Hidden from everyone except admin ❌
- Not accessible by owner ❌
- Admin panel only ✅
- Can be permanently deleted

---

## 🧪 Testing Guide

### Test Hide Levels

1. **Upload Test Images**:
   ```bash
   # Upload 4 test images
   ```

2. **Test Each Level**:
   ```javascript
   // Soft Hide
   PUT /api/media/:id/hide
   { "hideLevel": "soft_hide" }
   
   // Try direct link (should work)
   GET /api/media/public/:id
   
   // Check gallery (should NOT appear)
   GET /api/media/public
   ```

3. **Test Bulk Operations**:
   ```javascript
   POST /api/media/bulk/hide
   {
     "mediaIds": ["id1", "id2"],
     "hideLevel": "archived",
     "reason": "Test bulk"
   }
   ```

4. **Check History**:
   ```javascript
   GET /api/media/:id/hide-history
   // Should show all actions
   ```

---

## 📈 Future Enhancements (Roadmap)

### Phase 1 (Completed) ✅
- [x] Multiple hide levels
- [x] Hide reasons & notes
- [x] Complete audit trail
- [x] Bulk operations API
- [x] Beautiful UI modal

### Phase 2 (API Ready, UI Pending)
- [ ] Bulk selection UI in gallery
- [ ] View hide history in modal
- [ ] Admin dashboard for hidden content
- [ ] Filter by hide level

### Phase 3 (Future)
- [ ] Scheduled hide/unhide
- [ ] Auto-hide based on reports
- [ ] Hide analytics
- [ ] Email notifications on hide
- [ ] Restore deleted content

---

## 🐛 Troubleshooting

### Issue: Modal doesn't appear
**Solution**: Check that HideReasonModal.css is imported:
```javascript
import '../../styles/HideReasonModal.css';
```

### Issue: Hide history empty
**Solution**: History only tracks actions AFTER upgrade. Old hides won't have history.

### Issue: Bulk hide fails
**Solution**: Ensure user is admin/coadmin. Check console for detailed errors.

### Issue: Soft-hidden still appears in gallery
**Solution**: Check query filters include `isHidden: false`:
```javascript
const query = { isPublic: true, isHidden: false };
```

---

## 📝 Migration Notes

### For Existing Databases

All existing media will have:
```javascript
{
  hideLevel: 'visible',  // Default
  hideReason: null,
  hideNote: null
}
```

Existing hidden media (`isHidden: true`) should be updated:
```javascript
// Run this migration
db.media.updateMany(
  { isHidden: true, hideLevel: { $exists: false } },
  { $set: { hideLevel: 'hard_hide' } }
);
```

---

## 📞 Support

**Backend Issues**: Check `server/error.log` and `server/combined.log`

**Frontend Issues**: Open browser console (F12)

**Database Issues**: 
```bash
# Check MediaHideHistory collection
db.mediahidehistories.find().pretty()

# Check media hide fields
db.media.find({ isHidden: true }).pretty()
```

---

## ✨ Summary

Your ImageGallery now has **enterprise-grade content moderation** with:

🎯 **4 visibility levels** for flexible control  
📝 **Reason tracking** for accountability  
📊 **Complete audit trail** for compliance  
⚡ **Bulk operations** for efficiency  
🎨 **Beautiful UI** for ease of use  

**All features are backward compatible** - existing code continues to work!

---

**Need help?** Check the code comments or console logs for detailed debugging info.

**Happy Moderating!** 🚀