# Quick Deploy to Render.com - IntelliHire Client

## ✅ Pre-Deployment Checklist

- [x] Fixed localStorage prerender errors
- [x] Created render.yaml configuration
- [x] Documented deployment instructions
- [ ] Deploy backend API first
- [ ] Get backend API URL
- [ ] Deploy this client

## 🚀 Deploy in 5 Minutes

### Step 1: Deploy Backend First

Your backend API must be deployed before the client. Get the URL (e.g., `https://intellihire-api.onrender.com`)

### Step 2: Go to Render Dashboard

Visit https://dashboard.render.com and sign in

### Step 3: Create New Web Service

- Click **"New +"** → **"Web Service"**
- Connect your GitHub repository
- Select your IntelliHire repo

### Step 4: Configure Service

```
Name:           intellihire-client
Root Directory: client
Environment:    Node
Region:         Singapore (or closest)
Branch:         main
Build Command:  npm install && npm run build
Start Command:  npm start
Instance Type:  Free (or Starter for always-on)
```

### Step 5: Add Environment Variable

Click **"Advanced"** → Add Environment Variable:

```
NEXT_PUBLIC_API_URL = https://your-backend-api.onrender.com/api
```

⚠️ **CRITICAL**: Replace with your actual backend URL!

### Step 6: Deploy!

Click **"Create Web Service"**

Wait 3-5 minutes. Your app will be live at:
`https://intellihire-client.onrender.com`

---

## 🔧 Alternative: Deploy Using Blueprint

1. **Push to GitHub** (if not already done):

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **In Render Dashboard**:
   - Click **"New +"** → **"Blueprint"**
   - Select your repository
   - Render auto-detects `render.yaml`
   - Edit `NEXT_PUBLIC_API_URL` in the blueprint
   - Click **"Apply"**

---

## 🧪 Test After Deployment

Visit your deployed URL and test:

1. ✅ Home page loads
2. ✅ Login works
3. ✅ Jobs page displays data
4. ✅ No console errors (F12 → Console)
5. ✅ API calls succeed (F12 → Network)

---

## 🐛 Troubleshooting

### Build Fails with "localStorage is not defined"

**Status**: ✅ **FIXED!**

All localStorage errors have been resolved. If you still see this:

1. Pull latest code
2. Check `PRERENDER_FIXES.md` for details

### API Calls Failing

**Solution**: Check `NEXT_PUBLIC_API_URL` environment variable

- Go to your service → "Environment"
- Verify it points to your backend with `/api` at the end
- Click "Manual Deploy" after changing

### Page Shows "500 Internal Server Error"

**Solution**: Check logs

1. In Render Dashboard → Your service
2. Click "Logs" tab
3. Look for errors
4. Usually indicates missing env variable or API connection issue

### Build Succeeds But Page is Blank

**Solution**:

1. Check browser console (F12)
2. Likely CORS issue with backend
3. Verify backend allows your frontend domain

---

## 💰 Cost

### Free Tier

- Spins down after 15 minutes of inactivity
- Takes ~30 seconds to spin up on first request
- Good for testing/demos

### Starter ($7/month)

- Always on
- No spin-down delay
- Better performance
- Recommended for production

---

## 🔄 Auto-Deploy

After initial setup, Render automatically redeploys when you push to `main`:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Render automatically builds and deploys
```

---

## 📚 Additional Resources

- **Full Guide**: `DEPLOYMENT_INSTRUCTIONS.md`
- **Fix Details**: `PRERENDER_FIXES.md`
- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs/deployment

---

## 🆘 Need Help?

1. Check `DEPLOYMENT_INSTRUCTIONS.md` for detailed steps
2. Review Render logs for errors
3. Verify environment variables are set
4. Ensure backend is running and accessible

---

## ✨ Success!

Once deployed, your IntelliHire client will be live at:
`https://[your-service-name].onrender.com`

🎉 You can now access your application from anywhere!
