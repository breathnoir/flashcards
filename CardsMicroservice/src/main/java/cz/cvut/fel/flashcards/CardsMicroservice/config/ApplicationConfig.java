package cz.cvut.fel.flashcards.CardsMicroservice.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

public class ApplicationConfig {
    @Component
    public static class RestAuthEntryPoint implements AuthenticationEntryPoint {

        @Override
        public void commence(HttpServletRequest request,
                             HttpServletResponse response,
                             AuthenticationException ex) throws IOException {

            response.setStatus(HttpStatus.UNAUTHORIZED.value());     // 401
            response.setContentType("application/json;charset=UTF-8");
            String body = """
            { "error": "Unauthorized - please log in again" }
            """;
            response.getWriter().write(body);
        }
    }
}
