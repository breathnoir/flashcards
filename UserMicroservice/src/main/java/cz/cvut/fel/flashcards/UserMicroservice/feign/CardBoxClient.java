package cz.cvut.fel.flashcards.UserMicroservice.feign;

import cz.cvut.fel.flashcards.UserMicroservice.util.dto.CardBoxGetDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "cards-microservice", url = "${cards.service.url}")
public interface CardBoxClient {
    @GetMapping("/api/cardboxes/{id}")
    CardBoxGetDTO getCardBoxById(@PathVariable("id") Long cardBoxId);
}
