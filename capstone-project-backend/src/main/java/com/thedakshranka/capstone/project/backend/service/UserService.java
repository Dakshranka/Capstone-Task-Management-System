package com.thedakshranka.capstone.project.backend.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thedakshranka.capstone.project.backend.dto.RegisterRequest;
import com.thedakshranka.capstone.project.backend.dto.UserResponse;
import com.thedakshranka.capstone.project.backend.entity.Role;
import com.thedakshranka.capstone.project.backend.entity.User;
import com.thedakshranka.capstone.project.backend.exception.ResourceNotFoundException;
import com.thedakshranka.capstone.project.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<UserResponse> getActiveUsers() {
        return userRepository.findByActiveTrueOrActiveIsNull().stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toResponse(user);
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return toResponse(user);
    }

    public UserResponse createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setActive(true);

        return toResponse(userRepository.save(user));
    }

    public UserResponse deactivateUser(Long id, String currentUserEmail) {
        User targetUser = getUserEntityById(id);
        User actingUser = getUserEntityByEmail(currentUserEmail);

        if (actingUser.getId().equals(targetUser.getId())) {
            throw new IllegalArgumentException("Admin cannot deactivate their own account");
        }

        boolean isTargetActive = isActive(targetUser);
        if (!isTargetActive) {
            return toResponse(targetUser);
        }

        if (targetUser.getRole() == Role.ADMIN && userRepository.countByRoleAndActiveTrue(Role.ADMIN) <= 1) {
            throw new IllegalArgumentException("Cannot deactivate the last active admin");
        }

        targetUser.setActive(false);
        return toResponse(userRepository.save(targetUser));
    }

    public UserResponse activateUser(Long id) {
        User targetUser = getUserEntityById(id);

        if (isActive(targetUser)) {
            return toResponse(targetUser);
        }

        targetUser.setActive(true);
        return toResponse(userRepository.save(targetUser));
    }

    public boolean isActive(User user) {
        return user.getActive() == null || Boolean.TRUE.equals(user.getActive());
    }

    public User getUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            isActive(user),
            user.getCreatedAt()
        );
    }
}
