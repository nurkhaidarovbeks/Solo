package com.example.cloud.cloud.controller;

import com.example.cloud.cloud.dto.FileFolderResponseDto;
import com.example.cloud.cloud.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional; // Import Optional

@RestController
@RequestMapping("/cloud/folder") // Corrected base path
@CrossOrigin
public class FolderController {
    private final FolderService folderService;

    @Autowired
    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    // Handles /cloud/folder/create/path/to/folder
    // And /cloud/folder/create (if folderPath can be empty, though typically create needs a name)
    @PostMapping("/create/{*folderPath}")
    public ResponseEntity<Map<String, String>> createFolder(@PathVariable("folderPath") String folderPath) {
        return folderService.createFolder(folderPath);
    }

    // Specific handler for GET /cloud/folder/view (root)
    @GetMapping("/view")
    public ResponseEntity<FileFolderResponseDto> viewRootFolder() {
        return folderService.viewFolder(""); // Pass empty string to service for root
    }

    // Handler for GET /cloud/folder/view/path/to/folder
    // Using {*folderPath} to capture multiple segments
    @GetMapping("/view/{*folderPath}")
    public ResponseEntity<FileFolderResponseDto> viewSpecificFolder(@PathVariable String folderPath) {
        return folderService.viewFolder(folderPath);
    }

    // It's generally better to use @PutMapping for rename if it's idempotent
    @PutMapping("/rename") // PathVariable removed
    public ResponseEntity<String> renameFolder(@RequestParam String itemPath, @RequestParam String newFolderName){
        return folderService.renameFolder(itemPath, newFolderName);
    }

    @DeleteMapping("/delete") // PathVariable removed
    public ResponseEntity<String> deleteFolder(@RequestParam String itemPath){
        return folderService.deleteFolder(itemPath);
    }
}
