package javaweb.my_project.config;

import javaweb.my_project.entities.Account;
import javaweb.my_project.enums.Role;
import javaweb.my_project.repository.AccountRepository;
import javaweb.my_project.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.EnumSet;
import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class InitAppConfig {
    @Value("${app.admin.email}")
    private String ADMIN_EMAIL;

    @Value("${app.admin.password}")
    private String ADMIN_PASSWORD;

    private final AccountRepository accountRepository;
    private final PasswordUtil passwordUtil;

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            boolean isExistedAdmin = accountRepository.existsByEmail(ADMIN_EMAIL);
            if (isExistedAdmin) return;
            Set<Role> roles = EnumSet.allOf(Role.class);
            Account admin = Account.builder()
                    .email(ADMIN_EMAIL)
                    .displayName("Admin")
                    .password(passwordUtil.encodePassword(ADMIN_PASSWORD))
                    .roles(roles)
                    .build();
            accountRepository.save(admin);
        };
    }
}
