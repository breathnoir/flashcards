package cz.cvut.fel.flashcards.CardsMicroservice.controller;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.Tag;
import cz.cvut.fel.flashcards.CardsMicroservice.service.TagService;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.TagGetDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.TagPostDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@AllArgsConstructor
public class TagController {

    private final TagService tagService;

    @PostMapping
    public ResponseEntity<Tag> createTag(@Valid @RequestBody TagPostDTO tag) {
        Tag createdTag = tagService.createTag(tag);
        return new ResponseEntity<>(createdTag, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable Long id) {
        Tag tag = tagService.getTagById(id);
        return ResponseEntity.ok(tag);
    }

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        List<Tag> tags = tagService.getAllTags();
        return ResponseEntity.ok(tags);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tag> updateTag(@PathVariable Long id, @Valid @RequestBody TagPostDTO updatedTag) {
        Tag tag = tagService.updateTag(id, updatedTag);
        return ResponseEntity.ok(tag);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<TagGetDTO>> searchByName(@RequestParam String name) {
        List<TagGetDTO> tags = tagService.searchByName(name);
        return ResponseEntity.ok(tags);
    }

    @GetMapping("/{cardboxId}/all")
    public ResponseEntity<List<TagGetDTO>> getAllTagsByCardboxId(@PathVariable Long cardboxId) {
        List<TagGetDTO> tags = tagService.getTagsByCardBoxId(cardboxId);
        return ResponseEntity.ok(tags);
    }
}
