package javaweb.my_project.repository;

import javaweb.my_project.entities.CartItem;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {
    Optional<CartItem> findByProductIdAndAccountId(String productId, String accountId);

    List<CartItem> findAllByAccountId(String accountId, Sort sort);
}
