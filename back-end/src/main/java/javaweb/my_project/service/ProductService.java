package javaweb.my_project.service;

import javaweb.my_project.dto.ocop.OcopRequest;
import javaweb.my_project.dto.ocop.OcopUpdateRequest;
import javaweb.my_project.dto.product.*;
import javaweb.my_project.entities.*;
import javaweb.my_project.enums.OcopStatus;
import javaweb.my_project.enums.ProductStatus;
import javaweb.my_project.enums.Role;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.ProductMapper;
import javaweb.my_project.repository.CategoryRepository;
import javaweb.my_project.repository.ProductRepository;
import javaweb.my_project.repositories.OcopImageRepository;
import javaweb.my_project.repositories.OcopRepository;
import javaweb.my_project.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    private final OcopRepository ocopRepository;
    private final OcopImageRepository ocopImageRepository;

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
    }

    /**
     * Create OCOP and OcopImage entities from OcopRequest
     */
    private Ocop createOcopFromRequest(OcopRequest ocopRequest, Product product) {
        if (ocopRequest == null || !ocopRequest.getEnabled()) {
            return null;
        }

        // Validate required fields if OCOP is enabled
        // if (ocopRequest.getStar() == null || ocopRequest.getStar() < 3 ||
        // ocopRequest.getStar() > 5 ||
        // ocopRequest.getCertificateNumber() == null ||
        // ocopRequest.getCertificateNumber().isBlank() ||
        // ocopRequest.getIssuedYear() == null || ocopRequest.getIssuer() == null ||
        // ocopRequest.getIssuer().isBlank() ||
        // ocopRequest.getImagePaths() == null || ocopRequest.getImagePaths().isEmpty())
        // {
        // throw new AppException(HttpStatus.BAD_REQUEST,
        // "OCOP star, certificate number, issued year, issuer, and images are required
        // when OCOP is enabled", "ocop-e-01");
        // }

        Ocop ocop = Ocop.builder()
                .star(ocopRequest.getStar())
                .certificateNumber(ocopRequest.getCertificateNumber())
                .issuedYear(ocopRequest.getIssuedYear())
                .issuer(ocopRequest.getIssuer())
                .status(OcopStatus.PENDING_VERIFY)
                .product(product)
                .build();

        Set<OcopImage> ocopImages = new HashSet<>();
        for (String imagePath : ocopRequest.getImagePaths()) {
            OcopImage ocopImage = OcopImage.builder()
                    .url(imagePath)
                    .ocop(ocop)
                    .build();
            ocopImages.add(ocopImage);
        }
        ocop.setImages(ocopImages);

        return ocop;
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Farmer farmer = securityUtil.getFarmer();
        Category category = findCategoryById(request.getCategoryId());

        Product product = productMapper.toProduct(request);
        product.setFarmer(farmer);
        product.setCategory(category);

        // Handle product images
        Set<Image> images = createImagesFromPaths(request.getImagePaths(), product);
        product.setImages(images);

        // Handle OCOP
        Ocop ocop = createOcopFromRequest(request.getOcopRequest(), product);
        if (ocop != null) {
            product.setOcop(ocop);
        }

        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    /**
     * Update OCOP information for a product (only allowed if status is REJECTED)
     */
    @Transactional
    public ProductResponse updateOcop(String productId, OcopUpdateRequest request) {
        Product product = findProductById(productId);
        validateProductOwnership(product);

        Ocop ocop = product.getOcop();
        if (ocop == null) {
            throw new AppException(HttpStatus.NOT_FOUND, "OCOP information not found for this product", "ocop-e-02");
        }

        if (ocop.getStatus() != OcopStatus.REJECTED) {
            throw new AppException(HttpStatus.FORBIDDEN,
                    "OCOP information can only be updated if its status is REJECTED", "ocop-e-03");
        }

        // Update OCOP fields
        ocop.setStar(request.getStar());
        ocop.setCertificateNumber(request.getCertificateNumber());
        ocop.setIssuedYear(request.getIssuedYear());
        ocop.setIssuer(request.getIssuer());
        ocop.setStatus(OcopStatus.PENDING_VERIFY);

        // Update OCOP images
        Set<OcopImage> currentOcopImages = ocop.getImages();
        Set<String> newOcopImagePaths = request.getImagePaths();

        // Remove images not in the new request
        currentOcopImages.removeIf(image -> !newOcopImagePaths.contains(image.getUrl()));

        // Add new images
        Set<String> existingOcopImageUrls = currentOcopImages.stream().map(OcopImage::getUrl)
                .collect(Collectors.toSet());
        for (String newImagePath : newOcopImagePaths) {
            if (!existingOcopImageUrls.contains(newImagePath)) {
                OcopImage newOcopImage = OcopImage.builder()
                        .url(newImagePath)
                        .ocop(ocop)
                        .build();
                currentOcopImages.add(newOcopImage);
            }
        }
        ocop.setImages(currentOcopImages);

        ocopRepository.save(ocop);
        productRepository.save(product); // Cascade should save ocop, but good to be explicit

        return productMapper.toProductResponse(product);
    }

    public List<ProductResponse> getAllByAdmin() {
        List<Product> products = productRepository.findAll(Sort.by("createdAt").descending());
        return productMapper.toListProductResponse(products);
    }

    public List<ProductResponse> getAllByFarmer() {
        String farmerId = securityUtil.getFarmerId();
        List<Product> products = productRepository.findAllByFarmerIdAndStatusNot(farmerId,
                ProductStatus.DELETED,
                Sort.by("createdAt").descending());
        return productMapper.toListProductResponse(products);
    }

    public List<ProductResponse> getAllByFarmerId(String farmerId) {
        if (farmerId == null || farmerId.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Farmer ID cannot be null or empty", "farmer-e-01");
        }
        List<Product> products = productRepository.findAllByFarmerIdAndStatusNot(farmerId,
                ProductStatus.DELETED,
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

        try {
            Account account = securityUtil.getAccount();
            Set<Role> roles = account.getRoles();

            if (roles.contains(Role.ADMIN)) {
                return productMapper.toProductResponse(product);
            }

            if (roles.contains(Role.FARMER)) {
                if (product.getStatus() == ProductStatus.DELETED) {
                    throw new AppException(HttpStatus.FORBIDDEN,
                            "You don't have permission to access this product", "product-e-03");
                }
                return productMapper.toProductResponse(product);
            }
        } catch (AppException e) {
            if (!"auth-e-00".equals(e.getCode())) {
                throw e;
            }
        }

        // Default for CONSUMER or unauthenticated
        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new AppException(HttpStatus.FORBIDDEN,
                    "You don't have permission to access this product", "product-e-03");
        }

        return productMapper.toProductResponse(product);
    }

    public List<ProductNameResponse> getProductNames() {
        List<Product> products = productRepository.findAllByStatus(ProductStatus.ACTIVE, Sort.by("name").descending());
        return productMapper.toListProductNameResponse(products);
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
        product.setDeletedAt(LocalDateTime.now());
        productRepository.save(product);
    }

    @Transactional
    public ProductResponse changeProductStatus(ChangeProductStatusRequest request) {
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

    @Transactional
    public ProductResponse changeProductStatusByAdmin(ChangeProductStatusRequest request) {
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
