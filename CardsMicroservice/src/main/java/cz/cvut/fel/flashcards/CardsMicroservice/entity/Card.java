package cz.cvut.fel.flashcards.CardsMicroservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Card {
    @Id
    @GeneratedValue
    private Long id;

    private String answer;

    private String question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private CardBox cardBox;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JoinColumn(name = "question_image_id")
    private Image questionImage;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JoinColumn(name = "answer_image_id")
    private Image answerImage;
}
