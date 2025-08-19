package com.cloud.share.controller;

import com.cloud.share.dto.FileMetaDataDto;
import com.cloud.share.exception.ResourceNotFoundException;
import com.cloud.share.serviceImpl.FileMetaDataService;
import com.cloud.share.serviceImpl.MinIOService;
import com.cloud.share.serviceImpl.UserCreditsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/files")
public class FileController {

    @Autowired
    private FileMetaDataService fileMetaDataService;

    @Autowired
    private UserCreditsService userCreditsService;

    @Autowired
    private MinIOService minIOService;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile[] files) throws IOException {

        List<FileMetaDataDto> list = fileMetaDataService.uploadFiles(files);

        Map<String, Object> response = new HashMap<>();
        response.put("files", list);
        response.put("remainingCredits", userCreditsService.getUserCredit());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getFilesForCurrentUser() {
        List<FileMetaDataDto> files = fileMetaDataService.getFiles();

        Map<String, Object> response = new HashMap<>();
        response.put("files", files);
        response.put("remainingCredits", userCreditsService.getUserCredit());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<?> getPublicFile(@PathVariable String id) throws ResourceNotFoundException {
        FileMetaDataDto file = fileMetaDataService.getPublicFile(id);
        return new ResponseEntity<>(file, HttpStatus.OK);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable String id) throws ResourceNotFoundException {
        try {
            // This method handles both public files and files owned by current user
            FileMetaDataDto file = fileMetaDataService.getDownloadableFileById(id);

            // Get file stream from MinIO
            InputStream inputStream = minIOService.downloadFile(file.getUploadFileName());
            InputStreamResource resource = new InputStreamResource(inputStream);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(file.getSize())
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + file.getOriginalFileName() + "\"")
                    .body(resource);

        } catch (Exception e) {
            throw new ResourceNotFoundException("Error downloading file: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable String id) throws Exception {
        fileMetaDataService.deleteFile(id);
        return new ResponseEntity<>("Deleted Successfully", HttpStatus.OK);
    }

    @PatchMapping("/{id}/toggle-public")
    public ResponseEntity<?> togglePublic(@PathVariable String id) throws ResourceNotFoundException {
        FileMetaDataDto fileMetaDataDto = fileMetaDataService.togglePublic(id);
        return new ResponseEntity<>(fileMetaDataDto, HttpStatus.OK);
    }

    // Optional: Add endpoint to get direct download URL
    @GetMapping("/url/{id}")
    public ResponseEntity<?> getFileUrl(@PathVariable String id) throws ResourceNotFoundException {
        try {
            FileMetaDataDto file = fileMetaDataService.getPublicFile(id);
            String downloadUrl = minIOService.getFileUrl(file.getUploadFileName());

            Map<String, Object> response = new HashMap<>();
            response.put("downloadUrl", downloadUrl);
            response.put("fileName", file.getOriginalFileName());
            response.put("expiresIn", "24 hours");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error generating file URL: " + e.getMessage());
        }
    }
}