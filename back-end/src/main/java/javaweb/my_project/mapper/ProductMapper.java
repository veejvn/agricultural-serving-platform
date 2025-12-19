package javaweb.my_project.mapper;

import javaweb.my_project.dto.image.ImageResponse;
import javaweb.my_project.dto.product.*;
import javaweb.my_project.entities.Image;
import javaweb.my_project.entities.Product;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "sold", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "marketPrices", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    @Mapping(target = "cartItems", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "farmer", ignore = true)
    Product toProduct(ProductRequest request);

    Set<ImageResponse> toImageResponse(Set<Image> images);

    @Mapping(source = "category.name", target = "category")
    ProductResponse toProductResponse(Product product);

    @Mapping(source = "category.id", target = "categoryId")
    ProductTagResponse toProductTagResponse(Product product);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "sold", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "marketPrices", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    @Mapping(target = "cartItems", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "farmer", ignore = true)
    void updateProduct(@MappingTarget Product product, ProductUpdateRequest request);

    List<ProductResponse> toListProductResponse(List<Product> products);

    List <ProductNameResponse> toListProductNameResponse(List<Product> products);
}
