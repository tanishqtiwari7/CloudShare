package com.cloud.share.controller;


import com.cloud.share.dto.FileMetaDataDto;
import com.cloud.share.exception.ResourceNotFoundException;
import com.cloud.share.serviceImpl.FileMetaDataService;
import com.cloud.share.serviceImpl.UserCreditsService;
import com.cloud.share.util.CommonUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
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
    public ResponseEntity<Resource> download(@PathVariable String id) throws ResourceNotFoundException, MalformedURLException {
        FileMetaDataDto file = fileMetaDataService.getDownloadableFile(id);

        Path path = Paths.get(file.getFileLocation());

        Resource resource = new UrlResource(path.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable String id) throws Exception {
        fileMetaDataService.deleteFile(id);
        return new ResponseEntity<>("Deleted Successfully", HttpStatus.OK);
    }


    @PatchMapping("/{id}/toggle-public")
    public ResponseEntity<?> togglePublic(@PathVariable String id) throws ResourceNotFoundException {
      FileMetaDataDto fileMetaDataDto =  fileMetaDataService.togglePublic(id);
      return new ResponseEntity<>(fileMetaDataDto, HttpStatus.OK);
    }
}
