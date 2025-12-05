package com.example.cloud.auth.controller;

import com.example.cloud.auth.model.UserStatsResponseDto;
import com.example.cloud.auth.service.MyUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/me") // Adjusted to match proxy rewrite
@CrossOrigin // For local development, consider more specific CORS configuration for production
public class UserStatsController {

    private final MyUserService myUserService;

    @Autowired
    public UserStatsController(MyUserService myUserService) {
        this.myUserService = myUserService;
    }

    @GetMapping("/stats")
    public ResponseEntity<UserStatsResponseDto> getUserStats() {
        return myUserService.getUserStats();
    }
}
