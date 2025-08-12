package javaweb.my_project.mapper;

import javaweb.my_project.dto.farmer.FarmerUpdateInfoPutRequest;
import javaweb.my_project.dto.farmer.FarmerResponse;
import javaweb.my_project.entities.Farmer;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FarmerMapper {
    FarmerResponse toFarmerResponse(Farmer farmer);

    void updateFarmer(@MappingTarget Farmer farmer, FarmerUpdateInfoPutRequest request);

    List<FarmerResponse> toFarmerResponseList(List<Farmer> farmers);
}
