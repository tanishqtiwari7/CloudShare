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

    private String name;

    private String type;

    private Long size;

    private String username;

    private Boolean isPublic;

    private String fileLocation;

    private LocalDateTime uploadAt;

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }

}
