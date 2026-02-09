# Gemini (Generative Language API) — Setup & Testing

## Overview
This document explains how to configure the Gemini API key for local development and how to test it.

## Important
- **Do NOT commit API keys to source control.** Use environment variables or a secret manager.

## Set the environment variable
Windows (PowerShell):
```
setx GEMINI_API_KEY "YOUR_KEY"
```

Linux / macOS (bash):
```
export GEMINI_API_KEY="YOUR_KEY"
```

After setting the variable, restart your shell / IDE and re-run the application.

## Quick curl test
Use this to verify the key talks to the Generative Language API:

Linux / macOS:
```
curl -s -X POST "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Hello"}]}],"generationConfig":{"temperature":0.1,"topP":0.95,"topK":40}}'
```

PowerShell:
```
$body = '{"contents":[{"role":"user","parts":[{"text":"Hello"}]}],"generationConfig":{"temperature":0.1,"topP":0.95,"topK":40}}'
curl -X POST "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent?key=YOUR_KEY" -H "Content-Type: application/json" -d $body
```

If you receive HTTP 400 with message "API Key not found", verify:
- The API key is correct and active
- The **Generative Language API** is enabled on the GCP project
- The key is not restricted by API or IP restrictions
- Billing is enabled for the project (if required)

## Health check
You can verify the backend AI readiness with the health endpoint:

```
curl -s http://localhost:8080/api/ai/health
```

- Returns `200` and `{ "status": "ok" }` when the `GEMINI_API_KEY` is configured
- Returns `503` and `{ "status": "gemini_api_key_missing" }` when missing

## Notes
- The application now reads the key from the `GEMINI_API_KEY` environment variable (see `application.properties`).
- The backend logs a warning at startup if the key is not present and will return clear errors from Gemini endpoints when no key is configured.
