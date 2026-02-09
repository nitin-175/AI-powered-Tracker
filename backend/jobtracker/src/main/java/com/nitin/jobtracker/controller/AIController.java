package com.nitin.jobtracker.controller;

import com.nitin.jobtracker.model.Job;
import com.nitin.jobtracker.service.GeminiService;
import com.nitin.jobtracker.service.JobService;
import com.nitin.jobtracker.service.RateLimiterService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final GeminiService geminiService;
    private final JobService jobService;
    private final RateLimiterService rateLimiterService;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AIController.class);

    public AIController(GeminiService geminiService, JobService jobService, RateLimiterService rateLimiterService) {
        this.geminiService = geminiService;
        this.jobService = jobService;
        this.rateLimiterService = rateLimiterService;
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testAI() {
        return ResponseEntity.ok(Map.of("status", "AI Service Running", "message", "All AI endpoints available"));
    }

    @GetMapping("/models")
    public ResponseEntity<String> listModels() {
        try {
            String models = geminiService.listModels();

            if (models != null && models.trim().startsWith("{\"error\":")) {
                return ResponseEntity.status(502).body(models);
            }

            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(models);
        } catch (Exception e) {
            if (e instanceof ResponseStatusException)
                throw (ResponseStatusException) e;
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    "{\"error\":\"" + (e.getMessage() == null ? "Internal server error" : e.getMessage()) + "\"}");
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        if (geminiService.isConfigured()) {
            return ResponseEntity.ok(Map.of("status", "ok"));
        }

        return ResponseEntity.status(503).body(Map.of("status", "gemini_api_key_missing"));
    }

    @PostMapping("/analyze/{jobId}")
    public ResponseEntity<Map<String, String>> analyzeJob(@PathVariable Long jobId,
            @RequestBody(required = false) String body, HttpServletRequest request) {

        // Rate limiting (by client IP)
        String client = request.getRemoteAddr();
        if (!rateLimiterService.allow(client)) {
            logger.warn("Rate limit exceeded for {}", client);
            return ResponseEntity.status(429)
                    .body(Map.of("error", "Rate limit exceeded", "body", "Rate limit exceeded for " + client));
        }
        try {
            Job job = jobService.getJobById(jobId);

            String resume = extractResumeFromBody(body);

            if (resume == null || resume.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Resume text is required"));
            }

            String jobDesc = job.getDescription() != null && !job.getDescription().isBlank() ? job.getDescription()
                    : job.getRole() + " at " + job.getCompany();

            String analysis = geminiService.analyzeJobMatch(jobDesc, resume);

            if (analysis != null && analysis.trim().startsWith("{\"error\":")) {
                try {
                    com.google.gson.JsonObject obj = com.google.gson.JsonParser.parseString(analysis).getAsJsonObject();
                    int status = obj.has("status") ? obj.get("status").getAsInt() : 502;
                    return ResponseEntity.status(status)
                            .body(Map.of("error", obj.has("body") ? obj.get("body").getAsString() : obj.toString()));
                } catch (Exception ex) {
                    return ResponseEntity.status(502).body(Map.of("error", analysis));
                }
            }

            Map<String, String> response = new HashMap<>();
            response.put("analysis", analysis);
            response.put("jobTitle", job.getCompany() + " - " + job.getRole());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            if (e instanceof ResponseStatusException)
                throw (ResponseStatusException) e;
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage() == null ? "Internal server error" : e.getMessage()));
        }
    }

    @PostMapping("/cover-letter/{jobId}")
    public ResponseEntity<Map<String, String>> generateCoverLetter(@PathVariable Long jobId,
            @RequestBody(required = false) String body, HttpServletRequest request) {

        String client = request.getRemoteAddr();
        if (!rateLimiterService.allow(client)) {
            logger.warn("Rate limit exceeded for {}", client);
            return ResponseEntity.status(429)
                    .body(Map.of("error", "Rate limit exceeded", "body", "Rate limit exceeded for " + client));
        }
        try {
            Job job = jobService.getJobById(jobId);

            String resume = extractResumeFromBody(body);

            if (resume == null || resume.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Resume text is required"));
            }

            String coverLetter = geminiService.generateCoverLetter(
                    job.getCompany(),
                    job.getRole(),
                    (job.getDescription() != null && !job.getDescription().isBlank()) ? job.getDescription()
                            : job.getRole() + " at " + job.getCompany(),
                    resume);

            if (coverLetter != null && coverLetter.trim().startsWith("{\"error\":")) {
                try {
                    com.google.gson.JsonObject obj = com.google.gson.JsonParser.parseString(coverLetter)
                            .getAsJsonObject();
                    int status = obj.has("status") ? obj.get("status").getAsInt() : 502;
                    return ResponseEntity.status(status)
                            .body(Map.of("error", obj.has("body") ? obj.get("body").getAsString() : obj.toString()));
                } catch (Exception ex) {
                    return ResponseEntity.status(502).body(Map.of("error", coverLetter));
                }
            }

            return ResponseEntity
                    .ok(Map.of("coverLetter", coverLetter, "company", job.getCompany(), "role", job.getRole()));
        } catch (Exception e) {
            if (e instanceof ResponseStatusException)
                throw (ResponseStatusException) e;
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage() == null ? "Internal server error" : e.getMessage()));
        }
    }

    @PostMapping("/email/{jobId}")
    public ResponseEntity<Map<String, String>> generateEmail(@PathVariable Long jobId, HttpServletRequest request) {

        String client = request.getRemoteAddr();
        if (!rateLimiterService.allow(client)) {
            logger.warn("Rate limit exceeded for {}", client);
            return ResponseEntity.status(429)
                    .body(Map.of("error", "Rate limit exceeded", "body", "Rate limit exceeded for " + client));
        }
        try {
            Job job = jobService.getJobById(jobId);

            String email = geminiService.generateApplicationEmail(job.getCompany(), job.getRole(), "Hiring Manager");

            if (email != null && email.trim().startsWith("{\"error\":")) {
                try {
                    com.google.gson.JsonObject obj = com.google.gson.JsonParser.parseString(email).getAsJsonObject();
                    int status = obj.has("status") ? obj.get("status").getAsInt() : 502;
                    return ResponseEntity.status(status)
                            .body(Map.of("error", obj.has("body") ? obj.get("body").getAsString() : obj.toString()));
                } catch (Exception ex) {
                    return ResponseEntity.status(502).body(Map.of("error", email));
                }
            }

            return ResponseEntity.ok(Map.of("email", email, "company", job.getCompany()));
        } catch (Exception e) {
            if (e instanceof ResponseStatusException)
                throw (ResponseStatusException) e;
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage() == null ? "Internal server error" : e.getMessage()));
        }
    }

    @PostMapping("/improvements/{jobId}")
    public ResponseEntity<Map<String, String>> getImprovements(@PathVariable Long jobId,
            @RequestBody(required = false) String body, HttpServletRequest request) {

        String client = request.getRemoteAddr();
        if (!rateLimiterService.allow(client)) {
            logger.warn("Rate limit exceeded for {}", client);
            return ResponseEntity.status(429)
                    .body(Map.of("error", "Rate limit exceeded", "body", "Rate limit exceeded for " + client));
        }
        try {
            Job job = jobService.getJobById(jobId);

            String resume = extractResumeFromBody(body);

            if (resume == null || resume.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Resume text is required"));
            }

            String improvements = geminiService
                    .getResumeImprovements(job.getDescription() != null ? job.getDescription() : "", resume);

            if (improvements != null && improvements.trim().startsWith("{\"error\":")) {
                try {
                    com.google.gson.JsonObject obj = com.google.gson.JsonParser.parseString(improvements)
                            .getAsJsonObject();
                    int status = obj.has("status") ? obj.get("status").getAsInt() : 502;
                    return ResponseEntity.status(status)
                            .body(Map.of("error", obj.has("body") ? obj.get("body").getAsString() : obj.toString()));
                } catch (Exception ex) {
                    return ResponseEntity.status(502).body(Map.of("error", improvements));
                }
            }

            return ResponseEntity.ok(Map.of("improvements", improvements));
        } catch (Exception e) {
            if (e instanceof ResponseStatusException)
                throw (ResponseStatusException) e;
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage() == null ? "Internal server error" : e.getMessage()));
        }
    }

    // small helper to extract resume from request body JSON
    private String extractResumeFromBody(String body) {
        if (body == null || body.isBlank())
            return null;
        try {
            com.google.gson.Gson gsonLocal = new com.google.gson.Gson();
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> parsed = gsonLocal.fromJson(body, java.util.Map.class);
            if (parsed != null && parsed.get("resume") != null) {
                return parsed.get("resume").toString();
            }
        } catch (Exception ignore) {
            // ignore
        }
        return null;
    }
}
