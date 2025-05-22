package cz.cvut.fel.flashcards.CardsMicroservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Image {

    @Id
    @GeneratedValue
    private Long id;

    private String fileName;
    private String contentType;
    private Long size;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] data;
}
