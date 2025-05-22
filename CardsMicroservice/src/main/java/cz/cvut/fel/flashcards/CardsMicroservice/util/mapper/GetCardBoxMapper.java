package cz.cvut.fel.flashcards.CardsMicroservice.util.mapper;


import cz.cvut.fel.flashcards.CardsMicroservice.entity.CardBox;
import cz.cvut.fel.flashcards.CardsMicroservice.entity.Tag;
import cz.cvut.fel.flashcards.CardsMicroservice.feign.UserClient;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardBoxGetDTO;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.TagGetDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class GetCardBoxMapper {

    private final UserClient userClient;

    public CardBoxGetDTO toDto(CardBox entity) {

        String username = userClient.getUsername(entity.getOwnerId());

        Set<TagGetDTO> tagDtos = entity.getTags().stream()
                .map(this::toTagGetDto)
                .collect(Collectors.toSet());

        return new CardBoxGetDTO(
                entity.getId(),
                entity.getTitle(),
                entity.isPublic(),
                username,
                tagDtos,
                entity.getDescription());
    }

    public TagGetDTO toTagGetDto(Tag entity) {
        return new TagGetDTO(entity.getId(), entity.getTagName(), entity.getColor(), entity.getTextColor());
    }
}
