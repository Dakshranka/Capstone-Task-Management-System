package com.thedakshranka.capstone.project.backend.service;

import com.thedakshranka.capstone.project.backend.dto.TaskRequest;
import com.thedakshranka.capstone.project.backend.dto.TaskResponse;
import com.thedakshranka.capstone.project.backend.entity.Role;
import com.thedakshranka.capstone.project.backend.entity.Task;
import com.thedakshranka.capstone.project.backend.entity.TaskStatus;
import com.thedakshranka.capstone.project.backend.entity.User;
import com.thedakshranka.capstone.project.backend.exception.ResourceNotFoundException;
import com.thedakshranka.capstone.project.backend.repository.TaskRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;

    public TaskService(TaskRepository taskRepository, UserService userService) {
        this.taskRepository = taskRepository;
        this.userService = userService;
    }

    public TaskResponse createTask(TaskRequest request, String currentUserEmail) {
        User assignedTo = userService.getUserEntityById(request.getAssignedToId());
        if (!userService.isActive(assignedTo)) {
            throw new IllegalArgumentException("Task cannot be assigned to an inactive user");
        }
        User createdBy = userService.getUserEntityByEmail(currentUserEmail);

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setAssignedTo(assignedTo);
        task.setCreatedBy(createdBy);

        return toResponse(taskRepository.save(task));
    }

    public List<TaskResponse> getTasks(TaskStatus status, Long assignedToId) {
        List<Task> tasks;

        if (status != null && assignedToId != null) {
            tasks = taskRepository.findByStatusAndAssignedToId(status, assignedToId);
        } else if (status != null) {
            tasks = taskRepository.findByStatus(status);
        } else if (assignedToId != null) {
            tasks = taskRepository.findByAssignedToId(assignedToId);
        } else {
            tasks = taskRepository.findAll();
        }

        return tasks.stream().map(this::toResponse).toList();
    }

    public List<TaskResponse> getTasksForUser(TaskStatus status, Long assignedToId, String currentUserEmail) {
        User currentUser = userService.getUserEntityByEmail(currentUserEmail);

        if (currentUser.getRole() == Role.ADMIN) {
            return getTasks(status, assignedToId);
        }

        if (assignedToId != null && !assignedToId.equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only view tasks assigned to you");
        }

        return getTasks(status, currentUser.getId());
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return toResponse(task);
    }

    public TaskResponse getTaskByIdForUser(Long id, String currentUserEmail) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User currentUser = userService.getUserEntityByEmail(currentUserEmail);
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isAssignee = task.getAssignedTo().getId().equals(currentUser.getId());

        if (!isAdmin && !isAssignee) {
            throw new AccessDeniedException("You can only view tasks assigned to you");
        }

        return toResponse(task);
    }

    public TaskResponse updateTask(Long id, TaskRequest request, String currentUserEmail) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User currentUser = userService.getUserEntityByEmail(currentUserEmail);
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isAssignee = task.getAssignedTo().getId().equals(currentUser.getId());

        if (!isAdmin && !isAssignee) {
            throw new AccessDeniedException("You can only update tasks assigned to you");
        }

        User assignedTo = userService.getUserEntityById(request.getAssignedToId());
        boolean sameAssignee = task.getAssignedTo().getId().equals(assignedTo.getId());
        if (!sameAssignee && !userService.isActive(assignedTo)) {
            throw new IllegalArgumentException("Task cannot be assigned to an inactive user");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setAssignedTo(assignedTo);

        return toResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id, String currentUserEmail) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User currentUser = userService.getUserEntityByEmail(currentUserEmail);
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isCreator = task.getCreatedBy().getId().equals(currentUser.getId());

        if (!isAdmin && !isCreator) {
            throw new AccessDeniedException("Only task creator or admin can delete this task");
        }

        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getAssignedTo().getId(),
            task.getAssignedTo().getName(),
            task.getCreatedBy().getId(),
            task.getCreatedBy().getName(),
            task.getCreatedAt(),
            task.getUpdatedAt()
        );
    }
}
