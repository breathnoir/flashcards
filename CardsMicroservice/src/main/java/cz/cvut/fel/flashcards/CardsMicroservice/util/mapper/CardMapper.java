package cz.cvut.fel.flashcards.CardsMicroservice.util.mapper;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.Card;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardPostDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CardMapper {
    CardMapper INSTANCE = Mappers.getMapper(CardMapper.class);

    Card toCard(CardPostDTO cardPostDTO);
    CardPostDTO toCardPostDTO(Card card);

    static CardMapper getInstance() { return INSTANCE; }
}
