package com.example.cloud.cloud.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class FileFolderResponseDto {
    private List<FileResponseDto> files;
    private List<FolderResponseDto> folders;
}