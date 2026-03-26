package com.thedakshranka.capstone.project.backend.repository;

import com.thedakshranka.capstone.project.backend.entity.Task;
import com.thedakshranka.capstone.project.backend.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByAssignedToId(Long assignedToId);
    List<Task> findByStatusAndAssignedToId(TaskStatus status, Long assignedToId);
}
