package com.example.cloud.cheat;

import com.example.cloud.auth.model.MyUser;
import com.example.cloud.auth.repository.MyUserRepository;
import com.example.cloud.cloud.model.Plan;
import com.example.cloud.cloud.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cheat")
@CrossOrigin
public class Controller {

    private final MyUserRepository myUserRepository;
    private final PlanRepository planRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public Controller(MyUserRepository myUserRepository, PlanRepository planRepository, PasswordEncoder passwordEncoder) {
        this.myUserRepository = myUserRepository;
        this.planRepository = planRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/see-all-users")
    public List<MyUser> seeAllUsers(){
        return myUserRepository.findAll();
    }

    @PostMapping("/create-user-with-any-role")
    public void createUserWithAnyRole(@RequestBody MyUser myUser){
        myUser.setPassword(passwordEncoder.encode(myUser.getPassword()));
        myUserRepository.save(myUser);
    }

    @PostMapping("/create-plans-by-cheat")
    public void createPlansByCheat(@RequestBody Plan plan){
        planRepository.save(plan);
    }

    @GetMapping("/see-all-plans")
    public List<Plan> seeAllPlans(){
        return planRepository.findAll();
    }
}
