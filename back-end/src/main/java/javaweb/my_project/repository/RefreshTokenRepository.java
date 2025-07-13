package javaweb.my_project.repository;

import javaweb.my_project.entities.Account;
import javaweb.my_project.entities.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByAccountId(String userId);
    Optional<RefreshToken> findByAccount(Account account);
}
