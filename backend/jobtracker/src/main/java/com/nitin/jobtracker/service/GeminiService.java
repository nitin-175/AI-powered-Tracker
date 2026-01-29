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
    
    // AI Feature 1: Analyze Job Match
    public String analyzeJobMatch(String jobDescription, String resume) {
        String prompt = buildAnalysisPrompt(jobDescription, resume);
        return callGeminiAPI(prompt);
    }
    
    // AI Feature 2: Generate Cover Letter
    public String generateCoverLetter(String company, String role, String jobDescription, String resume) {
        String prompt = buildCoverLetterPrompt(company, role, jobDescription, resume);
        return callGeminiAPI(prompt);
    }
    
    // AI Feature 3: Generate Application Email
    public String generateApplicationEmail(String company, String role, String hiringManager) {
        String prompt = buildEmailPrompt(company, role, hiringManager);
        return callGeminiAPI(prompt);
    }
    
    // AI Feature 4: Improve Resume for Job
    public String getResumeImprovements(String jobDescription, String resume) {
        String prompt = "Analyze this resume against the job description. Suggest 5 specific improvements:\n\n" +
                       "Job Description:\n" + jobDescription + "\n\n" +
                       "Resume:\n" + resume + "\n\n" +
                       "Return JSON: {\"improvements\": [\"improvement 1\", \"improvement 2\", ...]}";
        return callGeminiAPI(prompt);
    }
    
    // Prompt builders
    private String buildAnalysisPrompt(String jobDesc, String resume) {
        return "Analyze the match between this job and resume. Return ONLY valid JSON.\n\n" +
               "Job Description:\n" + jobDesc + "\n\n" +
               "Resume:\n" + resume + "\n\n" +
               "Return ONLY this exact JSON format:\n" +
               "{\n" +
               "  \"matchScore\": 85,\n" +
               "  \"strengths\": [\"Strength 1\", \"Strength 2\", \"Strength 3\"],\n" +
               "  \"improvements\": [\"Add X\", \"Highlight Y\", \"Emphasize Z\"],\n" +
               "  \"keySkillsToHighlight\": [\"Java\", \"Spring Boot\", \"React\"]\n" +
               "}";
    }
    
    private String buildCoverLetterPrompt(String company, String role, String jobDesc, String resume) {
        return "Write a professional cover letter (250-300 words).\n\n" +
               "Company: " + company + "\n" +
               "Role: " + role + "\n" +
               "Job Description: " + jobDesc + "\n" +
               "Candidate Background: " + resume + "\n\n" +
               "Requirements:\n" +
               "- Professional and enthusiastic tone\n" +
               "- Highlight 3-4 most relevant skills from resume\n" +
               "- Show genuine interest in company\n" +
               "- End with strong call to action\n" +
               "- Format: [Opening] [Body with skills] [Closing]";
    }
    
    private String buildEmailPrompt(String company, String role, String hiringManager) {
        return "Write a professional cold email for job application.\n\n" +
               "Company: " + company + "\n" +
               "Role: " + role + "\n" +
               "Recipient: " + (hiringManager != null ? hiringManager : "Hiring Team") + "\n\n" +
               "Format:\n" +
               "Subject: [Write subject line]\n\n" +
               "Body:\n" +
               "[Write 3-4 paragraph email under 150 words]\n\n" +
               "Requirements:\n" +
               "- Include attention-grabbing subject line\n" +
               "- Professional but conversational tone\n" +
               "- Express interest and value proposition\n" +
               "- Mention resume attachment\n" +
               "- Request for consideration/interview";
    }
    
    // Main API call method with MOCK MODE for quota issues
    private String callGeminiAPI(String prompt) {
        try {
            // MOCK MODE - Enable this if quota exceeded
            boolean MOCK_MODE = true;  // Change to false when quota resets
            
            if (MOCK_MODE) {
                System.out.println("🧪 MOCK MODE - Simulating AI response");
                return getMockResponse(prompt);
            }
            
            // Real Gemini API call
            String url = apiUrl + "?key=" + apiKey;
            
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, String> part = new HashMap<>();
            
            part.put("text", prompt);
            content.put("parts", List.of(part));
            requestBody.put("contents", List.of(content));
            
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
    
    // Mock responses for testing without API quota
    private String getMockResponse(String prompt) {
        if (prompt.contains("Analyze")) {
            return """
            {
              "matchScore": 78,
              "strengths": [
                "Strong Java and Spring Boot experience matches backend requirements",
                "React.js skills align with frontend tech stack mentioned",
                "Full-stack project portfolio demonstrates end-to-end capability"
              ],
              "improvements": [
                "Add specific metrics (e.g., 'Reduced API response time by 40%')",
                "Mention cloud platform experience (AWS/Azure) if available",
                "Highlight system design or scalability achievements"
              ],
              "keySkillsToHighlight": ["Spring Boot", "React", "Java", "REST APIs", "PostgreSQL", "Git"]
            }
            """;
        }
        
        if (prompt.contains("cover")) {
        String company = extractCompany(prompt);
        String role = extractRole(prompt);
        return "Dear Hiring Manager,\n\n" +
               "I am writing to express my strong interest in the " + role + " position at " + company + ". " +
               "As a passionate full-stack developer with hands-on experience in Java, Spring Boot, and React, " +
               "I am excited about the opportunity to contribute to your innovative team.\n\n" +
               "My technical background aligns perfectly with your requirements. I have successfully built " +
               "production-ready applications including an AI-powered job tracker using Spring Boot for the backend " +
               "and React for a responsive frontend. My experience with RESTful APIs, database design, and modern " +
               "development practices has equipped me to deliver scalable, maintainable solutions.\n\n" +
               "What particularly excites me about " + company + " is your commitment to cutting-edge technology " +
               "and user-focused solutions. I am eager to bring my problem-solving abilities, quick learning capacity, " +
               "and collaborative mindset to your team.\n\n" +
               "I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to " + 
               company + "'s continued success. Thank you for considering my application.\n\n" +
               "Best regards,\n[Your Name]";
    }
        
         if (prompt.contains("email")) {
        String company = extractCompany(prompt);
        String role = extractRole(prompt);
        return "Subject: Application for " + role + " - Eager Full-Stack Developer\n\n" +
               "Dear Hiring Team,\n\n" +
               "I hope this email finds you well. I recently came across the " + role + " opening at " + 
               company + " and was immediately drawn to the opportunity.\n\n" +
               "As a full-stack developer with strong expertise in Java, Spring Boot, and React, I have built " +
               "several production-ready applications that solve real-world problems. My recent project, an " +
               "AI-powered job application tracker, showcases my ability to integrate modern technologies and " +
               "deliver user-centric solutions.\n\n" +
               "I have attached my resume for your review. I would greatly appreciate the opportunity to discuss " +
               "how my technical skills and passion for development can contribute to your team.\n\n" +
               "Thank you for your time and consideration. I look forward to hearing from you.\n\n" +
               "Best regards,\n[Your Name]\n[Your Phone]\n[Your Email]";
    }
    
    return "Mock AI response generated successfully";
}
    
    private String extractCompany(String prompt) {
        if (prompt.contains("Company:")) {
            return prompt.split("Company:")[1].split("\n")[0].trim();
        }
        return "[Company Name]";
    }
    
    private String extractRole(String prompt) {
        if (prompt.contains("Role:")) {
            return prompt.split("Role:")[1].split("\n")[0].trim();
        }
        return "[Role Name]";
    }
}
