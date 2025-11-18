package javaweb.my_project.util;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PasswordUtil {
    private final PasswordEncoder passwordEncoder;
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
