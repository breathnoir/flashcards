package cz.cvut.fel.flashcards.CardsMicroservice.repository;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
