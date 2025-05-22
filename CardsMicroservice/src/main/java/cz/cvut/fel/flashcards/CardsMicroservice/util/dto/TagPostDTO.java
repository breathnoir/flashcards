package cz.cvut.fel.flashcards.CardsMicroservice.util.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TagPostDTO {
    @NotBlank(message = "title cannot be blank")
    private String tagName;

    private String color;

    private String textColor;
}
