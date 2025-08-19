package com.cloud.share.controller;

import com.cloud.share.dto.UserCreditsDto;
import com.cloud.share.entity.UserCredit;
import com.cloud.share.serviceImpl.UserCreditsService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.endpoint.web.AdditionalPathsMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserCreditController {

    @Autowired
    private UserCreditsService userCreditsService;
    @Autowired
    private AdditionalPathsMapper additionalPathsMapper;

    @Autowired
    private ModelMapper mapper;


    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits(){
        UserCreditsDto userCredit=mapper.map(userCreditsService.getUserCredit(),UserCreditsDto.class);
        return ResponseEntity.ok(userCredit);
    }

}
