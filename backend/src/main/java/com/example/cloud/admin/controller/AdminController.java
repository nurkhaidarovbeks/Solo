package com.example.cloud.admin.controller;

import com.example.cloud.admin.service.AdminService;
import com.example.cloud.cloud.model.Plan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {
    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PatchMapping("/ban/{username}")
    public ResponseEntity<String> banUser(@PathVariable String username){
        return adminService.banUser(username);
    }

    @PatchMapping("/unban/{username}")
    public ResponseEntity<String> unbanUser(@PathVariable String username){
        return adminService.unbanUser(username);
    }

    @PatchMapping("/change-plan/{username}")
    public ResponseEntity<String> changePlan(@PathVariable String username, @RequestBody Plan plan){
        return adminService.changePlan(username, plan);
    }
}
