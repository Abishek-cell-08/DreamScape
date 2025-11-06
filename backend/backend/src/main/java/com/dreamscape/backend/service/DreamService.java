package com.dreamscape.backend.service;

import com.dreamscape.backend.model.Dream;
import com.dreamscape.backend.model.User;
import com.dreamscape.backend.repository.DreamRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DreamService {

    private final DreamRepository dreamRepository;

    public DreamService(DreamRepository dreamRepository) {
        this.dreamRepository = dreamRepository;
    }

    public List<Dream> getDreamsForUser(User user) {
        return dreamRepository.findByUser(user);
    }

    public Dream saveDream(Dream dream) {
        return dreamRepository.save(dream);
    }
}
