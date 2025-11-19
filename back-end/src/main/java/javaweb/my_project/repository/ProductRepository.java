package javaweb.my_project.repository;

import javaweb.my_project.entities.Product;
import javaweb.my_project.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    List<Product> findAllByFarmerIdAndStatusNot(String farmerId, ProductStatus status, Sort sort);

    List<Product> findAllByStatus(ProductStatus status, Sort sort);
}
