package cz.cvut.fel.flashcards.UserMicroservice.repository;

import cz.cvut.fel.flashcards.UserMicroservice.entity.UserBox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserBoxRepository extends JpaRepository<UserBox, Long> {
    List<UserBox> findByUserId(Long userId);

    @Query("SELECT ub.id FROM UserBox ub WHERE ub.cardBoxId = :cardBoxId AND ub.user.id = :userId")
    Long checkIfBoxInCollection(@Param("cardBoxId") Long cardBoxId,
                                                @Param("userId")    Long userId);
}
