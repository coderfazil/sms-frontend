# sms-frontend

Set `VITE_API_BASE_URL` in Vercel to your backend origin, for example:

```env
VITE_API_BASE_URL=https://sms-backend-xuio.onrender.com
```

The frontend app sends requests to `${VITE_API_BASE_URL}/api/...`.
