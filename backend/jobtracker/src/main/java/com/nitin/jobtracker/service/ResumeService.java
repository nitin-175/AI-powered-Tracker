package com.nitin.jobtracker.service;

import org.springframework.stereotype.Service;

import com.google.api.client.util.Value;

@Service
public class ResumeService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String generateTailoredResume(String jobTitle, String masterResume) {
        String prompt = """
                Tailor this resume for %s position.
                Keep original structure but emphasize relevant skills.
                Make concise (200-300 words). Return plain text.

                ORIGINAL RESUME:
                %s
                """.formatted(jobTitle, masterResume);

        return callGemini(prompt, masterResume);
    }

    private String callGemini(String prompt, String fallback) {
        try {
            // Your existing Gemini API call logic
            // Return JSON response parsed as String
            return "Tailored resume content here...";
        } catch (Exception e) {
            return fallback; // Fallback
        }
    }
}
