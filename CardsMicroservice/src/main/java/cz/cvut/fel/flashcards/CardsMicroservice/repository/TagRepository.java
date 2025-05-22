package cz.cvut.fel.flashcards.CardsMicroservice.repository;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.Tag;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.TagGetDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    @Query(
            "SELECT DISTINCT t FROM Tag t " +
                    "WHERE LOWER(t.tagName) LIKE LOWER(CONCAT('%', :name, '%'))"
    )
    List<Tag> searchByName(@Param("name") String name);

    boolean existsByTagName(String tagName);

    @Query("""
      SELECT new cz.cvut.fel.flashcards.CardsMicroservice.util.dto.TagGetDTO(
        t.id, t.tagName, t.color, t.textColor
      )
      FROM Tag t
          JOIN t.cardBoxes cb
      WHERE cb.id = :cardBoxId
    """)
    List<TagGetDTO> getTagsByCardBoxId(@Param("cardBoxId") Long cardboxId);
}
