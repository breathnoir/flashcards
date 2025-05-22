package cz.cvut.fel.flashcards.CardsMicroservice.util.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class CardGetDTO {
    private Long id;

    private String question;

    private String answer;

    private Long questionImageId;

    private Long answerImageId;
}
