package com.cloud.share.service;

import com.cloud.share.dto.PasswordChangeRequest;
import com.cloud.share.dto.PasswordResetRequest;
import com.cloud.share.exception.ResourceNotFoundException;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface UserService {

    public void changePassword(PasswordChangeRequest passwordRequest);


    void sendEmailPasswordReset(String email, String apiUrl) throws ResourceNotFoundException, MessagingException, UnsupportedEncodingException;

    void verifyPasswordResetLink(Integer uid, String token) throws ResourceNotFoundException;

    void resetPassword(PasswordResetRequest passwordResetRequest) throws ResourceNotFoundException;
}
