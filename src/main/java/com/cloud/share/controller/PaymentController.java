package com.cloud.share.controller;


import com.cloud.share.dto.PaymentDto;
import com.cloud.share.dto.PaymentVerificationDto;
import com.cloud.share.dto.UserCreditsDto;
import com.cloud.share.serviceImpl.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    @PostMapping("/create-order")
    public ResponseEntity<?>  createOrder(@RequestBody PaymentDto paymentDto){
        PaymentDto response = paymentService.createOrder(paymentDto);
        if(response.getSuccess()){
            return ResponseEntity.ok().body(response);
        }
        return ResponseEntity.badRequest().body(response);
    }


    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationDto request){
        // service

        PaymentDto paymentDto = paymentService.verifyPayment(request);
        if(paymentDto.getSuccess()){
            return ResponseEntity.ok().body(paymentDto);
        }
        return ResponseEntity.badRequest().body(paymentDto);
    }
}
