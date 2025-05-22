package cz.cvut.fel.flashcards.CardsMicroservice.util.mapper;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.CardBox;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.CardBoxPostDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CardBoxMapper {
    CardBoxMapper INSTANCE = Mappers.getMapper(CardBoxMapper.class);

    CardBox toCardBox(CardBoxPostDTO cardBoxPostDTO);
    CardBoxPostDTO toCardBoxPostDTO(CardBox cardBox);

    static CardBoxMapper getInstance() { return INSTANCE; }
}
