Security and AI Key Handling

1. Revoke the leaked API key immediately in Google Cloud Console and create a new key.
2. Do NOT store API keys in source control. Use environment variables or a secret manager.
   - Example: set GEMINI_API_KEY on your server or in your deployment pipeline.
3. The application reads the key from `GEMINI_API_KEY` into `gemini.api.key`.
4. Default rate limiting is enforced per client (60 requests/minute). Adjust `gemini.max.requests.per.minute` in `application.properties` if needed.

Recommendations:

- Rotate the key and restrict it to server IPs or use a service account with appropriate IAM.
- If the key was exposed in git history, consider rewriting history (e.g., `git filter-repo`) or contact your provider for immediate rotation and monitoring.
