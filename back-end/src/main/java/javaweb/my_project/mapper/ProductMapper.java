package javaweb.my_project.mapper;

import javaweb.my_project.dto.image.ImageResponse;
import javaweb.my_project.dto.product.ProductRequest;
import javaweb.my_project.dto.product.ProductResponse;
import javaweb.my_project.dto.product.ProductTagResponse;
import javaweb.my_project.dto.product.ProductUpdateRequest;
import javaweb.my_project.entities.Image;
import javaweb.my_project.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toProduct(ProductRequest request);

    Set<ImageResponse> toImageResponse(Set<Image> images);

    @Mapping(source = "category.name", target = "category")
    ProductResponse toProductResponse(Product product);

    @Mapping(source = "category.id", target = "categoryId")
    ProductTagResponse toProductTagResponse(Product product);

    void updateProduct(@MappingTarget Product product, ProductUpdateRequest request);

    List<ProductResponse> toListProductResponse(List<Product> products);
}
