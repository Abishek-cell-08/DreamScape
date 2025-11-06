package com.dreamscape.backend.controller;

import com.dreamscape.backend.model.User;
import com.dreamscape.backend.repository.UserRepository;
import com.dreamscape.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody User user) {
        String token = authService.registerUser(user);
        return Map.of(
                "token", token,
                "user", user
        );
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String token = authService.loginUser(email, password);
        Optional<User> user = userRepository.findByEmail(email);
        return Map.of(
                "token", token,
                "user", user.orElse(null)
        );
    }
}
