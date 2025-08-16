package com.cloud.share.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String email;

    private String password;

    private Integer credits;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)  //sath mai save ho jaye
    @JoinColumn(name = "status_id")
    private AccountStatus status;

}
