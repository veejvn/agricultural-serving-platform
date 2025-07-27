package javaweb.my_project.service;

import javaweb.my_project.dto.product.*;
import javaweb.my_project.entities.Category;
import javaweb.my_project.entities.Farmer;
import javaweb.my_project.entities.Image;
import javaweb.my_project.entities.Product;
import javaweb.my_project.enums.ProductStatus;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.ProductMapper;
import javaweb.my_project.repository.CategoryRepository;
import javaweb.my_project.repository.ProductRepository;
import javaweb.my_project.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final SecurityUtil securityUtil;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    /**
     * Validate if current farmer owns the product
     */
    private void validateProductOwnership(Product product) {
        String currentFarmerId = securityUtil.getFarmerId();
        if (!product.getFarmer().getId().equals(currentFarmerId)) {
            throw new AppException(HttpStatus.FORBIDDEN,
                    "You don't have permission to access this product", "product-e-03");
        }
    }

    /**
     * Find product by ID or throw exception
     */
    private Product findProductById(String id) {
        return productRepository.findById(id).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Product not found", "product-e-01"));
    }

    /**
     * Find category by ID or throw exception
     */
    private Category findCategoryById(String categoryId) {
        return categoryRepository.findById(categoryId).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Category not found", "category-e-02"));
    }

    /**
     * Create images from image paths
     */
    private Set<Image> createImagesFromPaths(Set<String> imagePaths, Product product) {
        Set<Image> images = new HashSet<>();
        if (imagePaths != null && !imagePaths.isEmpty()) {
            for (String imagePath : imagePaths) {
                Image image = Image.builder()
                        .path(imagePath)
                        .product(product)
                        .build();
                images.add(image);
            }
        }
        return images;
    }

    /**
     * Update product images intelligently:
     * - Add new images (in request but not in current images)
     * - Keep existing images (in both request and current images)
     * - Remove images not in request (in current images but not in request)
     */
    private void updateProductImages(Product product, Set<String> newImagePaths) {
        if (newImagePaths == null) {
            return; // No changes to images
        }

        // Get current image paths
        Set<String> currentImagePaths = product.getImages().stream()
                .map(Image::getPath)
                .collect(Collectors.toSet());

        // Find images to remove (current - new)
        Set<String> imagesToRemove = new HashSet<>(currentImagePaths);
        imagesToRemove.removeAll(newImagePaths);

        // Find images to add (new - current)
        Set<String> imagesToAdd = new HashSet<>(newImagePaths);
        imagesToAdd.removeAll(currentImagePaths);

        // Remove images that are no longer needed
        if (!imagesToRemove.isEmpty()) {
            product.getImages().removeIf(image -> imagesToRemove.contains(image.getPath()));
        }

        // Add new images
        if (!imagesToAdd.isEmpty()) {
            for (String imagePath : imagesToAdd) {
                Image newImage = Image.builder()
                        .path(imagePath)
                        .product(product)
                        .build();
                product.getImages().add(newImage);
            }
        }

        // Optional: Log the changes for debugging
        // System.out.println("Images added: " + imagesToAdd.size() + ", Images removed:
        // " + imagesToRemove.size());
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Farmer farmer = securityUtil.getFarmer();
        Category category = findCategoryById(request.getCategoryId());

        Product product = productMapper.toProduct(request);
        product.setFarmer(farmer);
        product.setCategory(category);

        // Handle images
        Set<Image> images = createImagesFromPaths(request.getImagePaths(), product);
        product.setImages(images);

        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    public List<ProductResponse> getAllByAdmin() {
        List<Product> products = productRepository.findAll();
        return productMapper.toListProductResponse(products);
    }

    public List<ProductResponse> getAllByFarmer() {
        String farmerId = securityUtil.getFarmerId();
        List<Product> products = productRepository.findAllByFarmerIdAndStatusNot(farmerId, ProductStatus.DELETED,
                Sort.by("createdAt").descending());
        return productMapper.toListProductResponse(products);
    }

    public Page<ProductTagResponse> getAllActiveProduct(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("rating").descending());
        Page<Product> productPage = productRepository.findByStatus(ProductStatus.ACTIVE, pageable);
        return productPage.map(productMapper::toProductTagResponse);
    }

    public ProductResponse getById(String id) {
        Product product = findProductById(id);
        return productMapper.toProductResponse(product);
    }

    @Transactional
    public ProductResponse update(String id, ProductUpdateRequest request) {
        // Find product and validate ownership
        Product product = findProductById(id);
        validateProductOwnership(product);

        // Validate category
        Category category = findCategoryById(request.getCategoryId());

        // Update product basic information
        productMapper.updateProduct(product, request);
        product.setCategory(category);

        // Intelligently update images
        updateProductImages(product, request.getImagePaths());

        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    @Transactional
    public void delete(String id) {
        Product product = findProductById(id);
        validateProductOwnership(product);

        product.setStatus(ProductStatus.DELETED);
        productRepository.save(product);
    }

    @Transactional
    public ProductResponse adminChangeProductStatus(ChangeProductStatusRequest request) {
        Product product = findProductById(request.getId());

        Set<ProductStatus> allowedStatuses = Set.of(
                ProductStatus.ACTIVE,
                ProductStatus.REJECTED,
                ProductStatus.BLOCKED);

        ProductStatus newStatus = request.getStatus();
        if (!allowedStatuses.contains(newStatus)) {
            throw new AppException(HttpStatus.FORBIDDEN,
                    "You don't have permission to change product to this status.", "product-e-02");
        }

        product.setStatus(newStatus);
        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }
}
