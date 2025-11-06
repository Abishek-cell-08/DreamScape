package com.dreamscape.backend.service;

import com.dreamscape.backend.model.User;
import com.dreamscape.backend.repository.UserRepository;
import com.dreamscape.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists!");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
        return jwtUtil.generateToken(user.getEmail());
    }

    public String loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !encoder.matches(password, userOpt.get().getPassword())) {
            throw new RuntimeException("Invalid credentials!");
        }
        return jwtUtil.generateToken(email);
    }
}
