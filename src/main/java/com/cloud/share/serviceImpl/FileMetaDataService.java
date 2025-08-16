package com.cloud.share.serviceImpl;


import com.cloud.share.dto.FileMetaDataDto;
import com.cloud.share.entity.FileMetaDataDocument;
import com.cloud.share.entity.User;
import com.cloud.share.exception.ResourceNotFoundException;
import com.cloud.share.exception.SuccessException;
import com.cloud.share.exception.ValidationException;
import com.cloud.share.repository.FileMetaDataRepo;
import com.cloud.share.util.CommonUtil;
import org.apache.commons.lang3.ObjectUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileMetaDataService {


    @Autowired
    private UserCreditsService userCreditsService;

    @Autowired
    private FileMetaDataRepo fileMetaDataRepo;

    @Autowired
    private ModelMapper mapper;



    public List<FileMetaDataDto> uploadFiles(MultipartFile files[]) throws IOException {
        User user = CommonUtil.getLoggedInUser();

        if(!userCreditsService.hasEnoughCredits(files.length)){
            throw  new SuccessException("Not enough credits . Please purchase your credit first");
        }

        List<FileMetaDataDocument>  savedFiles  = new ArrayList<>();


        Path uploadPath =Paths.get("upload").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        for (MultipartFile file : files) {
          String fileName =   UUID.randomUUID()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
          Path targetLocation =uploadPath.resolve(fileName);
          Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

          FileMetaDataDocument fileMetaData =FileMetaDataDocument.builder()
                  .fileLocation(targetLocation.toString())
                  .name(file.getOriginalFilename())
                  .size(file.getSize())
                  .type(file.getContentType())
                  .username(user.getEmail())
                  .isPublic(false)
                  .uploadAt(LocalDateTime.now())
                  .build();

          // decrease 1 credit for 1 file
            userCreditsService.consumeCredits();


            // add in list for send again
            fileMetaDataRepo.save(fileMetaData);

            // save each file
            savedFiles.add(fileMetaData);
        }

       return savedFiles.stream().map(f -> mapper.map(f, FileMetaDataDto.class) ).toList();
    }


    public List<FileMetaDataDto> getFiles() {
        User user = CommonUtil.getLoggedInUser();

        List<FileMetaDataDocument> list = fileMetaDataRepo.findByUsername(user.getEmail());

        return list.stream().map(f -> mapper.map(f, FileMetaDataDto.class) ).toList();
    }

    public FileMetaDataDto getPublicFile(String id) throws ResourceNotFoundException {
        Optional<FileMetaDataDocument> file = fileMetaDataRepo.findById(id);
        if(file.isEmpty() || !file.get().getIsPublic()){
            throw new ResourceNotFoundException("Unable to get the file");
        }

        return mapper.map(file.get(), FileMetaDataDto.class);
    }

    public FileMetaDataDto getDownloadableFile(String id) throws ResourceNotFoundException {
        Optional<FileMetaDataDocument> file = fileMetaDataRepo.findById(id);
        if(file.isEmpty() || !file.get().getIsPublic()){
            throw new ResourceNotFoundException("file not found");
        }

        return mapper.map(file.get(), FileMetaDataDto.class);

    }


    public void deleteFile(String id) throws Exception {
       try{
           User user = CommonUtil.getLoggedInUser();
           FileMetaDataDocument file = fileMetaDataRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("file not found"));


           // only allowed if user own the file
           if(!file.getUsername().equals(user.getEmail())){
               throw new RuntimeException("Not your file only try to access yuors");
           }

           // now delete from storage
           Path path= Paths.get(file.getFileLocation());
            Files.deleteIfExists(path);


            // delete from database
           fileMetaDataRepo.deleteById(id);
           // done


       } catch (Exception e) {
           throw new RuntimeException("Error while deleting file");
       }


    }



    // change public <--> private
    public FileMetaDataDto togglePublic(String id) throws ResourceNotFoundException {
        FileMetaDataDocument file = fileMetaDataRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("file not found"));
        file.setIsPublic(!file.getIsPublic());
        FileMetaDataDocument save = fileMetaDataRepo.save(file);
        return mapper.map(save, FileMetaDataDto.class);
    }


}
