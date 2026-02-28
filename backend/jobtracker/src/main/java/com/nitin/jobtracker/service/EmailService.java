package com.nitin.jobtracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage; // updated for Jakarta Mail

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender; // will be null in tests/mock mode

    // updated signature accepts optional cover letter text plus file
    public void sendCoverLetter(String toEmail,
            String jobTitle,
            String company,
            String coverLetter,
            org.springframework.web.multipart.MultipartFile resumeFile) throws Exception {
        String jt = (jobTitle == null || jobTitle.isEmpty()) ? "<none>" : jobTitle;
        String co = (company == null || company.isEmpty()) ? "<none>" : company;

        if (mailSender == null) {
            // fallback logging
            System.out.println("📧 MOCK EMAIL SENT TO: " + toEmail);
            System.out.println("Job: " + jt + " | Company: " + co);
            if (coverLetter == null || coverLetter.isEmpty()) {
                System.out.println("Cover letter: <none>");
            } else {
                String preview = coverLetter.length() > 100 ? coverLetter.substring(0, 100) + "..." : coverLetter;
                System.out.println("Cover letter: " + preview);
            }
            if (resumeFile != null && !resumeFile.isEmpty()) {
                System.out.println("Attached resume: " + resumeFile.getOriginalFilename());
            }
            return;
        }

        MimeMessage mime = mailSender.createMimeMessage();
        org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
                mime, true);

        helper.setTo(toEmail);
        helper.setSubject("Application for " + jt + " at " + co);
        StringBuilder body = new StringBuilder();
        body.append("Dear recruiter,\n\n");
        if (coverLetter != null && !coverLetter.isEmpty()) {
            body.append(coverLetter).append("\n\n");
        }
        body.append("Best regards,");
        helper.setText(body.toString(), false);

        if (resumeFile != null && !resumeFile.isEmpty()) {
            helper.addAttachment(resumeFile.getOriginalFilename(), resumeFile);
        }

        mailSender.send(mime);
        System.out.println("📧 EMAIL SENT (via SMTP) TO: " + toEmail + " [job=" + jt + ", company=" + co + "]");
    }
}
