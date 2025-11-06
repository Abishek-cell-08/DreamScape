package com.dreamscape.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;

@Entity
@Table(name = "dreams")
public class Dream {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String text;

    private LocalDate date;

    private String privacy;

    @Column(columnDefinition = "TEXT") // ✅ allows long URLs/Base64
    private String image;

    @Column(columnDefinition = "TEXT") // ✅ allows large AI insights
    private String insights;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getPrivacy() { return privacy; }
    public void setPrivacy(String privacy) { this.privacy = privacy; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getInsights() { return insights; }
    public void setInsights(String insights) { this.insights = insights; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
