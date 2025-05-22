package cz.cvut.fel.flashcards.UserMicroservice.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserUtil {

    private Authentication getAuth() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public Long getUserId() {
        return (Long) getAuth().getDetails();
    }

    public String getRole() {
        return getAuth().getAuthorities().toString();
    }
}
