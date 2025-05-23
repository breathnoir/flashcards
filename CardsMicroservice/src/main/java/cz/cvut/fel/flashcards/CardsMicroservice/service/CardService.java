package cz.cvut.fel.flashcards.CardsMicroservice.service;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.Card;
import cz.cvut.fel.flashcards.CardsMicroservice.entity.CardBox;
import cz.cvut.fel.flashcards.CardsMicroservice.repository.CardRepository;
import cz.cvut.fel.flashcards.CardsMicroservice.repository.ImageRepository;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardGetDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardPostDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.mapper.GetCardBoxMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final ImageRepository imageRepository;

    public Card createCard(CardPostDTO dto) {
        Card card = new Card();
        card.setQuestion(dto.getQuestion());
        card.setAnswer(dto.getAnswer());

        if (dto.getQuestionImageId() != null)
            card.setQuestionImage( imageRepository.findById(dto.getQuestionImageId())
                    .orElseThrow(() -> new EntityNotFoundException("Bad image id")) );
        if (dto.getAnswerImageId() != null)
            card.setAnswerImage( imageRepository.findById(dto.getAnswerImageId())
                    .orElseThrow(() -> new EntityNotFoundException("Bad image id")) );

        return cardRepository.save(card);
    }

    public void addCardToCardBox(CardBox cardBox, Card card) {
        card.setCardBox(cardBox);
        cardRepository.save(card);
    }

    public Card getCardById(Long id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Card not found with id: " + id));
    }

    public List<Card> getAllCards() {
        return cardRepository.findAll();
    }

    public CardGetDTO updateCard(Long id, CardPostDTO updatedCard) {
        Card existingCard = getCardById(id);
        existingCard.setQuestion(updatedCard.getQuestion());
        existingCard.setAnswer(updatedCard.getAnswer());
        existingCard.setAnswerImage(imageRepository.findById(updatedCard.getAnswerImageId()).orElse(null));
        existingCard.setQuestionImage(imageRepository.findById(updatedCard.getQuestionImageId()).orElse(null));
        Card newCard = cardRepository.save(existingCard);
        return new CardGetDTO(newCard.getId(), newCard.getQuestion(), newCard.getAnswer(), newCard.getQuestionImage().getId(), newCard.getAnswerImage().getId());
    }

    public List<CardGetDTO> getCardsByCardBoxId(Long cardBoxId) {
        return cardRepository.findAllByCardBoxId(cardBoxId);
    }

    public void deleteCardByCardBoxId(Long id) {
        System.out.println("Delete card by card box id: " + id);
        cardRepository.deleteByCardBoxId(id);
    }
}
