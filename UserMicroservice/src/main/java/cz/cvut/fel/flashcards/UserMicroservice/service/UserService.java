package cz.cvut.fel.flashcards.UserMicroservice.service;

import cz.cvut.fel.flashcards.UserMicroservice.repository.UserRepository;
import cz.cvut.fel.flashcards.UserMicroservice.entity.User;
import cz.cvut.fel.flashcards.UserMicroservice.security.JwtService;
import cz.cvut.fel.flashcards.UserMicroservice.security.token.Token;
import cz.cvut.fel.flashcards.UserMicroservice.security.token.TokenRepository;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.AuthResponse;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.UserGetDTO;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.UserMapper;
import cz.cvut.fel.flashcards.UserMicroservice.util.exception.DuplicateEmailException;
import cz.cvut.fel.flashcards.UserMicroservice.util.exception.DuplicateUsernameException;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final JwtService jwtService;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    public User getUserById(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        return optionalUser.orElseThrow(() ->
                new EntityNotFoundException("User not found with id: " + id));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        User existingUser = getUserById(id);
        List<Token> tokens = tokenRepository.findAllByUser(existingUser);
        tokenRepository.deleteAll(tokens);
        userRepository.delete(existingUser);
    }

    public AuthResponse updatePassword(Long id, String newPassword) {
        User existingUser = getUserById(id);
        existingUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.saveAndFlush(existingUser);

        tokenRepository.deleteAll(tokenRepository.findAllByUser(existingUser));

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", existingUser.getId());
        extraClaims.put("role", existingUser.getRole());

        var token = jwtService.generateToken(extraClaims, existingUser);
        authService.saveUserToken(existingUser, token);

        return new AuthResponse(token, UserMapper.getInstance().toUserGetDTO(existingUser));
    }

    public void banUser(Long id) {
        User existingUser = getUserById(id);
        existingUser.setBanned(true);
        userRepository.save(existingUser);
    }

    public void unbanUser(Long id) {
        User existingUser = getUserById(id);
        existingUser.setBanned(false);
        userRepository.save(existingUser);
    }

    public UserGetDTO updateEmail(Long id, String newEmail) {
        if (userRepository.existsByEmail(newEmail)) {
            throw new DuplicateEmailException("Email already in use: " + newEmail);
        }
        User existingUser = getUserById(id);
        existingUser.setEmail(newEmail);
        return UserMapper.getInstance().toUserGetDTO(userRepository.save(existingUser));
    }

    public AuthResponse updateUsername(Long id, String newUsername) {
        if (userRepository.existsByUsername(newUsername)) {
            throw new DuplicateUsernameException("Username already in use: " + newUsername);
        }
        User existingUser = getUserById(id);
        existingUser.setUsername(newUsername);
        userRepository.saveAndFlush(existingUser);

        tokenRepository.deleteAll(tokenRepository.findAllByUser(existingUser));

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", existingUser.getId());
        extraClaims.put("role", existingUser.getRole());

        var token = jwtService.generateToken(extraClaims, existingUser);
        authService.saveUserToken(existingUser, token);

        return new AuthResponse(token, UserMapper.getInstance().toUserGetDTO(existingUser));
    }
}
