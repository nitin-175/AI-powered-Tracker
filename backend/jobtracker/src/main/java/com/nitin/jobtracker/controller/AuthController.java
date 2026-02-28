package com.nitin.jobtracker.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nitin.jobtracker.security.JwtUtil;
import com.nitin.jobtracker.model.LoginRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // obtain manager when needed to avoid bean creation issues
    @Autowired
    private org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration authConfig;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        authConfig.getAuthenticationManager().authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String token = jwtUtil.generateToken(request.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }
}
