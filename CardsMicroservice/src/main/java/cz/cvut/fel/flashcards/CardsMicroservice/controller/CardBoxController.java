package cz.cvut.fel.flashcards.CardsMicroservice.controller;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.CardBox;
import cz.cvut.fel.flashcards.CardsMicroservice.service.CardBoxService;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardBoxGetDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardBoxPostDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.AddCardsAndTagsDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardPostDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/cardboxes")
@AllArgsConstructor
public class CardBoxController {

    private final CardBoxService cardBoxService;

    @PostMapping("/create")
    public ResponseEntity<CardBox> createCardBox(@Valid @RequestBody CardBoxPostDTO cardBox) {
        CardBox createdCardBox = cardBoxService.createCardBox(cardBox);
        return new ResponseEntity<>(createdCardBox, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardBoxGetDTO> getCardBoxById(@PathVariable Long id) {
        CardBoxGetDTO cardBox = cardBoxService.getCardBoxById(id);
        return ResponseEntity.ok(cardBox);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<CardBox>> getAllCardBoxes() {
        List<CardBox> cardBoxes = cardBoxService.getAllCardBoxes();
        return ResponseEntity.ok(cardBoxes);
    }

    @PostMapping("/collection")
    public ResponseEntity<List<CardBoxGetDTO>> getCardBoxesByIds(@RequestBody Set<Long> cardBoxIds) {
        List<CardBoxGetDTO> cardBoxes = cardBoxService.getCardBoxesByIds(cardBoxIds);
        return ResponseEntity.ok(cardBoxes);
    }

    @GetMapping("/public")
    public ResponseEntity<List<CardBoxGetDTO>> getPublicCardBoxes() {
        List<CardBoxGetDTO> cardBoxes = cardBoxService.getPublicCardBoxes();
        return ResponseEntity.ok(cardBoxes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardBoxGetDTO> updateCardBox(@PathVariable Long id, @Valid @RequestBody CardBoxPostDTO updatedCardBox) {
        CardBoxGetDTO cardBox = cardBoxService.updateCardBox(id, updatedCardBox);
        return ResponseEntity.ok(cardBox);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCardBox(@PathVariable Long id) {
        cardBoxService.deleteCardBox(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{cardBoxId}/addCard")
    public ResponseEntity<CardBox> addCardToCardBox(@PathVariable Long cardBoxId, @Valid @RequestBody CardPostDTO postDTO) {
        CardBox cardBox = cardBoxService.addCardToBox(cardBoxId, postDTO);
        return ResponseEntity.ok(cardBox);
    }

    @DeleteMapping("/{cardBoxId}/deleteCard/{cardId}")
    public ResponseEntity<Void> deleteCardFromCardBox(@PathVariable Long cardBoxId, @PathVariable Long cardId) {
        cardBoxService.removeCardFromBox(cardBoxId, cardId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{cardBoxId}/{tagId}/addTag")
    public ResponseEntity<CardBox> addTagToCardBox(@PathVariable Long cardBoxId, @PathVariable Long tagId) {
        CardBox cardBox = cardBoxService.addTagToBox(cardBoxId, tagId);
        return ResponseEntity.ok(cardBox);
    }

    @PutMapping("/{cardBoxId}/{tagId}/removeTag")
    public ResponseEntity<Void> removeTagFromCardBox(@PathVariable Long cardBoxId, @PathVariable Long tagId) {
        cardBoxService.removeTagFromBox(cardBoxId, tagId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{cardBoxId}/bulk")
    public ResponseEntity<CardBoxGetDTO> addCardsAndTags(
            @PathVariable Long cardBoxId,
            @RequestBody AddCardsAndTagsDTO dto) {

        return ResponseEntity.ok(cardBoxService.addCardsAndTags(cardBoxId, dto));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CardBoxGetDTO>> search(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String keyword
    ) {
        if (tag != null) {
            return ResponseEntity.ok(cardBoxService.searchByTag(tag));
        } else if (title != null) {
            return ResponseEntity.ok(cardBoxService.searchByTitle(title));
        } else if (keyword != null) {
            return ResponseEntity.ok(cardBoxService.searchByTitleAndTag(keyword));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

}
