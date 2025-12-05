package com.example.cloud.admin.service;

import com.example.cloud.auth.model.MyUser;
import com.example.cloud.auth.repository.MyUserRepository;
import com.example.cloud.cloud.model.Plan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {
    private final MyUserRepository myUserRepository;

    @Autowired
    public AdminService(MyUserRepository myUserRepository) {
        this.myUserRepository = myUserRepository;
    }

    @Transactional
    public ResponseEntity<String> banUser(String username) {
        MyUser myUser = myUserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        if(myUser.getRole().equals("ROLE_ADMIN") || myUser.getRole().equals("ROLE_SUPER_ADMIN")){
            return new ResponseEntity<>("You can't ban admin", HttpStatus.CONFLICT);
        }
        if(myUser.isBanned()){
            return new ResponseEntity<>("User is already banned", HttpStatus.CONFLICT);
        }
        myUser.setBanned(true);
        return new ResponseEntity<>("User banned", HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<String> unbanUser(String username) {
        MyUser myUser = myUserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        if(myUser.getRole().equals("ROLE_ADMIN") || myUser.getRole().equals("ROLE_SUPER_ADMIN")){
            return new ResponseEntity<>("You can't unban admin", HttpStatus.CONFLICT);
        }
        if(!myUser.isBanned()){
            return new ResponseEntity<>("User is not banned", HttpStatus.CONFLICT);
        }
        myUser.setBanned(false);
        return new ResponseEntity<>("User unbanned", HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<String> changePlan(String username, Plan plan) {
        MyUser myUser = myUserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        myUser.setPlan(plan);
        return new ResponseEntity<>("Plan changed", HttpStatus.OK);
    }
}
