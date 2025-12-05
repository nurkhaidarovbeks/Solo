package com.example.cloud.auth.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserStatsResponseDto {
    private long totalFiles;
    private long totalFolders;
    private long usedStorageBytes;
    private long planStorageLimitBytes;
    private String planName;
}
