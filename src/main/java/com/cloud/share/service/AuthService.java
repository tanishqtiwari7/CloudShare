package com.cloud.share.service;

import com.cloud.share.dto.LoginRequest;
import com.cloud.share.dto.LoginResponse;
import com.cloud.share.dto.UserRequest;
import com.cloud.share.exception.ResourceNotFoundException;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface AuthService {

    public Boolean register(UserRequest userRequest, String url) throws ResourceNotFoundException, MessagingException, UnsupportedEncodingException;

    public LoginResponse login(LoginRequest request);


}
