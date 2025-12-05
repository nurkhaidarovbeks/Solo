package com.example.cloud.auth.service;

import com.example.cloud.auth.model.AuthDto;
import com.example.cloud.auth.model.LoginRequestDto; // Import LoginRequestDto
import com.example.cloud.auth.model.MyUser;
import com.example.cloud.auth.repository.MyUserRepository;
import com.example.cloud.auth.security.jwt.JwtUtil;
import com.example.cloud.cloud.model.Plan;
import com.example.cloud.cloud.repository.PlanRepository;
import com.example.cloud.cloud.service.PlanService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import com.example.cloud.cloud.util.UserStorageUtil;
import com.example.cloud.auth.model.UserStatsResponseDto;


@Service
public class MyUserService {
    private final MyUserRepository myUserRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;
    private final PlanRepository planRepository;
    private final UserStorageUtil userStorageUtil; // Added UserStorageUtil

    private final PlanService planService;
    @Autowired
    public MyUserService(MyUserRepository myUserRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, ModelMapper modelMapper, PlanRepository planRepository, PlanService planService, UserStorageUtil userStorageUtil) {
        this.myUserRepository = myUserRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.modelMapper = modelMapper;
        this.planRepository = planRepository;
        this.planService = planService;
        this.userStorageUtil = userStorageUtil; // Initialize UserStorageUtil
    }

    @Transactional
    public ResponseEntity<String> registration(AuthDto authDto) {
        MyUser myUser = new MyUser();
        modelMapper.map(authDto, myUser);
        myUser.setPassword(passwordEncoder.encode(authDto.getPassword()));
        myUser.setRole("ROLE_USER");
        myUser.setUsedStorageBytes(0L); // Initialize used storage

        // Define plan storage limits (e.g., FREE: 5GB, PREMIUM: 100GB)
        long freePlanStorageLimit = 5L * 1024 * 1024 * 1024; // 5 GB
        long premiumPlanStorageLimit = 100L * 1024 * 1024 * 1024; // 100 GB

        if(planRepository.findByName("FREE").isEmpty()){
            planRepository.save(new Plan("FREE", "Free plan with 5GB storage", 0, freePlanStorageLimit));
        }
        if(planRepository.findByName("PREMIUM").isEmpty()){
            planRepository.save(new Plan("PREMIUM", "Premium plan with 100GB storage", 1000, premiumPlanStorageLimit)); // Price in cents, e.g., $10.00
        }
        planRepository.flush();


        Plan freePlan = planRepository.findByName("FREE").orElseThrow(() -> new RuntimeException("FREE Plan not found, this should not happen"));
        myUser.setPlan(freePlan);
        myUser.setBanned(false);
        myUserRepository.save(myUser);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    public ResponseEntity<Map<String, String>> login(LoginRequestDto loginRequestDto){ // Use LoginRequestDto
        UsernamePasswordAuthenticationToken authenticationToken =
            new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword());
        Map<String, String> map = new HashMap<>();
        try {
            authenticationManager.authenticate(authenticationToken);
        }catch (Exception e){
            map.put("message", "Incorrect credentials");
            return new ResponseEntity<>(map, HttpStatus.FORBIDDEN);
        }
        String token = jwtUtil.generateJwtToken(loginRequestDto.getUsername());
        map.put("jwt token", token);
        return new ResponseEntity<>(map, HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<UserStatsResponseDto> getUserStats() {
        MyUser currentUser = userStorageUtil.getCurrentUser();
        if (currentUser == null || currentUser.getPlan() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or throw an exception
        }

        Path userRootDir = userStorageUtil.getUserRootDir(currentUser);
        FileCounts counts = countFilesAndFolders(userRootDir.toFile());

        Long usedStorage = currentUser.getUsedStorageBytes();
        if (usedStorage == null) {
            usedStorage = 0L; // Default to 0 if null from DB (for older users)
            // Optionally, you might want to save the user here to persist this default if it's a one-time fix
            // currentUser.setUsedStorageBytes(usedStorage);
            // myUserRepository.save(currentUser); // This would make it a read-write transaction
        }

        Long planStorageLimit = currentUser.getPlan().getStorageLimitBytes();
        if (planStorageLimit == null) {
            // This might happen if the plan was in DB before the field was added.
            // Default to a sensible value, e.g., 0 or a predefined minimum.
            // For a FREE plan, we defined 5GB. If it's another plan, this might need more sophisticated handling
            // or a data migration script. For now, let's assume if it's null, it's an old FREE plan.
            if ("FREE".equalsIgnoreCase(currentUser.getPlan().getName())) {
                planStorageLimit = 5L * 1024 * 1024 * 1024; // 5 GB
            } else {
                planStorageLimit = 0L; // Fallback for other plans if limit is missing
            }
        }

        UserStatsResponseDto statsDto = new UserStatsResponseDto(
                counts.fileCount,
                counts.folderCount,
                usedStorage, // Use the potentially defaulted value
                planStorageLimit, // Use the potentially defaulted value
                currentUser.getPlan().getName()
        );
        return ResponseEntity.ok(statsDto);
    }

    private FileCounts countFilesAndFolders(File directory) {
        long fileCount = 0;
        long folderCount = 0;
        if (directory.exists() && directory.isDirectory()) {
            for (File file : Objects.requireNonNull(directory.listFiles())) {
                if (file.isFile()) {
                    fileCount++;
                } else if (file.isDirectory()) {
                    folderCount++;
                    FileCounts subCounts = countFilesAndFolders(file);
                    fileCount += subCounts.fileCount;
                    folderCount += subCounts.folderCount;
                }
            }
        }
        return new FileCounts(fileCount, folderCount);
    }

    private static class FileCounts {
        long fileCount;
        long folderCount;

        FileCounts(long fileCount, long folderCount) {
            this.fileCount = fileCount;
            this.folderCount = folderCount;
        }
    }
}
