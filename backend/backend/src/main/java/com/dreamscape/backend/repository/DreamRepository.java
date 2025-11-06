package com.dreamscape.backend.repository;

import com.dreamscape.backend.model.Dream;
import com.dreamscape.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DreamRepository extends JpaRepository<Dream, Long> {
    List<Dream> findByUser(User user);
}
