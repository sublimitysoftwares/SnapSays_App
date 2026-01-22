# Image Upload Feature - Backend Integration Guide

## Overview
The image upload feature allows users to take photos with their camera, select from gallery, and upload images to your backend server.

## Frontend Implementation ✅
- **Component**: `components/ImageUpload.tsx`
- **Screen**: `app/(tabs)/index.tsx`
- **Dependencies**: 
  - `expo-image-picker` - For camera and gallery access
  - `expo-file-system` - For file operations

## Backend Integration Required

### 1. Update Backend URL
In `components/ImageUpload.tsx`, line ~112, replace:
```typescript
const BACKEND_URL = 'https://your-backend.com/api/upload';
```
With your actual backend endpoint.

### 2. Add Authorization (if needed)
If your backend requires authentication, uncomment line ~119:
```typescript
headers: {
  'Content-Type': 'multipart/form-data',
  'Authorization': `Bearer ${token}`, // Uncomment and pass token
},
```

To get the auth token, you can use Clerk's `getToken()`:
```typescript
const { getToken } = useAuth();
const token = await getToken();
```

### 3. Backend Endpoint Requirements

Your backend should accept a `POST` request with:

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with field name `image`

**Expected Response:**
```json
{
  "success": true,
  "imageUrl": "https://your-cdn.com/uploads/image-123.jpg",
  "message": "Image uploaded successfully"
}
```

### 4. Example Backend Implementation (Node.js/Express)

```javascript
const express = require('express');
const multer = require('multer');
const app = express();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Upload endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to cloud storage (S3, Cloudinary, etc.)
    const imageUrl = await uploadToCloudStorage(req.file);

    res.json({
      success: true,
      imageUrl: imageUrl,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

## Features Implemented

✅ **Camera Access** - Take photos directly
✅ **Gallery Picker** - Select from photo library
✅ **Image Preview** - Preview before upload
✅ **Upload Progress** - Loading indicator during upload
✅ **Error Handling** - User-friendly error messages
✅ **Permission Handling** - Automatic permission requests
✅ **Image Editing** - Crop/edit before selection
✅ **Success Feedback** - Display uploaded image URL

## Testing

1. **Test Camera**: Click "Select Image" → "Camera" → Take photo
2. **Test Gallery**: Click "Select Image" → "Gallery" → Choose photo
3. **Test Upload**: Select image → Click "Upload Image"
4. **Test Errors**: Try uploading without backend (will show error)

## Permissions

The app automatically requests:
- **iOS**: Camera and Photo Library permissions
- **Android**: Camera and Storage permissions

These are handled in the `ImageUpload` component.

## Next Steps

1. ✅ Set up your backend upload endpoint
2. ✅ Update `BACKEND_URL` in `ImageUpload.tsx`
3. ✅ Add authentication headers if needed
4. ✅ Test the complete flow
5. ✅ (Optional) Add image compression/optimization
6. ✅ (Optional) Add multiple image upload support

## Troubleshooting

**Issue**: "Permission denied"
- **Solution**: Check app.json for camera/photo permissions

**Issue**: "Upload failed"
- **Solution**: Verify backend URL and CORS settings

**Issue**: "Network request failed"
- **Solution**: Check if backend is running and accessible

## Additional Enhancements (Optional)

- Add image compression before upload
- Support multiple image selection
- Add progress bar for upload
- Implement retry logic
- Add image filters/effects
- Support video upload
