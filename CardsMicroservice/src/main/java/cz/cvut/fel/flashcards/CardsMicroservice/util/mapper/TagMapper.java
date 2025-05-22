package cz.cvut.fel.flashcards.CardsMicroservice.util.mapper;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.Tag;
import cz.cvut.fel.flashcards.CardsMicroservice.util.dto.TagPostDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TagMapper {
    TagMapper INSTANCE = Mappers.getMapper(TagMapper.class);

    Tag toTag(TagPostDTO tagPostDTO);
    TagPostDTO toTagPostDTO(Tag tag);

    static TagMapper getInstance() { return INSTANCE; }
}
