package com.dreamscape.backend.controller;

import com.dreamscape.backend.model.Dream;
import com.dreamscape.backend.model.User;
import com.dreamscape.backend.repository.DreamRepository;
import com.dreamscape.backend.repository.UserRepository;
import com.dreamscape.backend.security.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/trends")
public class TrendController {

    @Autowired
    private DreamRepository dreamRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final ObjectMapper mapper = new ObjectMapper();

    @GetMapping
    public Map<String, Object> getDreamTrends(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Dream> dreams = dreamRepository.findByUser(user);
        Map<String, Long> emotionTrends = new HashMap<>();
        Map<String, Long> themeTrends = new HashMap<>();

        // ✅ Parse each dream’s insights JSON safely
        for (Dream dream : dreams) {
            if (dream.getInsights() != null && !dream.getInsights().isEmpty()) {
                try {
                    Map<String, Object> insightsMap = mapper.readValue(dream.getInsights(), Map.class);

                    // ✅ Handle "emotions" object (map of emotion → value)
                    if (insightsMap.containsKey("emotions")) {
                        Map<String, Object> emotions = (Map<String, Object>) insightsMap.get("emotions");
                        for (String emotion : emotions.keySet()) {
                            emotionTrends.put(emotion, emotionTrends.getOrDefault(emotion, 0L) + 1);
                        }
                    }

                    // ✅ Handle "themes" array (list of themes)
                    if (insightsMap.containsKey("themes")) {
                        List<Object> themes = (List<Object>) insightsMap.get("themes");
                        for (Object themeObj : themes) {
                            String theme = themeObj.toString();
                            themeTrends.put(theme, themeTrends.getOrDefault(theme, 0L) + 1);
                        }
                    }

                } catch (Exception e) {
                    System.out.println("❌ Error parsing insights for dream ID "
                            + dream.getId() + ": " + e.getMessage());
                }
            }
        }

        // ✅ Build response
        Map<String, Object> trends = new HashMap<>();
        trends.put("totalDreams", dreams.size());
        trends.put("emotionTrends", emotionTrends);
        trends.put("themeTrends", themeTrends);

        return trends;
    }
}