# Deploying IntelliHire Client to Render.com

This guide explains how to deploy the Next.js client application to Render.com.

## Prerequisites

1. A [Render.com](https://render.com) account
2. Your backend API deployed and accessible (e.g., `https://your-backend-api.onrender.com`)
3. Your code in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Options

### Option 1: Web Service (Server-Side Rendering) - RECOMMENDED

This option runs Next.js with its Node.js server, supporting all Next.js features.

#### Steps:

1. **Go to Render Dashboard**

   - Visit [https://dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect Repository**

   - Connect your GitHub/GitLab account
   - Select your IntelliHire repository
   - Click "Connect"

3. **Configure Service**

   ```
   Name: intellihire-client
   Root Directory: client
   Environment: Node
   Region: Singapore (or closest to you)
   Branch: main
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Add Environment Variables**

   Click "Advanced" → "Environment Variables":

   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-api.onrender.com/api
   NODE_ENV=production
   ```

   ⚠️ **IMPORTANT**: Replace `your-backend-api.onrender.com` with your actual backend URL!

5. **Choose Plan**

   - Free tier: Good for testing (spins down after inactivity)
   - Starter ($7/mo): Always on, better performance

6. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for the build to complete
   - Your app will be live at `https://intellihire-client.onrender.com`

---

### Option 2: Static Site (Pre-rendered HTML)

This option generates static HTML files and serves them (cheaper/free, but no server-side features).

#### Configuration Required:

The `next.config.mjs` has been updated with `output: 'export'` to enable static export.

#### Steps:

1. **Update next.config.mjs** (already done)

   ```javascript
   output: 'export',
   ```

2. **Go to Render Dashboard**

   - Click "New +" → "Static Site"

3. **Configure Static Site**

   ```
   Name: intellihire-client
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: out
   ```

4. **Add Environment Variables**

   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-api.onrender.com/api
   ```

5. **Deploy**
   - Click "Create Static Site"
   - Free forever, but with limitations

---

## Using render.yaml (Blueprint)

For automated deployment, Render can read the `render.yaml` file:

1. **Push render.yaml to your repo**

   ```bash
   git add client/render.yaml
   git commit -m "Add Render deployment config"
   git push
   ```

2. **Create Blueprint**

   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Select your repository
   - Render will auto-detect and configure from `render.yaml`

3. **Update Environment Variables**
   - Edit `NEXT_PUBLIC_API_URL` to point to your backend
   - Click "Apply"

---

## Post-Deployment

### 1. Test Your Deployment

Visit your deployed URL and test:

- ✅ Login functionality
- ✅ Job listings load
- ✅ API calls work (check browser console)
- ✅ Navigation between pages

### 2. Configure Custom Domain (Optional)

1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain (e.g., `app.intellihire.com`)
4. Update DNS records as instructed

### 3. Monitor Logs

- Click on your service → "Logs" tab
- Watch for errors or API connection issues

---

## Troubleshooting

### Issue: "Failed to fetch" or API errors

**Solution**: Check that `NEXT_PUBLIC_API_URL` is correctly set:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

Note the `/api` at the end!

### Issue: Build fails with TypeScript errors

**Solution**: The config already has `ignoreBuildErrors: true`, but if needed:

```bash
# Locally test the build
cd client
npm run build
```

### Issue: Images not loading

**Solution**: Ensure images are in `client/public/` directory and referenced as `/image.png` (not `./image.png`)

### Issue: 404 on page refresh (Static Site only)

**Solution**:

1. Add a `_redirects` file in `client/public/`:
   ```
   /*    /index.html   200
   ```
2. Or use the Web Service option instead

### Issue: Environment variables not updating

**Solution**:

1. Update variables in Render Dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Clear browser cache and test

---

## Environment Variables Reference

| Variable              | Required | Description          | Example                           |
| --------------------- | -------- | -------------------- | --------------------------------- |
| `NEXT_PUBLIC_API_URL` | Yes      | Backend API endpoint | `https://api.intellihire.com/api` |
| `NODE_ENV`            | Auto-set | Environment mode     | `production`                      |

⚠️ **Security Note**: Only use `NEXT_PUBLIC_*` prefix for variables that should be exposed to the browser. Never put secrets here!

---

## Continuous Deployment

Render automatically redeploys when you push to your connected branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Render automatically rebuilds and deploys
```

---

## Cost Estimates

### Web Service

- **Free**: $0/month (spins down after 15 min inactivity)
- **Starter**: $7/month (always on, 512 MB RAM)
- **Standard**: $25/month (2 GB RAM, better performance)

### Static Site

- **Free**: $0/month forever (100 GB bandwidth)
- **Pro**: $1/month per site (100 GB bandwidth + more)

---

## Next Steps

1. ✅ Deploy the backend API first
2. ✅ Deploy this client app
3. ✅ Update `NEXT_PUBLIC_API_URL` to point to your backend
4. ✅ Test the application
5. ⬜ Set up custom domain (optional)
6. ⬜ Enable SSL (automatic on Render)
7. ⬜ Set up monitoring and alerts

---

## Support

- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project Issues**: Create an issue in your repository

---

## Additional Resources

- [Render Environment Variables Guide](https://render.com/docs/environment-variables)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Render Free Tier Limits](https://render.com/docs/free)
