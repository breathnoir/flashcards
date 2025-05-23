package cz.cvut.fel.flashcards.CardsMicroservice.repository;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.Card;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardGetDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    @Query("""
      SELECT new cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardGetDTO(
        c.id, c.question, c.answer,
        c.questionImage.id, c.answerImage.id
      )
      FROM Card c
      WHERE c.cardBox.id = :cardBoxId
    """)
    List<CardGetDTO> findAllByCardBoxId(Long cardBoxId);

    @Modifying
    @Query("DELETE Card c WHERE c.cardBox.id = :cardBoxId")
    void deleteByCardBoxId( Long cardBoxId);
}
