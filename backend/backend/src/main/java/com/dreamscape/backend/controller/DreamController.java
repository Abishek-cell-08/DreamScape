package com.dreamscape.backend.controller;

import com.dreamscape.backend.model.Dream;
import com.dreamscape.backend.model.User;
import com.dreamscape.backend.repository.DreamRepository;
import com.dreamscape.backend.repository.UserRepository;
import com.dreamscape.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/dreams")
public class DreamController {

    @Autowired
    private DreamRepository dreamRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ POST /api/dreams — Save a dream
    @PostMapping
    public Dream saveDream(@RequestHeader("Authorization") String token, @RequestBody Dream dream) {
        String email = jwtUtil.extractEmail(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        dream.setUser(user);
        dream.setDate(LocalDate.now());

        try {
            // ✅ Generate image using Cloudflare Worker
            String imageUrl = generateDreamImage(dream.getText());
            dream.setImage(imageUrl);
        } catch (Exception e) {
            System.err.println("⚠️ Image generation failed, using fallback image: " + e.getMessage());
            dream.setImage("https://picsum.photos/seed/" + dream.getText().hashCode() + "/400/400");
        }

        return dreamRepository.save(dream);
    }

    // ✅ GET /api/dreams — Fetch dreams for current user
    @GetMapping
    public List<Dream> getUserDreams(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return dreamRepository.findByUser(user);
    }

    // ✅ Helper: Generate Image from Cloudflare Worker
    private String generateDreamImage(String prompt) {
        String apiUrl = "your-cloudflare-worker-endpoint"; // Replace with your Cloudflare Worker URL
        String apiKey = "YourapiKeyHere12345"; // Replace with your actual API key

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        Map<String, String> body = new HashMap<>();
        body.put("prompt", prompt);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<byte[]> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                request,
                byte[].class
        );

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            // Convert image bytes to base64 and use data URI (for frontend display)
            String base64Image = Base64.getEncoder().encodeToString(response.getBody());
            return "data:image/png;base64," + base64Image;
        } else {
            throw new RuntimeException("Image generation failed with status: " + response.getStatusCode());
        }
    }
}
