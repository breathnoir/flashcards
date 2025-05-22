package cz.cvut.fel.flashcards.CardsMicroservice.util.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CardBoxPostDTO {

    @NotBlank(message = "title cannot be blank")
    private String title;

    @JsonProperty("isPublic")
    private boolean isPublic;

    private Long ownerId;

    private String description;
}
