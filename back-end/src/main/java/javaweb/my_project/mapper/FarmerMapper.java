package javaweb.my_project.mapper;

import javaweb.my_project.dto.farmer.FarmerUpdateInfoPutRequest;
import javaweb.my_project.dto.farmer.FarmerResponse;
import javaweb.my_project.entities.Farmer;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FarmerMapper {
    FarmerResponse toFarmerResponse(Farmer farmer);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "weatherInfo", ignore = true)
    @Mapping(target = "products", ignore = true)
    @Mapping(target = "orders", ignore = true)
    void updateFarmer(@MappingTarget Farmer farmer, FarmerUpdateInfoPutRequest request);

    List<FarmerResponse> toFarmerResponseList(List<Farmer> farmers);
}
