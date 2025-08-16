package com.cloud.share.repository;

import com.cloud.share.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentTransactionRepo extends JpaRepository<PaymentTransaction,String> {

    List<PaymentTransaction> findByUsername(String email);
    List<PaymentTransaction> findByUsernameOrderByTransactionDateDesc(String email);
    List<PaymentTransaction> findByUsernameAndStatusOrderByTransactionDateDesc(String email,String status);

}
