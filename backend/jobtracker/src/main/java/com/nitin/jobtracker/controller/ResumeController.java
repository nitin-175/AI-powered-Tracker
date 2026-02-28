package com.nitin.jobtracker.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nitin.jobtracker.service.ResumeService;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateResume(
            @RequestBody Map<String, String> request) {

        String jobTitle = request.get("jobTitle");
        String masterResume = request.get("masterResume");

        String tailoredResume = resumeService.generateTailoredResume(jobTitle, masterResume);

        Map<String, Object> response = new HashMap<>();
        response.put("resume", tailoredResume);
        response.put("downloadUrl",
                "/api/resume/download?content=" + URLEncoder.encode(tailoredResume, StandardCharsets.UTF_8));

        return ResponseEntity.ok(response);
    }
}
