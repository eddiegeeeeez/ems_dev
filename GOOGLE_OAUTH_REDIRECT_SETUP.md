# Google OAuth Redirect URL Setup

## About localhost:8000 vs 127.0.0.1

Both `localhost:8000` and `127.0.0.1:8000` are functionally the same - they both point to your local machine. However, for Google OAuth to work properly, you need to ensure consistency:

1. **Google OAuth Console**: The redirect URI you register in Google Cloud Console must match exactly what your application uses
2. **APP_URL**: Laravel uses the `APP_URL` from your `.env` file to generate URLs

## Recommended Setup

### Option 1: Use localhost (Recommended for Development)

In your `.env` file:
```env
APP_URL=http://localhost:8000
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

In Google Cloud Console, add:
- `http://localhost:8000/auth/google/callback`

### Option 2: Use 127.0.0.1

In your `.env` file:
```env
APP_URL=http://127.0.0.1:8000
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/auth/google/callback
```

In Google Cloud Console, add:
- `http://127.0.0.1:8000/auth/google/callback`

## Important Notes

1. **Consistency is Key**: Whatever you use in `.env` must match what's in Google Cloud Console
2. **No Trailing Slash**: Don't add a trailing slash to the redirect URI
3. **HTTP vs HTTPS**: For local development, use `http://`. For production, use `https://`
4. **Multiple Redirect URIs**: You can add both `localhost` and `127.0.0.1` in Google Console if you want flexibility

## Current Configuration

The system now uses `APP_URL` from your `.env` file with a fallback:
- If `GOOGLE_REDIRECT_URI` is set in `.env`, it uses that
- Otherwise, it automatically builds the redirect URI from `APP_URL` + `/auth/google/callback`

This ensures consistency and makes it easier to switch between development and production environments.

## Production Setup

For production, update your `.env`:
```env
APP_URL=https://yourdomain.com
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

And add the production URL to Google Cloud Console.

