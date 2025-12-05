package com.example.cloud.auth.model;

import com.example.cloud.cloud.model.Plan;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
public class MyUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;

    @Column(unique = true)
    private String email;

    private String role;

    private boolean isBanned;

    @ManyToOne()
    @JoinColumn(name = "plan_id")
    private Plan plan;

    private Long usedStorageBytes = 0L; // Added used storage, initialized to 0
}
