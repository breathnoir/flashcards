package cz.cvut.fel.flashcards.CardsMicroservice.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
public class CardBox {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;

    @ColumnDefault(value = "false")
    @JsonProperty("isPublic")
    private boolean isPublic;

    @OneToMany(fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonManagedReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Card> cards = new HashSet<>();

    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "cardBoxes")
    private Set<Tag> tags = new HashSet<>();

    @Column(nullable = false)
    private Long ownerId;

    private String description;
}
