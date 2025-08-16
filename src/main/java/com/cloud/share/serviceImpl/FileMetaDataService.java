package com.cloud.share.serviceImpl;

import com.cloud.share.dto.FileMetaDataDto;
import com.cloud.share.entity.FileMetaDataDocument;
import com.cloud.share.entity.User;
import com.cloud.share.exception.ResourceNotFoundException;
import com.cloud.share.exception.SuccessException;
import com.cloud.share.repository.FileMetaDataRepo;
import com.cloud.share.util.CommonUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FileMetaDataService {

    @Autowired
    private UserCreditsService userCreditsService;

    @Autowired
    private FileMetaDataRepo fileMetaDataRepo;

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private MinIOService minIOService;

    public List<FileMetaDataDto> uploadFiles(MultipartFile files[]) throws IOException {
        User user = CommonUtil.getLoggedInUser();

        if (!userCreditsService.hasEnoughCredits(files.length)) {
            throw new SuccessException("Not enough credits . Please purchase your credit first");
        }

        List<FileMetaDataDocument> savedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            // Upload to MinIO and get unique filename
            String uniqueFileName = minIOService.uploadFile(file);

            FileMetaDataDocument fileMetaData = FileMetaDataDocument.builder()
                    .uploadFileName(uniqueFileName)  // Unique filename in MinIO
                    .originalFileName(file.getOriginalFilename())  // Original filename for display
                    .fileLocation(uniqueFileName)  // MinIO object key (same as uploadFileName)
                    .size(file.getSize())
                    .type(file.getContentType())
                    .username(user.getEmail())
                    .isPublic(false)
                    .uploadAt(LocalDateTime.now())
                    .build();

            // decrease 1 credit for 1 file
            userCreditsService.consumeCredits();

            // save to database
            fileMetaDataRepo.save(fileMetaData);

            // add to response list
            savedFiles.add(fileMetaData);
        }

        return savedFiles.stream().map(f -> mapper.map(f, FileMetaDataDto.class)).toList();
    }

    public List<FileMetaDataDto> getFiles() {
        User user = CommonUtil.getLoggedInUser();

        List<FileMetaDataDocument> list = fileMetaDataRepo.findByUsername(user.getEmail());

        return list.stream().map(f -> mapper.map(f, FileMetaDataDto.class)).toList();
    }

    public FileMetaDataDto getPublicFile(String id) throws ResourceNotFoundException {
        Optional<FileMetaDataDocument> file = fileMetaDataRepo.findById(id);
        if (file.isEmpty() || !file.get().getIsPublic()) {
            throw new ResourceNotFoundException("Unable to get the file");
        }

        return mapper.map(file.get(), FileMetaDataDto.class);
    }

    public FileMetaDataDto getDownloadableFile(String id) throws ResourceNotFoundException {
        Optional<FileMetaDataDocument> file = fileMetaDataRepo.findById(id);
        if (file.isEmpty() || !file.get().getIsPublic()) {
            throw new ResourceNotFoundException("file not found");
        }

        return mapper.map(file.get(), FileMetaDataDto.class);
    }

    public void deleteFile(String id) throws Exception {
        try {
            User user = CommonUtil.getLoggedInUser();
            FileMetaDataDocument file = fileMetaDataRepo.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("file not found"));

            // only allowed if user owns the file
            if (!file.getUsername().equals(user.getEmail())) {
                throw new RuntimeException("Not your file only try to access yours");
            }

            // delete from MinIO storage
            minIOService.deleteFile(file.getUploadFileName());

            // delete from database
            fileMetaDataRepo.deleteById(id);

        } catch (Exception e) {
            throw new RuntimeException("Error while deleting file: " + e.getMessage());
        }
    }

    // change public <--> private
    public FileMetaDataDto togglePublic(String id) throws ResourceNotFoundException {
        FileMetaDataDocument file = fileMetaDataRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("file not found"));
        file.setIsPublic(!file.getIsPublic());
        FileMetaDataDocument save = fileMetaDataRepo.save(file);
        return mapper.map(save, FileMetaDataDto.class);
    }





    public FileMetaDataDto getDownloadableFileById(String id) throws ResourceNotFoundException {
        Optional<FileMetaDataDocument> fileOpt = fileMetaDataRepo.findById(id);
        if (fileOpt.isEmpty()) {
            throw new ResourceNotFoundException("File not found");
        }

        FileMetaDataDocument file = fileOpt.get();

        // Since download is public, allow anyone to download any file
        // If you want to restrict to public files only, uncomment the next lines:
    /*
    if (!file.getIsPublic()) {
        throw new ResourceNotFoundException("File is private and cannot be downloaded");
    }
    */

        return mapper.map(file, FileMetaDataDto.class);
    }
}