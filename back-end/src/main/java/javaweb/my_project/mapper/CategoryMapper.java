package javaweb.my_project.mapper;

import javaweb.my_project.dto.category.CategoryRequest;
import javaweb.my_project.dto.category.CategoryTreeNode;
import javaweb.my_project.entities.Category;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "level", ignore = true)
    Category toCategory(CategoryRequest request);

    @Mapping(target = "children", ignore = true)
    CategoryTreeNode toCategoryTreeNode(Category category);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "level", ignore = true)
    void updateCategory(@MappingTarget Category category, CategoryRequest request);
}
