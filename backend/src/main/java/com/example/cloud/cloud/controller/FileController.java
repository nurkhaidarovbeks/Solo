package com.example.cloud.cloud.controller;

import com.example.cloud.cloud.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/cloud/file") // Corrected base path
@CrossOrigin
public class FileController {
    private final FileService fileService;

    @Autowired
    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    // Handles POST /cloud/file/create (for root directory)
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createFileInRoot(@RequestParam("file") MultipartFile file) {
        fileService.saveFile(file, ""); // Pass empty string for root path
        return new ResponseEntity<>("File created in root", HttpStatus.CREATED);
    }

    // Handles POST /cloud/file/create/path/to/folder
    @PostMapping(value = "/create/{*folderPath}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createFileInFolder(@RequestParam("file") MultipartFile file, @PathVariable("folderPath") String folderPath) {
        fileService.saveFile(file, folderPath);
        return new ResponseEntity<>("File created in folder", HttpStatus.CREATED);
    }

    // Adjusted download to also have a root and specific path version for consistency, if needed.
    // Or ensure {*folderPath} correctly handles empty for root if that's the desired single-endpoint behavior.
    // For now, assuming {*folderPath} in download, change, delete might work for root if it matches empty.
    // If not, similar root/specific path handlers would be needed.
    @GetMapping("/download/{*folderPath}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String folderPath) {
        return fileService.getDownloadFile(folderPath); // Download can often remain as PathVariable if it works
    }

    @PutMapping("/rename") // Changed from "/change" to "/rename"
    public ResponseEntity<String> changeFileName(@RequestParam String itemPath, @RequestParam String newFileName){
        return fileService.changeFileName(itemPath, newFileName);
    }

    @DeleteMapping("/delete") // PathVariable removed
    public ResponseEntity<String> deleteFile(@RequestParam String itemPath) {
        return fileService.deleteFile(itemPath);
    }
}
