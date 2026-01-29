package com.nitin.jobtracker.controller;

import com.nitin.jobtracker.service.GeminiService;
import com.nitin.jobtracker.service.JobService;
import com.nitin.jobtracker.model.Job;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {
    
    @Autowired
    private GeminiService geminiService;
    
    @Autowired
    private JobService jobService;
    
    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testAI() {
        return ResponseEntity.ok(Map.of(
            "status", "AI Service Running",
            "message", "All AI endpoints available"
        ));
    }
    
    // AI Feature 1: Analyze job-resume match
    @PostMapping("/analyze/{jobId}")
    public ResponseEntity<Map<String, String>> analyzeJob(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> request) {
        
        try {
            Job job = jobService.getJobById(jobId);
            String resume = request.get("resume");
            
            if (resume == null || resume.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Resume text is required"));
            }
            
            String analysis = geminiService.analyzeJobMatch(
                job.getDescription() != null ? job.getDescription() : "No description available", 
                resume
            );
            
            Map<String, String> response = new HashMap<>();
            response.put("analysis", analysis);
            response.put("jobTitle", job.getCompany() + " - " + job.getRole());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "AI analysis failed: " + e.getMessage()));
        }
    }
    
    // AI Feature 2: Generate cover letter
    @PostMapping("/cover-letter/{jobId}")
    public ResponseEntity<Map<String, String>> generateCoverLetter(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> request) {
        
        try {
            Job job = jobService.getJobById(jobId);
            String resume = request.get("resume");
            
            if (resume == null || resume.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Resume text required"));
            }
            
            String coverLetter = geminiService.generateCoverLetter(
                job.getCompany(),
                job.getRole(),
                job.getDescription() != null ? job.getDescription() : "No description",
                resume
            );
            
            return ResponseEntity.ok(Map.of(
                "coverLetter", coverLetter,
                "company", job.getCompany(),
                "role", job.getRole()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // AI Feature 3: Generate application email
    @PostMapping("/email/{jobId}")
    public ResponseEntity<Map<String, String>> generateEmail(
            @PathVariable Long jobId) {
        
        try {
            Job job = jobService.getJobById(jobId);
            
            String email = geminiService.generateApplicationEmail(
                job.getCompany(),
                job.getRole(),
                "Hiring Manager"
            );
            
            return ResponseEntity.ok(Map.of(
                "email", email,
                "company", job.getCompany()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // AI Feature 4: Get resume improvements
    @PostMapping("/improvements/{jobId}")
    public ResponseEntity<Map<String, String>> getImprovements(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> request) {
        
        try {
            Job job = jobService.getJobById(jobId);
            String resume = request.get("resume");
            
            String improvements = geminiService.getResumeImprovements(
                job.getDescription() != null ? job.getDescription() : "",
                resume
            );
            
            return ResponseEntity.ok(Map.of("improvements", improvements));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }
}
