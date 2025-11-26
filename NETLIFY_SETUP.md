# 🚀 Netlify API Deployment Setup

## Quick Setup (2 minutes)

### Step 1: Get Your Netlify API Token

1. Go to: https://app.netlify.com/user/applications
2. Click **"New access token"**
3. Name it: `Auto Deploy` (or any name you prefer)
4. Click **"Generate token"**
5. **Copy the token immediately** (you won't see it again!)

### Step 2: Get Your Site ID

1. Go to: https://app.netlify.com/sites
2. Click on your site (collagenclinic.london)
3. Go to **Site settings** → **General**
4. Scroll to **Site information**
5. Copy the **Site ID** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 3: Add to GitHub Secrets (for automatic deployment)

1. Go to: https://github.com/PetyaKam/collagen-clinic-london-website/settings/secrets/actions
2. Click **"New repository secret"**
3. Add these two secrets:

   **Secret 1:**
   - Name: `NETLIFY_AUTH_TOKEN`
   - Value: (paste your API token from Step 1)

   **Secret 2:**
   - Name: `NETLIFY_SITE_ID`
   - Value: (paste your Site ID from Step 2)

4. Click **"Add secret"** for each

### Step 4: Share with Me (for direct deployment)

Once you've created the tokens, you can share:
- **NETLIFY_AUTH_TOKEN**: `your_token_here`
- **NETLIFY_SITE_ID**: `your_site_id_here`

Or I can use the GitHub secrets automatically!

## ✅ What Happens Next

Once set up:
- ✅ Every push to GitHub will automatically deploy to Netlify
- ✅ I can deploy directly using the API token
- ✅ Your site at https://collagenclinic.london/ will update automatically
- ✅ Deployments take 30-60 seconds

## 🔒 Security Note

- API tokens are like passwords - keep them secret
- Never commit tokens to GitHub
- Use GitHub Secrets for automatic deployments
- Tokens can be revoked and recreated anytime

## 📝 Manual Deployment (Optional)

If you want to deploy manually, you can run:

```bash
export NETLIFY_AUTH_TOKEN=your_token
export NETLIFY_SITE_ID=your_site_id
./deploy-netlify.sh
```

Or:

```bash
./deploy-netlify.sh your_token your_site_id
```

---

**Ready?** Just share your `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` and I'll set everything up! 🚀

