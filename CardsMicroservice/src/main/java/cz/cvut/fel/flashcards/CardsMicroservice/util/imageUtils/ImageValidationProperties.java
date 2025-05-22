package cz.cvut.fel.flashcards.CardsMicroservice.util.imageUtils;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "cards.images")
@Getter
@Setter
public class ImageValidationProperties {
    private long   maxSizeBytes;
    private List<String> allowedContentTypes = List.of();
}
