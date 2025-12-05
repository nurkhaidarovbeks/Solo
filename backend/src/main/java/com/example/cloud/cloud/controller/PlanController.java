package com.example.cloud.cloud.controller;

import com.example.cloud.cloud.model.Plan;
import com.example.cloud.cloud.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.cloud.cloud.dto.PlanUpgradeRequestDto;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/plan") // Adjusted to match proxy rewrite
@CrossOrigin // For local development, consider more specific CORS configuration for production
public class PlanController {
    private final PlanService planService;

    @Autowired
    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPlan(@RequestBody Plan plan){
        return planService.createPlan(plan);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Plan>> getAllPlans(){
        return planService.getAllPlans();
    }

    @PostMapping("/me/upgrade") // Endpoint for user to upgrade their own plan
    public ResponseEntity<Map<String, String>> upgradeMyPlan(@RequestBody PlanUpgradeRequestDto upgradeRequest) {
        return planService.upgradeUserPlan(upgradeRequest);
    }
}
