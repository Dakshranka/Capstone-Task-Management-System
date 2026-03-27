package com.thedakshranka.capstone.project.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thedakshranka.capstone.project.backend.entity.Role;
import com.thedakshranka.capstone.project.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRoleAndActiveTrue(Role role);
    List<User> findByActiveTrueOrActiveIsNull();
}
