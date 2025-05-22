package cz.cvut.fel.flashcards.UserMicroservice.util.exception;

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }
}
