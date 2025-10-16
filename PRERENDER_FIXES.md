# Pre-render localStorage Fixes

## Issue

Next.js was failing during build with the error:

```
Error occurred prerendering page "/dashboard/applicant/messages".
ReferenceError: localStorage is not defined
```

## Root Cause

- Next.js pre-renders pages during the build process (Server-Side Rendering / Static Site Generation)
- `localStorage` is a browser API and doesn't exist in Node.js environment
- Pages were accessing `localStorage` at the top level or without checking if `window` exists

## Solution

Added safety checks before accessing `localStorage` using:

```typescript
typeof window !== 'undefined' ? localStorage.getItem('key') : null;
```

## Files Fixed

### 1. `/app/dashboard/applicant/messages/page.tsx`

- **Line ~139**: Added check in `fetchDefaultAdmin()` function
- **Line ~191**: Added check in `organizeConversations()` function
- **Line ~284**: Added check in `selectConversation()` function
- **Line ~404**: Added check for top-level `currentUserId` variable (CRITICAL FIX)

### 2. `/app/dashboard/admin/messages/page.tsx`

- **Line ~182**: Added check in `organizeConversations()` function
- **Line ~294**: Added check in `selectConversation()` function
- **Line ~486**: Added check for top-level `currentUserId` variable

### 3. `/app/dashboard/admin/analytics/page.tsx`

- **Line ~93**: Added check in `fetchAnalyticsData()` function when fetching users

### 4. `/app/dashboard/applicant/applications/page.tsx`

- **Line ~835**: Added check in first `handleWithdraw()` function
- **Line ~1174**: Added check in second withdraw handler

### 5. `/app/dashboard/admin/ranking/page.tsx`

- **Line ~416**: Added check in `openResumeModal()` function
- **Line ~452**: Added check in `openStatusModal()` function
- **Line ~577**: Added check in `handleStatusUpdate()` function

## Pattern Used

### Before (Causes Build Error):

```typescript
const currentUserId = localStorage.getItem('userId');
```

### After (Safe):

```typescript
const currentUserId =
  typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
```

### In Functions:

```typescript
const fetchData = async () => {
  // Check if we're in the browser before accessing localStorage
  if (typeof window === 'undefined') return;

  const token = localStorage.getItem('token');
  // ... rest of code
};
```

## Testing

To verify the fix works:

```bash
cd client
npm run build
```

The build should complete successfully without any `localStorage` errors.

## Best Practices Going Forward

1. **Never access `localStorage` at the top level** of a component
2. **Always check** `typeof window !== 'undefined'` before using browser APIs
3. **Use `useEffect`** for localStorage operations when possible:
   ```typescript
   useEffect(() => {
     const userId = localStorage.getItem('userId');
     // Safe because useEffect only runs in browser
   }, []);
   ```
4. **Consider using the authAPI** which already has built-in checks:
   ```typescript
   const user = authAPI.getCurrentUser(); // Safe
   ```

## Deployment Impact

These fixes are **critical** for:

- ✅ Production builds (`npm run build`)
- ✅ Static exports (`output: 'export'` in next.config.mjs)
- ✅ Render.com deployment (Web Service or Static Site)
- ✅ Vercel, Netlify, and other hosting platforms

Without these fixes, the deployment would **fail** at build time.

