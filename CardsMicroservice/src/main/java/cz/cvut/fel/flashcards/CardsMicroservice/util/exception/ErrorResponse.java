package cz.cvut.fel.flashcards.CardsMicroservice.util.exception;

import java.time.LocalDateTime;

public record ErrorResponse(
        int status,
        String message,
        LocalDateTime timestamp
) {
}
