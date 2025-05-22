package cz.cvut.fel.flashcards.CardsMicroservice.util.imageUtils;

import cz.cvut.fel.flashcards.CardsMicroservice.util.exception.InvalidImageException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.io.IOException;

@Component
@AllArgsConstructor
public class ImageValidator {

    private final ImageValidationProperties props;

    public void validate(MultipartFile file) throws InvalidImageException {

        if (file.getSize() > props.getMaxSizeBytes())
            throw new InvalidImageException("Image too large (max "
                    + (props.getMaxSizeBytes()/1024) + " KB)");


        if (!props.getAllowedContentTypes().contains(file.getContentType()))
            throw new InvalidImageException("Unsupported type " + file.getContentType());

        try (var in = file.getInputStream()) {
            if (ImageIO.read(in) == null)
                throw new InvalidImageException("File content is not a valid image");
        } catch (IOException e) {
            throw new InvalidImageException("Cannot read image");
        }
    }
}

