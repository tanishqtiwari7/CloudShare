package com.cloud.share.repository;

import com.cloud.share.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Integer> {
    Boolean existsByEmail(String email);

    User findByEmail(String username);
}
