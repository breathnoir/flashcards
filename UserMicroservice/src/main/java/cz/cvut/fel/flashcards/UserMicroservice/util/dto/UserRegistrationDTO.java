package cz.cvut.fel.flashcards.UserMicroservice.util.dto;

import cz.cvut.fel.flashcards.UserMicroservice.util.UserRole;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserRegistrationDTO {
    @NotBlank(message = "username cannot be blank")
    private String username;
    @NotBlank(message = "email cannot be blank")
    private String email;
    @NotBlank(message = "password cannot be blank")
    private String password;
    private UserRole role;
}
