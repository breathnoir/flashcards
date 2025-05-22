package cz.cvut.fel.flashcards.UserMicroservice.security.token;

import cz.cvut.fel.flashcards.UserMicroservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {

    Optional<Token> findByToken(String token);

    List<Token> findAllByUser(User existingUser);
}
