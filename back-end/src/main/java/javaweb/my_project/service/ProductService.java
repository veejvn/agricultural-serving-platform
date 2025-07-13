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

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final SecurityUtil securityUtil;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public ProductResponse create(ProductRequest request){
        Farmer farmer = securityUtil.getFarmer();
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Category not found", "category-e-02")
        );
        Product product = productMapper.toProduct(request);
        product.setFarmer(farmer);
        product.setCategory(category);
        Set<Image> images = new HashSet<>();
        if(request.getImagePaths() != null) {
            for (String imagePath : request.getImagePaths()) {
                Image image = Image.builder().path(imagePath).product(product).build();
                images.add(image);
            }
        }
        product.setImages(images);
        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    public List<ProductResponse> getAllByAdmin(){
        List<Product> products = productRepository.findAll();
        return productMapper.toListProductResponse(products);
    }

    public List<ProductResponse> getAllByFarmer(){
        String farmerId = securityUtil.getFarmerId();
        List<Product> products = productRepository.findAllByFarmerIdAndStatusNot(farmerId, ProductStatus.DELETED, Sort.by("createdAt").descending());
        return productMapper.toListProductResponse(products);
    }

    public Page<ProductTagResponse> getAllActiveProduct(int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by("rating").descending());
        Page<Product> productPage = productRepository.findByStatus(ProductStatus.ACTIVE, pageable);
        return productPage.map(productMapper::toProductTagResponse);
    }

    public ProductResponse getById(String id){
        Product product = productRepository.findById(id).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Product not found", "product-e-01")
        );
        return productMapper.toProductResponse(product);
    }

    public ProductResponse update(String id, ProductUpdateRequest request){
        Product product = productRepository.findById(id).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Product not found", "product-e-01")
        );
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Category not found", "category-e-02")
        );
        productMapper.updateProduct(product, request);
        if(request.getImagePaths() != null) {
            for (String imagePath : request.getImagePaths()) {
                Image image = Image.builder().path(imagePath).product(product).build();
                product.getImages().add(image);
            }
        }
        product.setCategory(category);
        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    public void delete(String id){
        Product product = productRepository.findById(id).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Product not found", "product-e-01")
        );
        product.setStatus(ProductStatus.DELETED);
        productRepository.save(product);
    }

    public ProductResponse adminChangeProductStatus(ChangeProductStatusRequest request){
        Product product = productRepository.findById(request.getId()).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Product not found", "product-e-01")
        );
        Set<ProductStatus> statuses = Set.of(
                ProductStatus.ACTIVE,
                ProductStatus.REJECTED,
                ProductStatus.BLOCKED
        );
        ProductStatus status = request.getStatus();
        if(!statuses.contains(status)){
            throw new AppException(HttpStatus.FORBIDDEN, "You don't have permission to edit product to this status.", "product-e-02");
        }
        product.setStatus(status);
        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }
}
