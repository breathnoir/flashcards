package cz.cvut.fel.flashcards.CardsMicroservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        value = "user-microservice",
        url  = "${user.service.url}"
)
public interface UserClient {
    @GetMapping("/api/users/username/{id}")
    String getUsername(@PathVariable Long id);
}
