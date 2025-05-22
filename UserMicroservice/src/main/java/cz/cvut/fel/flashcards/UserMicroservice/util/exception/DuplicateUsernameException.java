package cz.cvut.fel.flashcards.UserMicroservice.util.exception;

public class DuplicateUsernameException extends RuntimeException {
    public DuplicateUsernameException(String message) {
        super(message);
    }
}
