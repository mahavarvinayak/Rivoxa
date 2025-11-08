# AutoFlow.AI - Deployment & Configuration Guide

## For SaaS Owners: One-Time Setup

This guide explains how to configure AutoFlow.AI as a white-label SaaS product where your users can connect their Instagram and WhatsApp accounts without needing their own Meta Developer credentials.

---

## Step 1: Create Your Meta App (One Time Only)

### 1.1 Create Meta Developer Account
1. Go to https://developers.facebook.com
2. Sign in with your Facebook account
3. Complete the developer registration

### 1.2 Create a New App
1. Click "My Apps" → "Create App"
2. Select **"Business"** as app type
3. Fill in details:
   - **App Name**: AutoFlow.AI (or your brand name)
   - **Contact Email**: Your support email
   - **Business Account**: Create or select one

### 1.3 Add Required Products
In your app dashboard, add these products:
- **Instagram Graph API** (for Instagram automation)
- **Messenger** (for Instagram DMs)
- **WhatsApp Business Platform** (for WhatsApp automation)

### 1.4 Configure App Settings

#### Basic Settings
1. Go to **Settings** → **Basic**
2. Note down:
   - **App ID** (you'll need this)
   - **App Secret** (click "Show" to reveal)
3. Add **App Domains**: Your deployment domain (e.g., `autoflow-ai.com`)
4. Add **Privacy Policy URL** and **Terms of Service URL**

#### OAuth Settings
1. Go to **Instagram** → **Basic Display** or **Instagram Graph API**
2. Add **Valid OAuth Redirect URIs**:
   