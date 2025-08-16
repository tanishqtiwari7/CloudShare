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

    private String name;

    private String type;

    private Long size;

    private String username;

    private Boolean isPublic;

    private String fileLocation;

    private LocalDateTime uploadAt;

}
