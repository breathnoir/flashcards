package cz.cvut.fel.flashcards.UserMicroservice.util.dto;

import cz.cvut.fel.flashcards.UserMicroservice.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    User toUser(UserRegistrationDTO registrationDTO);
    UserRegistrationDTO toUserRegistrationDTO(User user);
    UserGetDTO toUserGetDTO(User user);

    static UserMapper getInstance() {
        return INSTANCE;
    }
}
