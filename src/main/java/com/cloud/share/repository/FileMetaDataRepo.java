package com.cloud.share.repository;

import com.cloud.share.entity.FileMetaDataDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileMetaDataRepo  extends JpaRepository<FileMetaDataDocument,String> {

    List<FileMetaDataDocument> findByUsername(String email);

     Long countByUsername(String email);
}
