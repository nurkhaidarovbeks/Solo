package com.example.cloud.cloud.model;

import com.example.cloud.auth.model.MyUser;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity

@Setter
@Getter
@NoArgsConstructor
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private Integer price;

    private Long storageLimitBytes; // Added storage limit

    public Plan(String name, String description, Integer price, Long storageLimitBytes) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.storageLimitBytes = storageLimitBytes;
    }

    @OneToMany(mappedBy = "plan")
    @JsonIgnore
    private List<MyUser> myUser;
}
