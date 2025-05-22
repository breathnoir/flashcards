package cz.cvut.fel.flashcards.UserMicroservice.util.exception;

public class DuplicateUserBoxException extends RuntimeException {
    public DuplicateUserBoxException(String message) {
        super(message);
    }
}
