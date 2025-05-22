package cz.cvut.fel.flashcards.CardsMicroservice.util.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class TagGetDTO {
    private Long id;
    private String tagName;
    private String color;
    private String textColor;
}
