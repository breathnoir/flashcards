package cz.cvut.fel.flashcards.UserMicroservice.controller;

import cz.cvut.fel.flashcards.UserMicroservice.entity.User;
import cz.cvut.fel.flashcards.UserMicroservice.service.UserService;
import cz.cvut.fel.flashcards.UserMicroservice.util.UserUtil;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.AuthResponse;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.UserGetDTO;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.UserMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("api/users")
public class UserController {

    private final UserService userService;
    private final UserUtil userUtil;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserGetDTO> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(UserMapper.getInstance().toUserGetDTO(user));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserGetDTO> getMyself() {
        User user = userService.getUserById(userUtil.getUserId());
        return ResponseEntity.ok(UserMapper.getInstance().toUserGetDTO(user));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserGetDTO>> getAllUsers() {
        List<UserGetDTO> users = userService.getAllUsers()
                .stream()
                .map(u -> UserMapper.getInstance().toUserGetDTO(u))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("Deleting user {}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteMyAccount() {
        Long id = userUtil.getUserId();
        log.info("Deleting user {}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/username/{id}")
    public String getUsernameById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return user.getUsername();
    }

    @PatchMapping("/changeUsername")
    public ResponseEntity<AuthResponse> updateUsername(@RequestBody String newUsername) {
        Long id = userUtil.getUserId();
        return ResponseEntity.ok(userService.updateUsername(id, newUsername));
    }

    @PatchMapping("/changeEmail")
    public ResponseEntity<AuthResponse> updateEmail(@RequestBody String newEmail) {
        Long id = userUtil.getUserId();
        return ResponseEntity.ok(new AuthResponse(null, userService.updateEmail(id, newEmail)));
    }

    @PatchMapping("/changePassword")
    public ResponseEntity<AuthResponse> updatePassword(@RequestBody String newPassword) {
        Long id = userUtil.getUserId();
        return ResponseEntity.ok(userService.updatePassword(id, newPassword));
    }
}
