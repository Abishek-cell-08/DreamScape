package com.dreamscape.backend.service;

import com.dreamscape.backend.model.Dream;
import com.dreamscape.backend.repository.DreamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@Service
public class TrendService {

    @Autowired
    private DreamRepository dreamRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public Map<String, Map<String, Integer>> getTrends(Long userId) {
        List<Dream> dreams = dreamRepository.findByUserId(userId);

        Map<String, Integer> emotionTrends = new HashMap<>();
        Map<String, Integer> themeTrends = new HashMap<>();

        for (Dream dream : dreams) {
            try {
                Map<String, Object> insights = objectMapper.readValue(dream.getInsights(), Map.class);

                if (insights.containsKey("emotion")) {
                    String emotion = insights.get("emotion").toString();
                    emotionTrends.put(emotion, emotionTrends.getOrDefault(emotion, 0) + 1);
                }

                if (insights.containsKey("theme")) {
                    String theme = insights.get("theme").toString();
                    themeTrends.put(theme, themeTrends.getOrDefault(theme, 0) + 1);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Map<String, Map<String, Integer>> trends = new HashMap<>();
        trends.put("emotionTrends", emotionTrends);
        trends.put("themeTrends", themeTrends);

        return trends;
    }
}
