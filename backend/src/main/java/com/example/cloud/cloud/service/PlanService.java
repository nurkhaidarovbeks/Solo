package com.example.cloud.cloud.service;

import com.example.cloud.cloud.model.Plan;
import com.example.cloud.cloud.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.cloud.auth.model.MyUser;
import com.example.cloud.auth.repository.MyUserRepository;
import com.example.cloud.cloud.util.UserStorageUtil;
import com.example.cloud.cloud.dto.PlanUpgradeRequestDto;


import java.util.List;
import java.util.Map;

@Service
public class PlanService {
    private final PlanRepository planRepository;
    private final MyUserRepository myUserRepository;
    private final UserStorageUtil userStorageUtil;


    @Autowired
    public PlanService(PlanRepository planRepository, MyUserRepository myUserRepository, UserStorageUtil userStorageUtil) {
        this.planRepository = planRepository;
        this.myUserRepository = myUserRepository;
        this.userStorageUtil = userStorageUtil;
    }

    @Transactional
    public ResponseEntity<Map<String, String>> createPlan(Plan plan) {
        // Ensure storageLimitBytes is set if not provided, or handle as an error
        if (plan.getStorageLimitBytes() == null) {
            // Default to a sensible value or throw an error if it's required
            plan.setStorageLimitBytes(5L * 1024 * 1024 * 1024); // Example: 5GB default
        }
        planRepository.save(plan);
        return new ResponseEntity<>(Map.of("message", "Plan created"), HttpStatus.CREATED);
    }

    public ResponseEntity<List<Plan>> getAllPlans() {
        return new ResponseEntity<>(planRepository.findAll(), HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<Map<String, String>> upgradeUserPlan(PlanUpgradeRequestDto upgradeRequest) {
        MyUser currentUser = userStorageUtil.getCurrentUser();
        if (currentUser == null) {
            return new ResponseEntity<>(Map.of("error", "User not authenticated"), HttpStatus.UNAUTHORIZED);
        }

        Plan targetPlan = planRepository.findByName(upgradeRequest.getPlanName())
                .orElse(null);

        if (targetPlan == null) {
            return new ResponseEntity<>(Map.of("error", "Target plan not found: " + upgradeRequest.getPlanName()), HttpStatus.NOT_FOUND);
        }

        // Basic check: prevent "upgrading" to the same plan or a "lower" tier if logic existed
        if (currentUser.getPlan() != null && currentUser.getPlan().getName().equals(targetPlan.getName())) {
             return new ResponseEntity<>(Map.of("message", "User is already on this plan"), HttpStatus.OK);
        }
        
        // More sophisticated checks could be added here (e.g., payment verification)

        currentUser.setPlan(targetPlan);
        myUserRepository.save(currentUser);

        return new ResponseEntity<>(Map.of("message", "User plan upgraded successfully to " + targetPlan.getName()), HttpStatus.OK);
    }
}
