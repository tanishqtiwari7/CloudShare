package com.cloud.share.util;


import com.cloud.share.dto.UserRequest;
import com.cloud.share.exception.ExistDataException;
import com.cloud.share.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class Validation {

    @Autowired
    private UserRepo userRepo;


    public void userValidation(UserRequest userRequest) {

        // name validate
        if (!StringUtils.hasText(userRequest.getName())) {
            throw new IllegalArgumentException(" name is invalid");
        }


        if (!StringUtils.hasText(userRequest.getEmail()) || !userRequest.getEmail().matches(Constants.EMAIL_REGEX)) {
            throw new IllegalArgumentException("email is invalid");
        } else {
            // validate email exist
            Boolean existEmail = userRepo.existsByEmail(userRequest.getEmail());
            if (existEmail) {
                throw new ExistDataException("Email already exist");
            }
        }
    }
}
