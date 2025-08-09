package javaweb.my_project.repository;

import javaweb.my_project.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    boolean existsByEmail(String email);

    Optional<Account> findByEmail(String email);

    @Modifying
    @Query(value = "DELETE FROM account WHERE id = :accountId", nativeQuery = true)
    void deleteAccountById(@Param("accountId") String accountId);
}
