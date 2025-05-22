package cz.cvut.fel.flashcards.UserMicroservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table (uniqueConstraints = { @UniqueConstraint(columnNames = {"card_box_id", "user_id"}) })
public class UserBox {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @Column(name = "card_box_id", nullable = false)
    private Long cardBoxId;

    @ColumnDefault(value = "0.0")
    private double successPercentage;
}
