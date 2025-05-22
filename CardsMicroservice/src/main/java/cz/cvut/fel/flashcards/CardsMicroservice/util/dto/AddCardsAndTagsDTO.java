package cz.cvut.fel.flashcards.CardsMicroservice.util.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AddCardsAndTagsDTO {
    private List<CardPostDTO> cards;
    private List<Long> tagIds;
}