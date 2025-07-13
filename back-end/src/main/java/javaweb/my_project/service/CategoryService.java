package javaweb.my_project.service;

import javaweb.my_project.dto.category.CategoryRequest;
import javaweb.my_project.dto.category.CategoryTreeNode;
import javaweb.my_project.dto.category.CategoryUpdateRequest;
import javaweb.my_project.entities.Category;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.CategoryMapper;
import javaweb.my_project.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public Category create(CategoryRequest request){
        Category category = categoryMapper.toCategory(request);
        if(request.getParentId() != null){
            Category categoryParent = categoryRepository.findById(request.getParentId()).orElseThrow(
                    () -> new AppException(HttpStatus.NOT_FOUND, "Parent category not found", "category-e-01")
            );
            category.setLevel(categoryParent.getLevel() +  1);
        }else {
            category.setLevel(0);
        }
        return categoryRepository.save(category);
    }

    public List<CategoryTreeNode> buildTree(List<Category> categories){
        Map<String, CategoryTreeNode> categoryMap = new HashMap<>();
        List<CategoryTreeNode> tree = new ArrayList<>();
        for (Category category : categories){
            CategoryTreeNode node = categoryMapper.toCategoryTreeNode(category);
            categoryMap.put(category.getId(), node);
        }
        for (CategoryTreeNode node: categoryMap.values()){
            if(node.getParentId() == null){
                tree.add(node);
            }else {
                CategoryTreeNode parentNode = categoryMap.get(node.getParentId());
                if (parentNode != null){
                    parentNode.getChildren().add(node);
                }
            }
        }
        return tree;
    }

    public List<CategoryTreeNode> getTree(){
        List<Category> categories = categoryRepository.findAll();
        return buildTree(categories);
    }

    public Category update(String id, CategoryUpdateRequest request){
        Category category = categoryRepository.findById(id).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Category not found", "category-e-02")
        );
        category.setName(request.getName());
        return categoryRepository.save(category);
    }

    public void delete(String id){
        Category category = categoryRepository.findById(id).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Category not found", "category-e-02")
        );
        List<Category> childCategory = categoryRepository.findAllByParentId(id);
        categoryRepository.deleteAll(childCategory);
        categoryRepository.delete(category);
    }
}
