package com.example.cloud.auth.controller;

import com.example.cloud.auth.model.AuthDto;
import com.example.cloud.auth.model.LoginRequestDto; // Import LoginRequestDto
import com.example.cloud.auth.service.MyUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {
    private final MyUserService myUserService;

    @Autowired
    public AuthController(MyUserService myUserService) {
        this.myUserService = myUserService;
    }

    @PostMapping("/registration")
    public ResponseEntity<String> registration(@Valid @RequestBody AuthDto authDto){
        return myUserService.registration(authDto);
    }

    @PostMapping("/login") // Changed from @GetMapping to @PostMapping
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequestDto loginRequestDto) { // Use LoginRequestDto and @Valid
        return myUserService.login(loginRequestDto);
    }
}
