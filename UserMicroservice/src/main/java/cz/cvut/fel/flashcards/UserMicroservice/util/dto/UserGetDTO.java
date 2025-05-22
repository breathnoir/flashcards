package cz.cvut.fel.flashcards.UserMicroservice.util.dto;

import cz.cvut.fel.flashcards.UserMicroservice.util.UserRole;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserGetDTO {
    private Long id;

    private String username;

    private String email;

    private boolean isBanned;

    private UserRole role;
}
