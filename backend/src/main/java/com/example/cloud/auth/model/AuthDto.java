package com.example.cloud.auth.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthDto {
    @NotBlank(message = "Username should be not empty")
    @Size(min = 4, max = 30, message = "Username should have at least 3 characters and at most 30")
    private String username;
    @NotBlank(message = "Password should not be empty")
    @Size(min = 8, max = 50, message = "Password should have at least 8 characters and at most 50")
    private String password;

    @NotBlank(message = "Email should not be empty")
    @Email(message = "Incorrect email")
    private String email;
}
