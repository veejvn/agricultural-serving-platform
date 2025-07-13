package javaweb.my_project.repository;

import javaweb.my_project.entities.Order;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findAllByAccountId(String accountId, Sort sort);

    List<Order> findAllByFarmerId(String farmerId, Sort sort);
}
