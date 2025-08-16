package com.cloud.share.service;


import com.cloud.share.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;


public interface HomeService {

    Boolean verifyUserAccount(Integer uid, String token) throws ResourceNotFoundException;
}
