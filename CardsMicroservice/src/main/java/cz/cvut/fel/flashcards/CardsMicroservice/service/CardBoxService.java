package cz.cvut.fel.flashcards.CardsMicroservice.service;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.Card;
import cz.cvut.fel.flashcards.CardsMicroservice.entity.CardBox;
import cz.cvut.fel.flashcards.CardsMicroservice.entity.Tag;
import cz.cvut.fel.flashcards.CardsMicroservice.repository.CardBoxRepository;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.AddCardsAndTagsDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardBoxGetDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.mapper.CardBoxMapper;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardBoxPostDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardPostDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.UserUtil;
import cz.cvut.fel.flashcards.CardsMicroservice.util.mapper.GetCardBoxMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@Transactional
@AllArgsConstructor
public class CardBoxService {

    private final CardBoxRepository cardBoxRepository;
    private final CardService cardService;
    private final TagService tagService;
    private final UserUtil userUtil;
    private final GetCardBoxMapper getCardBoxMapper;

    public CardBox createCardBox(CardBoxPostDTO cardBox) {
        CardBox newCardBox = CardBoxMapper.getInstance().toCardBox(cardBox);
        if (newCardBox.getOwnerId() == null) {
            newCardBox.setOwnerId(userUtil.getUserId());
        }
        return cardBoxRepository.save(newCardBox);
    }

    public CardBox findCardBoxById(Long id) {
        return cardBoxRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CardBox not found with id: " + id));
    }

    public CardBoxGetDTO getCardBoxById(Long id) {
        return getCardBoxMapper.toDto(cardBoxRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CardBox not found with id: " + id)));
    }

    public List<CardBox> getAllCardBoxes() {
        return cardBoxRepository.findAll();
    }

    public CardBoxGetDTO updateCardBox(Long id, CardBoxPostDTO updatedCardBox) {
        CardBox existingCardBox = findCardBoxById(id);
        existingCardBox.setTitle(updatedCardBox.getTitle());
        existingCardBox.setPublic(updatedCardBox.isPublic());
        existingCardBox.setDescription(updatedCardBox.getDescription());
        return getCardBoxMapper.toDto(cardBoxRepository.save(existingCardBox));
    }

    @Transactional
    public void deleteCardBox(Long id) {
        deleteAllCards(id);

        cardBoxRepository.deleteTagAssociations1(id);
        cardBoxRepository.deleteTagAssociations2(id);

        cardBoxRepository.deleteById(id);
    }

    @Transactional
    void deleteAllCards(Long id) {
        CardBox existingCardBox = findCardBoxById(id);
        cardService.deleteCardByCardBoxId(id);

        existingCardBox.getCards().clear();
        cardBoxRepository.save(existingCardBox);
    }

    public CardBox addCardToBox(Long cardBoxId, CardPostDTO cardPostDTO) {
        CardBox cardBox = findCardBoxById(cardBoxId);
        Card newCard = cardService.createCard(cardPostDTO);
        cardService.addCardToCardBox(cardBox, newCard);
        cardBox.getCards().add(newCard);
        return cardBoxRepository.save(cardBox);
    }

    public void removeCardFromBox(Long cardBoxId, Long cardId) {
        CardBox cardBox = findCardBoxById(cardBoxId);
        Card card = cardService.getCardById(cardId);
        cardBox.getCards().remove(card);
    }

    public CardBox addTagToBox(Long cardBoxId, Long tagId) {
        CardBox cardBox = findCardBoxById(cardBoxId);
        Tag tag = tagService.addCardBoxToTag(tagId, cardBox);
        cardBox.getTags().add(tag);
        return cardBoxRepository.save(cardBox);
    }

    public void removeTagFromBox(Long cardBoxId, Long tagId) {
        CardBox cardBox = findCardBoxById(cardBoxId);
        Tag tag = tagService.removeCardBoxFromTag(tagId, cardBox);
        cardBox.getTags().remove(tag);
        cardBoxRepository.save(cardBox);
    }

    public List<CardBoxGetDTO> searchByTag(String tag) {
        return cardBoxRepository.searchCardBoxesByTag(tag)
                .stream()
                .map(getCardBoxMapper::toDto)
                .toList();
    }

    public List<CardBoxGetDTO> searchByTitle(String title) {
        return cardBoxRepository.searchCardBoxesByName(title)
                .stream()
                .map(getCardBoxMapper::toDto)
                .toList();
    }

    public List<CardBoxGetDTO> searchByTitleAndTag(String keyword) {
        return cardBoxRepository.searchCardBoxesByNameAndTag(keyword)
                .stream()
                .map(getCardBoxMapper::toDto)
                .toList();
    }

    public List<CardBoxGetDTO> getPublicCardBoxes() {
        return cardBoxRepository.findAllByPublic(true)
                .stream()
                .map(getCardBoxMapper::toDto)
                .toList();
    }

    public CardBoxGetDTO addCardsAndTags(Long cardBoxId, AddCardsAndTagsDTO dto) {
        CardBox box = cardBoxRepository.findById(cardBoxId)
                .orElseThrow(() -> new EntityNotFoundException("box"));
        dto.getCards().forEach(cardDto -> {
            addCardToBox(box.getId(), cardDto);
        });

        dto.getTagIds().forEach(tagId -> {
            addTagToBox(box.getId(), tagId);
        });

        return getCardBoxMapper.toDto(box);
    }

    public List<CardBoxGetDTO> getCardBoxesByIds(Set<Long> cardBoxIds) {
        return cardBoxIds.stream()
                .map(this::findCardBoxById)
                .map(getCardBoxMapper::toDto)
                .toList();
    }
}
