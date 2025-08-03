package javaweb.my_project.controller;

import jakarta.validation.Valid;
import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.dto.category.CategoryRequest;
import javaweb.my_project.dto.category.CategoryTreeNode;
import javaweb.my_project.dto.category.CategoryUpdateRequest;
import javaweb.my_project.entities.Category;
import javaweb.my_project.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> create(@RequestBody @Valid CategoryRequest request){
        ApiResponse<Category> apiResponse =  ApiResponse.<Category>builder()
                .code("category-s-01")
                .message("Create category successfully")
                .data(categoryService.create(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryTreeNode>>> getTree(){
        ApiResponse<List<CategoryTreeNode>> apiResponse =  ApiResponse.<List<CategoryTreeNode>>builder()
                .code("category-s-02")
                .message("Get category tre successfully")
                .data(categoryService.getTree())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> update(@PathVariable("id") String id,@RequestBody @Valid CategoryUpdateRequest request){
        ApiResponse<Category> apiResponse =  ApiResponse.<Category>builder()
                .code("category-s-03")
                .message("Update category successfully")
                .data(categoryService.update(id, request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") String id){
        categoryService.delete(id);
        ApiResponse<Void> apiResponse =  ApiResponse.<Void>builder()
                .code("category-s-04")
                .message("Delete category successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
