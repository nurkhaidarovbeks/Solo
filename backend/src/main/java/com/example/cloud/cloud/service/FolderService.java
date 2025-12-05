package com.example.cloud.cloud.service;

import com.example.cloud.auth.model.MyUser;
import com.example.cloud.cloud.dto.FileFolderResponseDto;
import com.example.cloud.cloud.dto.FileResponseDto;
import com.example.cloud.cloud.dto.FolderResponseDto;
import com.example.cloud.cloud.util.UserStorageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException; // Import IOException
import java.nio.file.Files; // Import Files
import java.nio.file.Path;
import java.nio.file.StandardCopyOption; // Import StandardCopyOption
import java.util.*;

@Service
public class FolderService {
    private final UserStorageUtil userStorageUtil;

    @Autowired
    public FolderService(UserStorageUtil userStorageUtil) {
        this.userStorageUtil = userStorageUtil;
    }

    public ResponseEntity<Map<String, String>> createFolder(String folderPath) {
        MyUser myUser = userStorageUtil.getCurrentUser();

        Path userDirPath = userStorageUtil.getUserRootDir(myUser);
        Path foldersToCreate = userStorageUtil.getFolderPath(userDirPath, folderPath);

        File targetFolder = foldersToCreate.toFile();

        if (targetFolder.exists()) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Folder already exists"));
        }

        boolean created = targetFolder.mkdirs();
        if (created) {
            return new ResponseEntity<>(Map.of("message", "Folder created"), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(Map.of("message", "Failed to create folder"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<FileFolderResponseDto> viewFolder(String folderPath) {
        MyUser myUser = userStorageUtil.getCurrentUser();

        Path userDirPath = userStorageUtil.getUserRootDir(myUser);
        Path targetPath = userStorageUtil.getFolderPath(userDirPath, folderPath);

        if (!targetPath.toFile().exists() || !targetPath.toFile().isDirectory()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        File[] filesAndFolders = targetPath.toFile().listFiles();
        if (filesAndFolders == null || filesAndFolders.length == 0) {
            return ResponseEntity.ok(new FileFolderResponseDto(Collections.emptyList(), Collections.emptyList()));
        }

        List<FileResponseDto> files = new ArrayList<>();
        List<FolderResponseDto> folders = new ArrayList<>();

        for (File file : filesAndFolders) {
            if (file.isDirectory()) {
                folders.add(new FolderResponseDto(file.getName()));
            } else {
                files.add(new FileResponseDto(file.getName(), false, file.length()));
            }
        }
        return ResponseEntity.ok(new FileFolderResponseDto(files, folders));
    }

    public ResponseEntity<String> renameFolder(String folderPath, String newFolderName) {
        MyUser myUser = userStorageUtil.getCurrentUser();
        Path userDirPath = userStorageUtil.getUserRootDir(myUser);
        Path oldFolderPath = userStorageUtil.getFolderPath(userDirPath, folderPath);
        File oldFolderFile = oldFolderPath.toFile();

        if (!oldFolderFile.exists() || !oldFolderFile.isDirectory()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found");
        }

        // Construct the new path using Path objects for consistency
        Path parentDirPath = oldFolderPath.getParent();
        if (parentDirPath == null) {
            // Should not happen if oldFolderPath is valid and within userDirPath
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cannot determine parent directory.");
        }
        Path newFolderPath = parentDirPath.resolve(newFolderName).normalize();

        // Security check: ensure new path is still within user's root directory
        if (!newFolderPath.startsWith(userDirPath)) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid new folder name or path.");
        }
        
        File newFolderFile = newFolderPath.toFile();

        if (newFolderFile.exists()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("A file or folder with the new name already exists.");
        }

        try {
            Files.move(oldFolderPath, newFolderPath, StandardCopyOption.REPLACE_EXISTING);
            return ResponseEntity.ok("Folder renamed successfully");
        } catch (IOException e) {
            // Log the exception e.g., using SLF4J logger
            // logger.error("Error renaming folder {} to {}:", folderPath, newFolderName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to rename folder: " + e.getMessage());
        }
    }

    public ResponseEntity<String> deleteFolder(String folderPath) {
        MyUser myUser = userStorageUtil.getCurrentUser();
        Path userDirPath = userStorageUtil.getUserRootDir(myUser);
        Path actualFolderPath = userStorageUtil.getFolderPath(userDirPath, folderPath);
        File folderToDelete = actualFolderPath.toFile();

        if (!folderToDelete.exists() || !folderToDelete.isDirectory()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found");
        }

        try {
            boolean deleted = deleteRecursively(folderToDelete);
            if (deleted) {
                return ResponseEntity.ok("Folder deleted successfully");
            } else {
                // This case might be hard to reach if deleteRecursively throws exceptions on failure
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete folder or some of its contents.");
            }
        } catch (IOException e) {
            // Log the exception e.g., using SLF4J logger
            // logger.error("Error deleting folder: {}", folderPath, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting folder: " + e.getMessage());
        }
    }

    private boolean deleteRecursively(File fileOrDir) throws IOException {
        if (fileOrDir.isDirectory()) {
            File[] children = fileOrDir.listFiles();
            if (children != null) {
                for (File child : children) {
                    if (!deleteRecursively(child)) {
                        return false; // Stop if a child couldn't be deleted
                    }
                }
            }
        }
        // Delete the file or now-empty directory
        if (!fileOrDir.delete()) {
            // Optional: throw an IOException if a file/empty dir can't be deleted
            // throw new IOException("Failed to delete " + fileOrDir.getAbsolutePath());
            return false; // Indicate failure
        }
        return true;
    }
}
