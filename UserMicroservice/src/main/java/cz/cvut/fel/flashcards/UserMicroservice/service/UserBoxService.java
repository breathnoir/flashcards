package cz.cvut.fel.flashcards.UserMicroservice.service;

import cz.cvut.fel.flashcards.UserMicroservice.entity.User;
import cz.cvut.fel.flashcards.UserMicroservice.entity.UserBox;
import cz.cvut.fel.flashcards.UserMicroservice.feign.CardBoxClient;
import cz.cvut.fel.flashcards.UserMicroservice.repository.UserBoxRepository;
import cz.cvut.fel.flashcards.UserMicroservice.util.UserUtil;
import cz.cvut.fel.flashcards.UserMicroservice.util.dto.CardBoxGetDTO;
import cz.cvut.fel.flashcards.UserMicroservice.util.exception.DuplicateUserBoxException;
import cz.cvut.fel.flashcards.UserMicroservice.util.exception.InvalidPercentageException;
import feign.FeignException;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class UserBoxService {

    private final UserBoxRepository userBoxRepository;
    private final UserService userService;
    private final CardBoxClient cardBoxClient;
    private final UserUtil userUtil;

    public UserBox addCardBoxToUserCollection(Long userId, Long cardBoxId) {
        try {
            CardBoxGetDTO cardBoxGetDTO = cardBoxClient.getCardBoxById(cardBoxId);
        } catch (FeignException.NotFound e) {
            throw new EntityNotFoundException(e.getMessage());
        }

        User user = userService.getUserById(userId);

        try {
            UserBox userBox = new UserBox();
            userBox.setUser(user);
            userBox.setCardBoxId(cardBoxId);

            return userBoxRepository.saveAndFlush(userBox);
        } catch (DataIntegrityViolationException ex) {
            throw new DuplicateUserBoxException("User " + userId + " already have card box " + cardBoxId);
        }
    }

    public UserBox getUserBoxById(Long id) {
        Optional<UserBox> optionalUserBox = userBoxRepository.findById(id);
        return optionalUserBox.orElseThrow(() ->
                new EntityNotFoundException("UserBox not found with id: " + id));
    }

    public UserBox updateSuccessPercentageBox(Long id, double percentage) {
        if (percentage < 0.0 || percentage > 100.0) {
            throw new InvalidPercentageException("Percentage must be between 0.0 and 100.0, got " + percentage);
        }

        UserBox existingUserBox = getUserBoxById(id);

        if (existingUserBox.getSuccessPercentage() == 0) existingUserBox.setSuccessPercentage(percentage);
        else existingUserBox.setSuccessPercentage((existingUserBox.getSuccessPercentage() + percentage) / 2);
        return userBoxRepository.save(existingUserBox);
    }

    public void deleteUserBox(Long id) {
        UserBox existingUserBox = getUserBoxById(id);
        userBoxRepository.delete(existingUserBox);
    }

    public List<UserBox> getAllUserBoxesByUserId(Long userId) {
        return userBoxRepository.findByUserId(userId);
    }

    public Long checkIfBoxInCollection(Long cardboxId) {
        Long userId = userUtil.getUserId();
        Long collectionId = userBoxRepository.checkIfBoxInCollection(cardboxId, userId);
        if (collectionId == null) {
            return 0L;
        } else
            return collectionId;
    }
}
