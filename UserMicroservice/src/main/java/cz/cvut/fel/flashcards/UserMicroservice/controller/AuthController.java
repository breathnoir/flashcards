package cz.cvut.fel.flashcards.UserMicroservice.controller;

import cz.cvut.fel.flashcards.UserMicroservice.service.AuthService;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.AuthResponse;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.UserLoginDTO;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.UserRegistrationDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody UserRegistrationDTO registrationDTO) {
        log.info("Registering user {}", registrationDTO);
        AuthResponse response = authService.registerUser(registrationDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody UserLoginDTO loginDTO) {
        log.info("Logging in user {}", loginDTO);
        AuthResponse response = authService.login(loginDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
