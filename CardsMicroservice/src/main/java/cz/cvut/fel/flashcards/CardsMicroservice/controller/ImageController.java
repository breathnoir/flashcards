package cz.cvut.fel.flashcards.CardsMicroservice.controller;

import cz.cvut.fel.flashcards.CardsMicroservice.entity.Image;
import cz.cvut.fel.flashcards.CardsMicroservice.service.ImageService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@AllArgsConstructor
public class ImageController {

    private final ImageService service;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Map<String,Long>> upload(@RequestPart MultipartFile file) throws IOException {
        Image img = service.save(file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", img.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        Image img = service.get(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(img.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + img.getFileName() + "\"")
                .body(img.getData());
    }
}
