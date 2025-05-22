package cz.cvut.fel.flashcards.CardsMicroservice.util.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@AllArgsConstructor
@Getter
@Setter
public class CardBoxGetDTO {
    private Long id;
    private String title;
    private boolean isPublic;
    private String ownerUsername;
    private Set<TagGetDTO> tags;
    private String description;
}
