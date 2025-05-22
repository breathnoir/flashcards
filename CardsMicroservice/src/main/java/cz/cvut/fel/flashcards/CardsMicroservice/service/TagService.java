package cz.cvut.fel.flashcards.CardsMicroservice.service;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.CardBox;
import cz.cvut.fel.flashcards.CardsMicroservice.entity.Tag;
import cz.cvut.fel.flashcards.CardsMicroservice.repository.TagRepository;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.TagGetDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.mapper.GetCardBoxMapper;
import cz.cvut.fel.flashcards.CardsMicroservice.util.mapper.TagMapper;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.TagPostDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.exception.DuplicateTagException;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final GetCardBoxMapper getCardBoxMapper;

    public Tag createTag(TagPostDTO tag) {
        if (tagRepository.existsByTagName(tag.getTagName())) {
            throw new DuplicateTagException("Tag with this name already exists: " + tag.getTagName());
        }
        return tagRepository.save(TagMapper.getInstance().toTag(tag));
    }

    public Tag getTagById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found with id: " + id));
    }

    public Tag updateTag(Long id, TagPostDTO updatedTag) {
        if (tagRepository.existsByTagName(updatedTag.getTagName())) {
            throw new DuplicateTagException("Tag with this name already exists: " + updatedTag.getTagName());
        }
        Tag existingTag = getTagById(id);
        existingTag.setTagName(updatedTag.getTagName());
        existingTag.setColor(updatedTag.getColor());
//        existingTag.setCardBoxes(updatedTag.getCardBoxes());
        return tagRepository.save(existingTag);
    }

    public void deleteTag(Long id) {
        Tag tag = getTagById(id);
        tagRepository.delete(tag);
    }

    public Tag addCardBoxToTag(Long tagId, CardBox cardBox) {
        Tag tag = getTagById(tagId);
        tag.getCardBoxes().add(cardBox);
        return tagRepository.save(tag);
    }

    public Tag removeCardBoxFromTag(Long tagId, CardBox cardBox) {
        Tag tag = getTagById(tagId);
        tag.getCardBoxes().remove(cardBox);
        return tagRepository.save(tag);
    }

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public List<TagGetDTO> searchByName(String name) {
        return tagRepository.searchByName(name).stream()
                .map(getCardBoxMapper::toTagGetDto)
                .toList();
    }

    public List<TagGetDTO> getTagsByCardBoxId(Long cardboxId) {
        return tagRepository.getTagsByCardBoxId(cardboxId);
    }
}
