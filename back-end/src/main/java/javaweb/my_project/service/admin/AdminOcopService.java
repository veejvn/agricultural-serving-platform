package javaweb.my_project.service.admin;

import javaweb.my_project.dto.product.ProductResponse;
import javaweb.my_project.entities.Ocop;
import javaweb.my_project.entities.Product;
import javaweb.my_project.enums.OcopStatus;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.ProductMapper;
import javaweb.my_project.repository.ProductRepository;
import javaweb.my_project.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminOcopService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final SecurityUtil securityUtil;

    /**
     * Find product by ID or throw exception
     */
    private Product findProductById(String id) {
        return productRepository.findById(id).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Product not found", "product-e-01"));
    }

    @Transactional
    public List<ProductResponse> getPendingOcopProducts() {
        List<Product> products = productRepository.findByOcopStatus(OcopStatus.PENDING_VERIFY);
        return products.stream()
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse approveOcop(String productId) {
        Product product = findProductById(productId);
        Ocop ocop = product.getOcop();

        if (ocop == null) {
            throw new AppException(HttpStatus.NOT_FOUND, "OCOP information not found for this product", "ocop-e-02");
        }
        if (ocop.getStatus() != OcopStatus.PENDING_VERIFY) {
            throw new AppException(HttpStatus.BAD_REQUEST, "OCOP status is not PENDING_VERIFY", "ocop-e-04");
        }

        ocop.setStatus(OcopStatus.VERIFIED);
        ocop.setVerifiedBy(securityUtil.getAccountId()); // Using getAccountId() as getUserId() is unavailable
        ocop.setVerifiedAt(LocalDateTime.now());
        ocop.setReason(null); // Clear reason if previously rejected

        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    @Transactional
    public ProductResponse rejectOcop(String productId, String reason) {
        Product product = findProductById(productId);
        Ocop ocop = product.getOcop();

        if (ocop == null) {
            throw new AppException(HttpStatus.NOT_FOUND, "OCOP information not found for this product", "ocop-e-02");
        }
        if (ocop.getStatus() != OcopStatus.PENDING_VERIFY) {
            throw new AppException(HttpStatus.BAD_REQUEST, "OCOP status is not PENDING_VERIFY", "ocop-e-04");
        }

        ocop.setStatus(OcopStatus.REJECTED);
        ocop.setReason(reason);
        ocop.setVerifiedBy(securityUtil.getAccountId()); // Using getAccountId() as getUserId() is unavailable
        ocop.setVerifiedAt(LocalDateTime.now());

        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }
}
