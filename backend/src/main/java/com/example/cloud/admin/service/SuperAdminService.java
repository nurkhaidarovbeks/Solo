package com.example.cloud.admin.service;

import com.example.cloud.auth.model.MyUser;
import com.example.cloud.auth.repository.MyUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class SuperAdminService {
    private final MyUserRepository myUserRepository;

    @Autowired
    public SuperAdminService(MyUserRepository myUserRepository) {
        this.myUserRepository = myUserRepository;
    }

    @Transactional
    public ResponseEntity<String> promoteToAdmin(String username) {
        MyUser myUser = myUserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        if (myUser.getRole().equals("ROLE_USER")) {
            myUser.setRole("ROLE_ADMIN");
            return new ResponseEntity<>("Promoted to Admin", HttpStatus.OK);
        }else {
            return new ResponseEntity<>("User is already admin", HttpStatus.CONFLICT);
        }
    }

    public ResponseEntity<String> demoteToUser(String username) {
        MyUser myUser = myUserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        if (myUser.getRole().equals("ROLE_ADMIN")) {
            myUser.setRole("ROLE_USER");
            return new ResponseEntity<>("Demoted to User", HttpStatus.OK);
        }else {
            return new ResponseEntity<>("User is already user", HttpStatus.CONFLICT);
        }
    }
}
