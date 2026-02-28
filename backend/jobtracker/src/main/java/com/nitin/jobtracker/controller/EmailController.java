package com.nitin.jobtracker.controller;

import com.nitin.jobtracker.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping(value = "/cover-letter", consumes = { "multipart/form-data" })
    public ResponseEntity<String> sendCoverLetter(
            @RequestParam("email") String email,
            @RequestParam(value = "jobTitle", required = false) String jobTitle,
            @RequestParam(value = "company", required = false) String company,
            @RequestParam(value = "coverLetter", required = false) String coverLetter,
            @RequestPart(value = "resumeFile", required = false) org.springframework.web.multipart.MultipartFile resumeFile) {
        // basic validation
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Recipient email is required");
        }
        if ((coverLetter == null || coverLetter.trim().isEmpty()) && (resumeFile == null || resumeFile.isEmpty())) {
            return ResponseEntity.badRequest().body("Either cover letter text or resume file must be provided");
        }
        try {
            emailService.sendCoverLetter(
                    email.trim(),
                    jobTitle == null ? "" : jobTitle,
                    company == null ? "" : company,
                    coverLetter == null ? "" : coverLetter.trim(),
                    resumeFile);
            return ResponseEntity.ok("Email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Email error: " + e.getMessage());
        }
    }
}
