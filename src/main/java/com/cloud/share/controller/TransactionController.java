package com.cloud.share.controller;


import com.cloud.share.entity.PaymentTransaction;
import com.cloud.share.repository.PaymentTransactionRepo;
import com.cloud.share.util.CommonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private PaymentTransactionRepo paymentTransactionRepo;



    @GetMapping
    public ResponseEntity<?> getUserTransactions(){
        String username = CommonUtil.getLoggedInUser().getEmail();

        List<PaymentTransaction> transactions = paymentTransactionRepo.findByUsernameAndStatusOrderByTransactionDateDesc(username, "SUCCESS");
        return ResponseEntity.ok().body(transactions);

    }


}
