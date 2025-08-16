package com.cloud.share.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class FileMetaDataDocument {

    @Id
    private String id;

    private String uploadFileName;  // Unique filename stored in MinIO

    private String originalFileName;  // Original filename for display

    private String type;

    private Long size;

    private String username;

    private Boolean isPublic;

    private String fileLocation;  // This will now store the MinIO object key/path

    private LocalDateTime uploadAt;

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}