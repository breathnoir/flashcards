package cz.cvut.fel.flashcards.UserMicroservice.controller;

import cz.cvut.fel.flashcards.UserMicroservice.entity.UserBox;
import cz.cvut.fel.flashcards.UserMicroservice.service.UserBoxService;
import cz.cvut.fel.flashcards.UserMicroservice.util.UserUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/collections")
public class UserBoxController {

    private final UserBoxService userBoxService;
    private final UserUtil userUtil;

    @PostMapping("/{boxId}/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserBox> addCardBoxToUserCollection(@PathVariable Long boxId, @PathVariable Long userId) {
        UserBox createdUserBox = userBoxService.addCardBoxToUserCollection(userId, boxId);
        return new ResponseEntity<>(createdUserBox, HttpStatus.CREATED);
    }

    @PostMapping("/{boxId}")
    public ResponseEntity<UserBox> addCardBoxToMyCollection(@PathVariable Long boxId) {
        UserBox createdUserBox = userBoxService.addCardBoxToUserCollection(userUtil.getUserId(), boxId);
        return new ResponseEntity<>(createdUserBox, HttpStatus.CREATED);
    }

    @GetMapping("/my/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserBox>> getUserCollectionByUserId(@PathVariable Long userId) {
        List<UserBox> userBoxes = userBoxService.getAllUserBoxesByUserId(userId);
        return ResponseEntity.ok(userBoxes);
    }

    @GetMapping("/my")
    public ResponseEntity<List<UserBox>> getMyCollection() {
        List<UserBox> userBoxes = userBoxService.getAllUserBoxesByUserId(userUtil.getUserId());
        return ResponseEntity.ok(userBoxes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserBox> getUserBoxById(@PathVariable Long id) {
        UserBox userBox = userBoxService.getUserBoxById(id);
        return ResponseEntity.ok(userBox);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateBoxPercentage(@PathVariable Long id, @RequestBody double percentage) {
        UserBox userBox = userBoxService.updateSuccessPercentageBox(id, percentage);
        return ResponseEntity.ok("New percentage: " + userBox.getSuccessPercentage());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserBox(@PathVariable Long id) {
        userBoxService.deleteUserBox(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{cardboxId}")
    public ResponseEntity<Long> checkUserBox(@PathVariable Long cardboxId) {
        return ResponseEntity.ok(userBoxService.checkIfBoxInCollection(cardboxId));
    }
}
