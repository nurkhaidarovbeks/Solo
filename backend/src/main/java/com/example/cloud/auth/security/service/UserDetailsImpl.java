package com.example.cloud.auth.security.service;

import com.example.cloud.auth.model.MyUser;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserDetailsImpl implements UserDetails {
    @Getter
    private MyUser myUser;
    private String username;
    private String password;

    public UserDetailsImpl(MyUser myUser){
        this.username = myUser.getUsername();
        this.password = myUser.getPassword();
        this.myUser = myUser;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !myUser.isBanned();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(this.myUser.getRole()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }
}
