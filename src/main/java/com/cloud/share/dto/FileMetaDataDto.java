package com.cloud.share.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileMetaDataDto {

    String id;

    private String uploadFileName;  // Unique filename in MinIO

    private String originalFileName;  // Original filename for display

    private String type;

    private Long size;

    private String username;

    private Boolean isPublic;

    private String fileLocation;  // MinIO object key

    private LocalDateTime uploadAt;

    // Helper method to get display name (using originalFileName)
    public String getDisplayName() {
        return originalFileName;
    }
}