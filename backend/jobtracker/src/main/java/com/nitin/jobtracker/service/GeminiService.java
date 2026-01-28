package com.nitin.jobtracker.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class GeminiService {
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    @Value("${gemini.api.url}")
    private String apiUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final Gson gson = new Gson();
    
    public String analyzeJobMatch(String jobDescription, String resume) {
        String prompt = buildAnalysisPrompt(jobDescription, resume);
        return callGeminiAPI(prompt);
    }
    
    public String generateCoverLetter(String company, String role, String jobDescription, String resume) {
        String prompt = buildCoverLetterPrompt(company, role, jobDescription, resume);
        return callGeminiAPI(prompt);
    }
    
    public String generateApplicationEmail(String company, String role, String hiringManager) {
        String prompt = buildEmailPrompt(company, role, hiringManager);
        return callGeminiAPI(prompt);
    }
    
    private String buildAnalysisPrompt(String jobDesc, String resume) {
        return "Analyze the match between this job and resume. Return JSON only.\n\n" +
               "Job Description:\n" + jobDesc + "\n\n" +
               "Resume:\n" + resume + "\n\n" +
               "Return ONLY valid JSON in this exact format:\n" +
               "{\n" +
               "  \"matchScore\": 85,\n" +
               "  \"strengths\": [\"Skill 1\", \"Skill 2\", \"Skill 3\"],\n" +
               "  \"improvements\": [\"Add skill X\", \"Emphasize Y experience\"],\n" +
               "  \"keySkillsToHighlight\": [\"Java\", \"Spring Boot\", \"React\"]\n" +
               "}";
    }
    
    private String buildCoverLetterPrompt(String company, String role, String jobDesc, String resume) {
        return "Write a professional cover letter (250 words max).\n\n" +
               "Company: " + company + "\n" +
               "Role: " + role + "\n" +
               "Job Description: " + jobDesc + "\n" +
               "Candidate Background: " + resume + "\n\n" +
               "Requirements:\n" +
               "- Professional tone\n" +
               "- Highlight relevant skills from resume\n" +
               "- Show enthusiasm for role\n" +
               "- Keep it concise and impactful\n" +
               "- End with call to action";
    }
    
    private String buildEmailPrompt(String company, String role, String hiringManager) {
        return "Write a professional cold email for a job application.\n\n" +
               "Company: " + company + "\n" +
               "Role: " + role + "\n" +
               "Hiring Manager: " + (hiringManager != null ? hiringManager : "Hiring Team") + "\n\n" +
               "Requirements:\n" +
               "- Subject line included\n" +
               "- Under 150 words\n" +
               "- Professional but conversational\n" +
               "- Express interest and request consideration\n" +
               "- Include placeholder for resume attachment";
    }
    
    private String callGeminiAPI(String prompt) {
        try {
            String url = apiUrl + "?key=" + apiKey;
            
            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, String> part = new HashMap<>();
            
            part.put("text", prompt);
            content.put("parts", List.of(part));
            requestBody.put("contents", List.of(content));
            
            // Make API call
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            // Parse response
            JsonObject jsonResponse = gson.fromJson(response.getBody(), JsonObject.class);
            JsonArray candidates = jsonResponse.getAsJsonArray("candidates");
            
            if (candidates != null && candidates.size() > 0) {
                JsonObject firstCandidate = candidates.get(0).getAsJsonObject();
                JsonObject content2 = firstCandidate.getAsJsonObject("content");
                JsonArray parts = content2.getAsJsonArray("parts");
                
                if (parts != null && parts.size() > 0) {
                    return parts.get(0).getAsJsonObject().get("text").getAsString();
                }
            }
            
            return "Error: No response from AI";
            
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}

