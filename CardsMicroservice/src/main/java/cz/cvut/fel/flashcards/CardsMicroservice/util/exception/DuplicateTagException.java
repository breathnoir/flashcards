package cz.cvut.fel.flashcards.CardsMicroservice.util.exception;

public class DuplicateTagException extends RuntimeException {
    public DuplicateTagException(String message) {
        super(message);
    }
}
