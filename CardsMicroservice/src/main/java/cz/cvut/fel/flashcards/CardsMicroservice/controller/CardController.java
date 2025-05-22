package cz.cvut.fel.flashcards.CardsMicroservice.controller;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.Card;
import cz.cvut.fel.flashcards.CardsMicroservice.service.CardService;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardGetDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardPostDTO;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/cards")
@AllArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping
    public ResponseEntity<Card> createCard(@RequestBody CardPostDTO cardPostDTO) {
        Card createdCard = cardService.createCard(cardPostDTO);
        return new ResponseEntity<>(createdCard, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Card> getCardById(@PathVariable Long id) {
        Card card = cardService.getCardById(id);
        return ResponseEntity.ok(card);
    }

    @GetMapping("/{cardBoxId}/all")
    public ResponseEntity<List<CardGetDTO>> getCardsByCardBoxId(@PathVariable Long cardBoxId) {
        List<CardGetDTO> cards = cardService.getCardsByCardBoxId(cardBoxId);
        return ResponseEntity.ok(cards);
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Card>> getAllCards() {
        List<Card> cards = cardService.getAllCards();
        return ResponseEntity.ok(cards);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardGetDTO> updateCard(@PathVariable Long id, @RequestBody CardPostDTO updatedCard) {
        CardGetDTO card = cardService.updateCard(id, updatedCard);
        return ResponseEntity.ok(card);
    }
}
