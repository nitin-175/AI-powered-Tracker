package com.nitin.jobtracker.service;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class GeminiService implements InitializingBean {

    @Value("${ollama.api.url:}")
    private String ollamaApiUrl;

    @Value("${ollama.model:qwen2.5:3b}")
    private String model;

    @Autowired
    private RestTemplate restTemplate;

    private final Gson gson = new Gson();

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(GeminiService.class);

    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong totalErrors = new AtomicLong(0);

    @Override
    public void afterPropertiesSet() {
        if (ollamaApiUrl == null || ollamaApiUrl.isBlank()) {
            logger.error("ollama.api.url is not configured");
        } else {
            logger.info("Ollama API URL: {}", ollamaApiUrl);
        }
    }

    public String analyzeJobMatch(String jobDescription, String resume) {

        String prompt = "You are an experienced technical recruiter and ATS evaluator.\n" +
                "Use ONLY the information present in the resume and the job description.\n" +
                "Do NOT invent skills, tools or experience.\n" +
                "Rules:\n" +
                "- Base every point only on the provided resume and job description.\n" +
                "- Do not guess missing experience.\n" +
                "- Be specific and practical.\n" +
                "- Return ONLY valid JSON.\n\n" +
                "Return JSON in this exact format:\n" +
                "{\n" +
                "  \"matchScore\": integer between 0 and 100,\n" +
                "  \"strengths\": [string],\n" +
                "  \"missingOrWeakSkills\": [string],\n" +
                "  \"improvements\": [string],\n" +
                "  \"projectSuggestions\": [string],\n" +
                "  \"resumeLineExamples\": [string],\n" +
                "  \"keySkillsToHighlight\": [string]\n" +
                "}\n\n" +
                "JOB:\n" + limit(jobDescription, 1800) + "\n\n" +
                "RESUME:\n" + limit(resume, 1800);

        String result = callOllama(prompt, true, 180);
        return normalizeScore(result);
    }

    public String generateCoverLetter(String company, String role, String jobDescription, String resume) {

        String prompt = "Write a professional ATS-friendly cover letter of 180 to 220 words for the role of " +
                role + " at " + company + ".\n\nJOB:\n" +
                limit(jobDescription, 2500) + "\n\nRESUME:\n" +
                limit(resume, 2500);

        return callOllama(prompt, false, 300);
    }

    public String generateApplicationEmail(String company, String role, String hiringManager) {

        String prompt = "Write a short and professional job application email for the role of " +
                role + " at " + company + " addressed to " + hiringManager + ".";

        return callOllama(prompt, false, 180);
    }

    public String getResumeImprovements(String jobDescription, String resume) {

        String prompt = "Based on the JOB and RESUME, list clear and actionable bullet points for resume improvements.\n\n"
                +
                "JOB:\n" + limit(jobDescription, 2000) + "\n\nRESUME:\n" +
                limit(resume, 2000);

        return callOllama(prompt, false, 220);
    }

    private String callOllama(String prompt, boolean cleanJson, int maxTokens) {

        if (ollamaApiUrl == null || ollamaApiUrl.isBlank()) {
            return error("Ollama API URL is not configured");
        }

        totalRequests.incrementAndGet();

        String url = ollamaApiUrl.endsWith("/")
                ? ollamaApiUrl + "api/generate"
                : ollamaApiUrl + "/api/generate";

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("prompt", prompt);
        body.put("temperature", cleanJson ? 0.2 : 0.6);
        body.put("num_predict", maxTokens);
        body.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return error("Empty response from Ollama");
            }

            String raw = response.getBody();

            JsonElement element = gson.fromJson(raw, JsonElement.class);

            if (element != null && element.isJsonObject()) {

                JsonObject obj = element.getAsJsonObject();

                if (obj.has("response")) {
                    return clean(obj.get("response").getAsString(), cleanJson);
                }

                if (obj.has("output")) {
                    return clean(obj.get("output").getAsString(), cleanJson);
                }

                if (obj.has("text")) {
                    return clean(obj.get("text").getAsString(), cleanJson);
                }
            }

            return clean(raw, cleanJson);

        } catch (HttpStatusCodeException e) {

            totalErrors.incrementAndGet();

            return error(
                    "Ollama HTTP error",
                    "status=" + e.getStatusCode().value(),
                    e.getResponseBodyAsString());

        } catch (Exception e) {

            totalErrors.incrementAndGet();

            if (e.getCause() instanceof java.net.SocketTimeoutException) {
                return error("Ollama request timed out");
            }

            if (e instanceof java.net.ConnectException ||
                    e.getCause() instanceof java.net.ConnectException) {
                return error("Cannot connect to Ollama at " + ollamaApiUrl);
            }

            return error("Ollama request failed", e.getMessage());
        }
    }

    public String listModels() {

        if (ollamaApiUrl == null || ollamaApiUrl.isBlank()) {
            return error("Ollama API URL is not configured");
        }

        String url = ollamaApiUrl.endsWith("/")
                ? ollamaApiUrl + "api/models"
                : ollamaApiUrl + "/api/models";

        try {

            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return error("Empty model list from Ollama");
            }

            return response.getBody();

        } catch (HttpStatusCodeException e) {

            return error(
                    "Ollama HTTP error",
                    "status=" + e.getStatusCode().value(),
                    e.getResponseBodyAsString());

        } catch (Exception e) {

            return error("Ollama request failed", e.getMessage());
        }
    }

    public boolean isConfigured() {
        return ollamaApiUrl != null && !ollamaApiUrl.isBlank();
    }

    private String limit(String text, int max) {
        if (text == null)
            return "";
        return text.length() <= max ? text : text.substring(0, max);
    }

    private String normalizeScore(String json) {
        try {
            JsonObject obj = gson.fromJson(json, JsonObject.class);
            if (obj != null && obj.has("matchScore")) {
                double v = obj.get("matchScore").getAsDouble();
                int score = v <= 1 ? (int) Math.round(v * 100) : (int) Math.round(v);
                obj.addProperty("matchScore", score);
                return gson.toJson(obj);
            }
        } catch (Exception ignore) {
        }
        return json;
    }

    private String clean(String text, boolean cleanJson) {
        if (!cleanJson || text == null)
            return text;
        return text.replace("```json", "").replace("```", "").trim();
    }

    private String error(String message) {
        Map<String, Object> map = new HashMap<>();
        map.put("error", message);
        return gson.toJson(map);
    }

    private String error(String message, String detail) {
        Map<String, Object> map = new HashMap<>();
        map.put("error", message);
        map.put("detail", detail);
        return gson.toJson(map);
    }

    private String error(String message, String detail, String body) {
        Map<String, Object> map = new HashMap<>();
        map.put("error", message);
        map.put("detail", detail);
        map.put("body", body);
        return gson.toJson(map);
    }
}
