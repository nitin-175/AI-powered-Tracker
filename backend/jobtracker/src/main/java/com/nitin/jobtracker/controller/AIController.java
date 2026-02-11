package com.nitin.jobtracker.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.nitin.jobtracker.model.Job;
import com.nitin.jobtracker.service.GeminiService;
import com.nitin.jobtracker.service.JobService;
import com.nitin.jobtracker.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final GeminiService geminiService;
    private final JobService jobService;
    private final RateLimiterService rateLimiterService;

    private final Gson gson = new Gson();

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AIController.class);

    public AIController(GeminiService geminiService,
            JobService jobService,
            RateLimiterService rateLimiterService) {
        this.geminiService = geminiService;
        this.jobService = jobService;
        this.rateLimiterService = rateLimiterService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        if (geminiService.isConfigured()) {
            return ResponseEntity.ok(Map.of("status", "ok"));
        }
        return ResponseEntity.status(503).body(Map.of("status", "ollama_not_configured"));
    }

    @GetMapping("/models")
    public ResponseEntity<String> listModels() {
        String models = geminiService.listModels();
        if (models != null && models.trim().startsWith("{\"error\"")) {
            return ResponseEntity.status(502).body(models);
        }
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(models);
    }

    @PostMapping("/analyze/{jobId}")
    public ResponseEntity<?> analyzeJob(@PathVariable Long jobId,
            @RequestBody(required = false) String body,
            HttpServletRequest request) {

        checkRate(request);

        try {

            Job job = jobService.getJobById(jobId);

            String resume = extractResume(body);

            if (resume == null || resume.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Resume text is required"));
            }

            String jobDesc = (job.getDescription() != null && !job.getDescription().isBlank())
                    ? job.getDescription()
                    : job.getRole() + " at " + job.getCompany();

            String result = geminiService.analyzeJobMatch(jobDesc, resume);

            if (isError(result)) {
                return buildError(result);
            }

            Map<String, Object> analysisMap = gson.fromJson(result, Map.class);

            return ResponseEntity.ok(
                    Map.of(
                            "jobTitle", job.getCompany() + " - " + job.getRole(),
                            "analysis", analysisMap));

        } catch (Exception e) {
            if (e instanceof ResponseStatusException)
                throw (ResponseStatusException) e;

            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage() == null ? "Internal server error" : e.getMessage()));
        }
    }

    @PostMapping("/cover-letter/{jobId}")
    public ResponseEntity<?> generateCoverLetter(@PathVariable Long jobId,
            @RequestBody(required = false) String body,
            HttpServletRequest request) {

        checkRate(request);

        try {

            Job job = jobService.getJobById(jobId);

            String resume = extractResume(body);

            if (resume == null || resume.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Resume text is required"));
            }

            String result = geminiService.generateCoverLetter(
                    job.getCompany(),
                    job.getRole(),
                    (job.getDescription() != null && !job.getDescription().isBlank())
                            ? job.getDescription()
                            : job.getRole() + " at " + job.getCompany(),
                    resume);

            if (isError(result)) {
                return buildError(result);
            }

            return ResponseEntity.ok(
                    Map.of(
                            "company", job.getCompany(),
                            "role", job.getRole(),
                            "coverLetter", result));

        } catch (Exception e) {
            if (e instanceof ResponseStatusException)
                throw (ResponseStatusException) e;

            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage() == null ? "Internal server error" : e.getMessage()));
        }
    }

    @PostMapping("/email/{jobId}")
    public ResponseEntity<?> generateEmail(@PathVariable Long jobId,
            HttpServletRequest request) {

        checkRate(request);

        try {

            Job job = jobService.getJobById(jobId);

            String result = geminiService.generateApplicationEmail(
                    job.getCompany(),
                    job.getRole(),
                    "Hiring Manager");

            if (isError(result)) {
                return buildError(result);
            }

            return ResponseEntity.ok(
                    Map.of(
                            "company", job.getCompany(),
                            "email", result));

        } catch (Exception e) {
            if (e instanceof ResponseStatusException)
                throw (ResponseStatusException) e;

            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage() == null ? "Internal server error" : e.getMessage()));
        }
    }

    @PostMapping("/improvements/{jobId}")
    public ResponseEntity<?> getImprovements(@PathVariable Long jobId,
            @RequestBody(required = false) String body,
            HttpServletRequest request) {

        checkRate(request);

        try {

            Job job = jobService.getJobById(jobId);

            String resume = extractResume(body);

            if (resume == null || resume.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Resume text is required"));
            }

            String result = geminiService.getResumeImprovements(
                    job.getDescription() != null ? job.getDescription() : "",
                    resume);

            if (isError(result)) {
                return buildError(result);
            }

            return ResponseEntity.ok(Map.of("improvements", result));

        } catch (Exception e) {
            if (e instanceof ResponseStatusException)
                throw (ResponseStatusException) e;

            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage() == null ? "Internal server error" : e.getMessage()));
        }
    }

    private void checkRate(HttpServletRequest request) {
        String client = request.getRemoteAddr();
        if (!rateLimiterService.allow(client)) {
            logger.warn("Rate limit exceeded for {}", client);
        }
    }

    private boolean isError(String json) {
        return json != null && json.trim().startsWith("{\"error\"");
    }

    private ResponseEntity<?> buildError(String json) {
    try {
        Map<String, Object> map = gson.fromJson(json, Map.class);
        Object statusObj = map.get("status");
        int status = statusObj instanceof Number ? ((Number) statusObj).intValue() : 502;
        return ResponseEntity.status(status).body(map);
    } catch (Exception e) {
        return ResponseEntity.status(502).body(Map.of("error", json));
    }
}


    private String extractResume(String body) {
        if (body == null || body.isBlank())
            return null;
        try {
            Map<?, ?> parsed = gson.fromJson(body, Map.class);
            Object v = parsed.get("resume");
            return v == null ? null : v.toString();
        } catch (Exception e) {
            return null;
        }
    }
}
