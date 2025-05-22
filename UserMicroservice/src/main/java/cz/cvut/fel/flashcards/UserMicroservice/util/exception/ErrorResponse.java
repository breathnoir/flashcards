package cz.cvut.fel.flashcards.UserMicroservice.util.exception;

import java.time.LocalDateTime;

public record ErrorResponse(
        int status,
        String message,
        LocalDateTime timestamp
) {
}
