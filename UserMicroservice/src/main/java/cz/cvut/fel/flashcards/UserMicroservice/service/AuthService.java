package cz.cvut.fel.flashcards.UserMicroservice.service;

import cz.cvut.fel.flashcards.UserMicroservice.entity.User;
import cz.cvut.fel.flashcards.UserMicroservice.repository.UserRepository;
import cz.cvut.fel.flashcards.UserMicroservice.security.JwtService;
import cz.cvut.fel.flashcards.UserMicroservice.security.token.Token;
import cz.cvut.fel.flashcards.UserMicroservice.security.token.TokenRepository;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.AuthResponse;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.UserLoginDTO;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.UserMapper;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.UserRegistrationDTO;
import cz.cvut.fel.flashcards.UserMicroservice.util.exception.DuplicateEmailException;
import cz.cvut.fel.flashcards.UserMicroservice.util.exception.DuplicateUsernameException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@Transactional
@AllArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRepository tokenRepository;

    public AuthResponse registerUser(UserRegistrationDTO userRegistrationDTO) {
        if (userRepository.existsByEmail(userRegistrationDTO.getEmail())) {
            throw new DuplicateEmailException("Email already in use: " + userRegistrationDTO.getEmail());
        }
        if (userRepository.existsByUsername(userRegistrationDTO.getUsername())) {
            throw new DuplicateUsernameException("Username already in use: " + userRegistrationDTO.getUsername());
        }

        User user = UserMapper.getInstance().toUser(userRegistrationDTO);
        user.setPassword(passwordEncoder.encode(userRegistrationDTO.getPassword()));
        userRepository.saveAndFlush(user);

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getId());
        extraClaims.put("role", user.getRole());

        var token = jwtService.generateToken(extraClaims, user);
        saveUserToken(user, token);

        return new AuthResponse(token, UserMapper.getInstance().toUserGetDTO(user));
    }

    public AuthResponse login(@Valid UserLoginDTO dto) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword()));

        User user = (User) auth.getPrincipal();

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getId());
        extraClaims.put("role", user.getRole());

        String token = jwtService.generateToken(extraClaims, user);
        saveUserToken(user, token);

        return new AuthResponse(token, UserMapper.getInstance().toUserGetDTO(user));
    }

    public void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .expired(false)
                .build();
        tokenRepository.save(token);
    }
}
