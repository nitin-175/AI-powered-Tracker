package com.nitin.jobtracker.controller;

import com.nitin.jobtracker.model.Job;
import com.nitin.jobtracker.service.GeminiService;
import com.nitin.jobtracker.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final GeminiService geminiService;
    private final JobService jobService;

    public AIController(GeminiService geminiService, JobService jobService) {
        this.geminiService = geminiService;
        this.jobService = jobService;
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testAI() {
        return ResponseEntity.ok(
                Map.of(
                        "status", "AI Service Running",
                        "message", "All AI endpoints available"
                )
        );
    }

    @PostMapping("/analyze/{jobId}")
    public ResponseEntity<Map<String, String>> analyzeJob(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> request) {

        try {
            Job job = jobService.getJobById(jobId);

            String resume = request.get("resume");

            if (resume == null || resume.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Resume text is required"));
            }

            String jobDesc = job.getDescription() != null && !job.getDescription().isBlank()
                    ? job.getDescription()
                    : job.getRole() + " at " + job.getCompany();

            String analysis = geminiService.analyzeJobMatch(jobDesc, resume);

            Map<String, String> response = new HashMap<>();
            response.put("analysis", analysis);
            response.put("jobTitle", job.getCompany() + " - " + job.getRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/cover-letter/{jobId}")
    public ResponseEntity<Map<String, String>> generateCoverLetter(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> request) {

        try {
            Job job = jobService.getJobById(jobId);

            String resume = request.get("resume");

            if (resume == null || resume.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Resume text is required"));
            }

            String coverLetter = geminiService.generateCoverLetter(
                    job.getCompany(),
                    job.getRole(),
                    (job.getDescription() != null && !job.getDescription().isBlank())
        ? job.getDescription()
        : job.getRole() + " at " + job.getCompany(),
                    resume
            );

            return ResponseEntity.ok(
                    Map.of(
                            "coverLetter", coverLetter,
                            "company", job.getCompany(),
                            "role", job.getRole()
                    )
            );

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

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

            return ResponseEntity.ok(
                    Map.of(
                            "email", email,
                            "company", job.getCompany()
                    )
            );

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/improvements/{jobId}")
    public ResponseEntity<Map<String, String>> getImprovements(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> request) {

        try {
            Job job = jobService.getJobById(jobId);

            String resume = request.get("resume");

            if (resume == null || resume.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Resume text is required"));
            }

            String improvements = geminiService.getResumeImprovements(
                    job.getDescription() != null ? job.getDescription() : "",
                    resume
            );

            return ResponseEntity.ok(
                    Map.of("improvements", improvements)
            );

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
