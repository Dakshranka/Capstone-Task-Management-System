package com.thedakshranka.capstone.project.backend.dto;

import com.thedakshranka.capstone.project.backend.entity.Role;

import java.time.LocalDateTime;

public class UserResponse {
    private final Long id;
    private final String name;
    private final String email;
    private final Role role;
    private final LocalDateTime createdAt;

    public UserResponse(Long id, String name, String email, Role role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
