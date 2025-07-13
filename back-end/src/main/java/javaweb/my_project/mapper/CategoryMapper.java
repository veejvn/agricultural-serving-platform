package javaweb.my_project.mapper;

import javaweb.my_project.dto.category.CategoryRequest;
import javaweb.my_project.dto.category.CategoryTreeNode;
import javaweb.my_project.entities.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toCategory(CategoryRequest request);

    CategoryTreeNode toCategoryTreeNode(Category category);

    void updateCategory(@MappingTarget Category category, CategoryRequest request);
}
