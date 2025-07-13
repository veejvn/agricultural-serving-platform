package javaweb.my_project.controller;

import jakarta.validation.Valid;
import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.dto.api.PageResponse;
import javaweb.my_project.dto.product.*;
import javaweb.my_project.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ApiResponse<ProductResponse>> create(@RequestBody @Valid ProductRequest request){
        ApiResponse<ProductResponse> apiResponse =  ApiResponse.<ProductResponse>builder()
                .code("product-s-01")
                .message("Create product successfully")
                .data(productService.create(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductTagResponse>>> getAllActiveProduct(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        Page<ProductTagResponse> pagedProducts = productService.getAllActiveProduct(page, size);
        PageResponse<ProductTagResponse> pageResponseProduct = PageResponse.<ProductTagResponse>builder()
                .content(pagedProducts.getContent())
                .page(pagedProducts.getNumber())
                .totalPages(pagedProducts.getTotalPages())
                .totalElements(pagedProducts.getTotalElements())
                .build();
        ApiResponse<PageResponse<ProductTagResponse>> apiResponse =  ApiResponse.<PageResponse<ProductTagResponse>>builder()
                .code("product-s-02")
                .message("Get all product successfully")
                .data(pageResponseProduct)
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllByAdmin(){
        ApiResponse<List<ProductResponse>> apiResponse =  ApiResponse.<List<ProductResponse>>builder()
                .code("product-s-03")
                .message("Get all product successfully")
                .data(productService.getAllByAdmin())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/farmer")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllByFarmer(){
        ApiResponse<List<ProductResponse>> apiResponse =  ApiResponse.<List<ProductResponse>>builder()
                .code("product-s-04")
                .message("Get all product successfully")
                .data(productService.getAllByFarmer())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable String id){
        ApiResponse<ProductResponse> apiResponse =  ApiResponse.<ProductResponse>builder()
                .code("product-s-05")
                .message("Get product successfully")
                .data(productService.getById(id))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ApiResponse<ProductResponse>> update(@PathVariable String id, @RequestBody @Valid ProductUpdateRequest request){
        ApiResponse<ProductResponse> apiResponse =  ApiResponse.<ProductResponse>builder()
                .code("product-s-06")
                .message("Update product successfully")
                .data(productService.update(id, request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id){
        productService.delete(id);
        ApiResponse<Void> apiResponse =  ApiResponse.<Void>builder()
                .code("product-s-07")
                .message("Delete product successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping("/admin/change-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> adminChangeProductStatus(@RequestBody @Valid ChangeProductStatusRequest request){
        ApiResponse<ProductResponse> apiResponse =  ApiResponse.<ProductResponse>builder()
                .code("product-s-08")
                .message("Change product status successfully")
                .data(productService.adminChangeProductStatus(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
