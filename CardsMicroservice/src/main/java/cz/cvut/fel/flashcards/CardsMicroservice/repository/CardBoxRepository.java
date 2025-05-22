package cz.cvut.fel.flashcards.CardsMicroservice.repository;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.CardBox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CardBoxRepository extends JpaRepository<CardBox, Long> {
    @Query("SELECT DISTINCT cb FROM CardBox cb JOIN cb.tags t " +
            "WHERE LOWER(t.tagName) LIKE LOWER(CONCAT('%', :tag, '%')) " +
            "AND cb.isPublic = true ORDER BY cb.id DESC")
    List<CardBox> searchCardBoxesByTag(@Param("tag") String tag);

    @Query("SELECT DISTINCT cb FROM CardBox cb " +
            "WHERE LOWER(cb.title) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "AND cb.isPublic = true ORDER BY cb.id DESC")
    List<CardBox> searchCardBoxesByName(@Param("name") String name);

    @Query("SELECT DISTINCT cb FROM CardBox cb LEFT JOIN cb.tags t " +
            "WHERE (LOWER(cb.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(t.tagName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND cb.isPublic = true ORDER BY cb.id DESC")
    List<CardBox> searchCardBoxesByNameAndTag(@Param("keyword") String keyword);

    @Query("SELECT c FROM CardBox c WHERE c.isPublic = :val ORDER BY c.id DESC")
    List<CardBox> findAllByPublic(@Param("val") boolean value);
}
