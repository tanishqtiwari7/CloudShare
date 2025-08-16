package com.cloud.share.service;

import com.cloud.share.entity.User;
import org.springframework.security.core.userdetails.UserDetails;


public interface JwtService {

    String generateToken(User user);

    String extractUsername(String token);

    Boolean validateToken(String token, UserDetails userDetails);

    public String extractRole(String token);
}
