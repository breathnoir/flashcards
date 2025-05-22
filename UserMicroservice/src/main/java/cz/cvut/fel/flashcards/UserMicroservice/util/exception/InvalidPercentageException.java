package cz.cvut.fel.flashcards.UserMicroservice.util.exception;

public class InvalidPercentageException extends RuntimeException {
    public InvalidPercentageException(String message) {
        super(message);
    }
}
