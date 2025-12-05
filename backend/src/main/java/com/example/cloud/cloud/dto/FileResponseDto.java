package com.example.cloud.cloud.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class FileResponseDto {
    private String name;
    private boolean isFolder;
    private long size;
}