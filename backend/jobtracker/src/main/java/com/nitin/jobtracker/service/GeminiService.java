package com.nitin.jobtracker.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Gson gson = new Gson();

    public String analyzeJobMatch(String jobDescription, String resume) {

        String prompt =
                "You are an ATS system. Compare the JOB and the RESUME and return ONLY valid JSON with this exact structure:\n" +
                        "{ \"matchScore\": number, \"strengths\": [], \"improvements\": [], \"keySkillsToHighlight\": [] }\n\n" +
                        "JOB:\n" + jobDescription + "\n\nRESUME:\n" + resume;

        return callGemini(prompt, true);
    }

    public String generateCoverLetter(String company, String role, String jobDescription, String resume) {

        String prompt =
                "Write a professional ATS-friendly cover letter of 180 to 220 words for the role of " +
                        role + " at " + company + ".\n\nJOB:\n" + jobDescription + "\n\nRESUME:\n" + resume;

        return callGemini(prompt, false);
    }

    public String generateApplicationEmail(String company, String role, String hiringManager) {

        String prompt =
                "Write a short and professional job application email for the role of " + role +
                        " at " + company + " addressed to " + hiringManager + ".";

        return callGemini(prompt, false);
    }

    public String getResumeImprovements(String jobDescription, String resume) {

        String prompt =
                "Based on the JOB and RESUME, list clear bullet points for resume improvements.\n\n" +
                        "JOB:\n" + jobDescription + "\n\nRESUME:\n" + resume;

        return callGemini(prompt, false);
    }

    private String callGemini(String prompt, boolean cleanJson) {

        try {

            String url = apiUrl + "?key=" + apiKey;

            Map<String, Object> body = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "role", "user",
                                    "parts", List.of(
                                            Map.of("text", prompt)
                                    )
                            )
                    ),
                    "generationConfig", Map.of(
                            "temperature", cleanJson ? 0.1 : 0.7,
                            "topP", 0.95,
                            "topK", 40
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return "{\"error\":\"Gemini returned empty response\"}";
            }

            return extractText(response.getBody(), cleanJson);

        } catch (HttpStatusCodeException e) {

            return "{\"error\":\"Gemini HTTP error\",\"status\":" +
                    e.getStatusCode().value() +
                    ",\"body\":" +
                    gson.toJson(e.getResponseBodyAsString()) +
                    "}";

        } catch (Exception e) {

            return "{\"error\":\"Gemini request failed\",\"message\":\"" +
                    e.getMessage().replace("\"", "'") + "\"}";
        }
    }

    private String extractText(String raw, boolean cleanJson) {

        JsonObject root = gson.fromJson(raw, JsonObject.class);

        if (root == null || !root.has("candidates")) {
            return "{\"error\":\"Invalid Gemini response format\"}";
        }

        JsonArray candidates = root.getAsJsonArray("candidates");

        if (candidates == null || candidates.isEmpty()) {
            return "{\"error\":\"No candidates returned by Gemini\"}";
        }

        JsonObject first = candidates.get(0).getAsJsonObject();

        if (!first.has("content")) {
            return "{\"error\":\"No content in Gemini response\"}";
        }

        JsonObject content = first.getAsJsonObject("content");

        if (!content.has("parts")) {
            return "{\"error\":\"No parts in Gemini response\"}";
        }

        JsonArray parts = content.getAsJsonArray("parts");

        if (parts == null || parts.isEmpty()) {
            return "{\"error\":\"Empty parts in Gemini response\"}";
        }

        JsonObject part = parts.get(0).getAsJsonObject();

        if (!part.has("text")) {
            return "{\"error\":\"No text field in Gemini response\"}";
        }

        String text = part.get("text").getAsString();

        if (!cleanJson) return text;

        return text
                .replace("```json", "")
                .replace("```", "")
                .trim();
    }
}
