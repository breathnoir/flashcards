package cz.cvut.fel.flashcards.CardsMicroservice.service;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.Image;
import cz.cvut.fel.flashcards.CardsMicroservice.repository.ImageRepository;
import cz.cvut.fel.flashcards.CardsMicroservice.util.imageUtils.ImageValidator;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@AllArgsConstructor
public class ImageService {

    private final ImageRepository repo;
    private final ImageValidator validator;

    public Image save(MultipartFile file) throws IOException {
        validator.validate(file);

        Image img = new Image();
        img.setFileName(file.getOriginalFilename());
        img.setContentType(file.getContentType());
        img.setSize(file.getSize());
        img.setData(file.getBytes());
        return repo.save(img);
    }

    public Image get(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Image not found id=" + id));
    }
}
