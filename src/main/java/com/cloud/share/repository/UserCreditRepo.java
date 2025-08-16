package com.cloud.share.repository;

import com.cloud.share.entity.UserCredit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserCreditRepo extends JpaRepository<UserCredit, Integer> {


    Optional<UserCredit> findByUsername(String username);


}
