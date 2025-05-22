package cz.cvut.fel.flashcards.UserMicroservice.util.dto;

import cz.cvut.fel.flashcards.UserMicroservice.util.UserRole;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserLoginDTO {
    @NotBlank(message = "username cannot be blank")
    private String username;
    private String password;

}
