package cz.cvut.fel.flashcards.CardsMicroservice.util.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CardPostDTO {
    private String answer;

    private String question;

    private Long questionImageId;

    private Long answerImageId;
}
