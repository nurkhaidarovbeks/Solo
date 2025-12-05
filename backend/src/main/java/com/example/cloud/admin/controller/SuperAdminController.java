package com.example.cloud.admin.controller;

import com.example.cloud.admin.model.UserNameRequest;
import com.example.cloud.admin.service.SuperAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/super-admin")
@CrossOrigin
public class SuperAdminController {
    private final SuperAdminService superAdminService;

    @Autowired
    public SuperAdminController(SuperAdminService superAdminService) {
        this.superAdminService = superAdminService;
    }

    @PatchMapping("/promote-to-admin/{username}")
    public ResponseEntity<String> promoteToAdmin(@PathVariable String username){
        return superAdminService.promoteToAdmin(username);
    }

    @PatchMapping("/demote-to-user/{username}")
    public ResponseEntity<String> demoteToUser(@PathVariable String username){
        return superAdminService.demoteToUser(username);
    }
}
