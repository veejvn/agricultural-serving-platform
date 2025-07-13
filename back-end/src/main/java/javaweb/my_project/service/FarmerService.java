package javaweb.my_project.service;

import javaweb.my_project.dto.farmer.FarmerRequest;
import javaweb.my_project.dto.farmer.FarmerResponse;
import javaweb.my_project.entities.Farmer;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.FarmerMapper;
import javaweb.my_project.repository.FarmerRepository;
import javaweb.my_project.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FarmerService {

    private final SecurityUtil securityUtil;
    private final FarmerRepository farmerRepository;
    private final FarmerMapper farmerMapper;

    public FarmerResponse getFarmer(String id){
        Farmer farmer = farmerRepository.findById(id).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Farmer not found", "farmer-e-01")
        );
        return farmerMapper.toFarmerResponse(farmer);
    }

    public FarmerResponse getFarmerByOwner(){
        Farmer farmer = securityUtil.getFarmer();
        return farmerMapper.toFarmerResponse(farmer);
    }

    public FarmerResponse updateFarmerInfo(FarmerRequest request){
        Farmer farmer = securityUtil.getFarmer();
        farmerMapper.updateFarmer(farmer, request);
        farmerRepository.save(farmer);
        return farmerMapper.toFarmerResponse(farmer);
    }
}
