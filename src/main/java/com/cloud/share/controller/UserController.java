package com.cloud.share.controller;


import com.cloud.share.dto.PasswordChangeRequest;
import com.cloud.share.dto.UserResponse;
import com.cloud.share.entity.User;
import com.cloud.share.service.UserService;
import com.cloud.share.util.CommonUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Tag(name="After Auth done",description = "Some User special need")
@RestController
@RequestMapping("/api/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        User user = CommonUtil.getLoggedInUser();
        UserResponse userResponse = mapper.map(user, UserResponse.class);
        return CommonUtil.createBuildResponse(userResponse, HttpStatus.OK);
    }

    @GetMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest passwordRequest) {
        userService.changePassword(passwordRequest);
        return CommonUtil.createBuildResponseMessage("Password Change Successfully", HttpStatus.OK);
    }

}
