package com.example.cloud.cloud.service;

import com.example.cloud.auth.model.MyUser;
import com.example.cloud.auth.repository.MyUserRepository;
import com.example.cloud.auth.security.jwt.JwtUtil;
import com.example.cloud.cloud.model.Plan; // Import Plan
import com.example.cloud.cloud.util.AesFileUtil;
import com.example.cloud.cloud.util.UserStorageUtil;
import org.slf4j.Logger; // Import Logger
import org.slf4j.LoggerFactory; // Import LoggerFactory
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Path;

@Service
public class FileService {
    private final MyUserRepository myUserRepository;
    private final JwtUtil jwtUtil;

    private final UserStorageUtil userStorageUtil;

    private final AesFileUtil aesFileUtil;

    private static final Logger logger = LoggerFactory.getLogger(FileService.class);


    @Autowired
    public FileService(MyUserRepository myUserRepository, JwtUtil jwtUtil, UserStorageUtil userStorageUtil, AesFileUtil aesFileUtil) {
        this.myUserRepository = myUserRepository;
        this.jwtUtil = jwtUtil;
        this.userStorageUtil = userStorageUtil;
        this.aesFileUtil = aesFileUtil;
    }

    public void saveFile(MultipartFile fileToSave, String folderPath) {
        if (fileToSave == null) {
            throw new RuntimeException("File is null");
        }

        MyUser myUser = userStorageUtil.getCurrentUser();
        long fileSize = fileToSave.getSize();
        Plan userPlan = myUser.getPlan();

        if (userPlan == null) {
            throw new RuntimeException("User does not have a plan assigned.");
        }

        Long planStorageLimit = userPlan.getStorageLimitBytes();
        if (planStorageLimit == null) {
            logger.warn("Plan '{}' for user '{}' has null storageLimitBytes. Applying default.", userPlan.getName(), myUser.getUsername());
            // Apply default based on plan name, similar to MyUserService
            if ("FREE".equalsIgnoreCase(userPlan.getName())) {
                planStorageLimit = 5L * 1024 * 1024 * 1024; // 5 GB
            } else if ("PREMIUM".equalsIgnoreCase(userPlan.getName())) {
                planStorageLimit = 100L * 1024 * 1024 * 1024; // 100 GB
            } else {
                planStorageLimit = 0L; // Restrictive default for unknown plans or plans missing this value
                logger.error("Unknown plan '{}' or plan missing storage limit for user '{}'. Defaulting to 0 bytes.", userPlan.getName(), myUser.getUsername());
                // Consider throwing an exception here if a plan MUST have a limit and it's not FREE/PREMIUM
                // For now, defaulting to 0 will effectively block uploads for such misconfigured plans.
            }
        }
        
        Long currentUsedStorage = myUser.getUsedStorageBytes();
        if (currentUsedStorage == null) { // Should have been initialized by MyUser or MyUserService
            logger.warn("User '{}' has null usedStorageBytes. Defaulting to 0L for check.", myUser.getUsername());
            currentUsedStorage = 0L;
        }


        if (currentUsedStorage + fileSize > planStorageLimit) {
            throw new RuntimeException("Storage limit exceeded. Cannot upload file. Used: " + currentUsedStorage + ", File: " + fileSize + ", Limit: " + planStorageLimit);
        }

        Path userDirPath = userStorageUtil.getUserRootDir(myUser);
        Path folderWhereToSave = userStorageUtil.getFolderPath(userDirPath, folderPath);

        userStorageUtil.putFileInTheFolder(folderWhereToSave, fileToSave);

        // Update used storage
        myUser.setUsedStorageBytes(myUser.getUsedStorageBytes() + fileSize);
        myUserRepository.save(myUser);
    }

    public ResponseEntity<Resource> getDownloadFile(String folderPath) {
        if (folderPath == null) {
            throw new RuntimeException("File name is null");
        }

        MyUser myUser = userStorageUtil.getCurrentUser();

        Path userDirPath = userStorageUtil.getUserRootDir(myUser);
        Path encryptedFilePath = userStorageUtil.getFolderPath(userDirPath, folderPath);

        File encryptedFile = encryptedFilePath.toFile();

        if (!encryptedFile.exists()) {
            throw new RuntimeException("File does not exist");
        }
        if(encryptedFile.isDirectory()){
            throw new RuntimeException("File is a directory");
        }
        try {
            File tempDecryptedFile = File.createTempFile("decrypted_", "_" + encryptedFile.getName());
            aesFileUtil.decryptFile(encryptedFile, tempDecryptedFile);

            Resource fileResource = new InputStreamResource(new FileInputStream(tempDecryptedFile));

            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encryptedFile.getName() + "\"")
                .body(fileResource);
        } catch (Exception e) {
            throw new RuntimeException("Error while decrypting file for download", e);
        }
    }

    public ResponseEntity<String> changeFileName(String folderPath, String newFileName) {
        MyUser myUser = userStorageUtil.getCurrentUser();

        Path userDirPath = userStorageUtil.getUserRootDir(myUser);
        Path folderWhereFileIs = userStorageUtil.getFolderPath(userDirPath, folderPath);

        File oldFile = folderWhereFileIs.toFile();

        if (!oldFile.exists() || !oldFile.isFile()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
        }

        File parentDir = oldFile.getParentFile();

        File newFile = new File(parentDir, newFileName);

        if (newFile.exists()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("File with this name already exists");
        }

        boolean renamed = oldFile.renameTo(newFile);
        if (renamed) {
            return ResponseEntity.ok("File renamed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to rename file");
        }
    }

    public ResponseEntity<String> deleteFile(String filePath) {
        MyUser myUser = userStorageUtil.getCurrentUser();

        Path userDirPath = userStorageUtil.getUserRootDir(myUser);
        Path folderWhereFileIs = userStorageUtil.getFolderPath(userDirPath, filePath);

        File fileToDelete = folderWhereFileIs.toFile();

        if (!fileToDelete.exists() || !fileToDelete.isFile()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
        }

        long fileSize = fileToDelete.length(); // Get file size before deleting

        boolean deleted = fileToDelete.delete();
        if (deleted) {
            // Update used storage
            myUser.setUsedStorageBytes(Math.max(0, myUser.getUsedStorageBytes() - fileSize)); // Ensure it doesn't go below 0
            myUserRepository.save(myUser);
            return ResponseEntity.ok("File deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete file");
        }
    }
}
