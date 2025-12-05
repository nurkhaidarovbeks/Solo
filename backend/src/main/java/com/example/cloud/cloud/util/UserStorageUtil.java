package com.example.cloud.cloud.util;

import com.example.cloud.auth.model.MyUser;
import com.example.cloud.auth.security.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class UserStorageUtil {
    // Path for Docker environment, matches docker-compose.yml volume
    private static final String STORAGE_PATH = "C:\\Users\\0penf\\storage_001";

    private final AesFileUtil aesFileUtil;

    @Autowired
    public UserStorageUtil(AesFileUtil aesFileUtil) {
        this.aesFileUtil = aesFileUtil;
    }

    public MyUser getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        return userDetails.getMyUser();
    }

    public Path getUserRootDir(MyUser user) {
        File userDir = new File(STORAGE_PATH + File.separator + user.getId());
        if (!userDir.exists()) {
            userDir.mkdirs();
        }
        return userDir.toPath().toAbsolutePath().normalize();
    }

    public Path getFolderPath(Path userDirPath, String relativePath) {
        Path folderPath = Paths.get(userDirPath.toString(), relativePath).toAbsolutePath().normalize();

        if (!folderPath.startsWith(userDirPath)) {
            throw new SecurityException("Access denied: File is not in the storage directory");
        }
        return folderPath;
    }

    public Path putFileInTheFolder(Path userDirPath, MultipartFile fileToSave) {
        Path fileToUploadPath = Paths.get(userDirPath.toString(),
            fileToSave.getOriginalFilename()).toAbsolutePath().normalize();

        if (!fileToUploadPath.startsWith(userDirPath)) {
            throw new SecurityException("Access denied: File is not in the storage directory");
        }
        File tempFile = null;
        try {
            tempFile = File.createTempFile("upload", ".tmp");

            try (InputStream in = fileToSave.getInputStream();
                 OutputStream out = new FileOutputStream(tempFile)) {
                in.transferTo(out);
            }

            aesFileUtil.encryptFile(tempFile, fileToUploadPath.toFile());

            return fileToUploadPath;
        } catch (Exception e) {
            throw new RuntimeException("Error while encrypting file", e);
        } finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }
}
