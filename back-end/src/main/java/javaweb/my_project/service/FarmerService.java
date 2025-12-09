package javaweb.my_project.service;

import javaweb.my_project.dto.address.AddressRequest;
import javaweb.my_project.dto.address.AddressResponse;
import javaweb.my_project.dto.farmer.ChangeFarmerStatusRequest;
import javaweb.my_project.dto.farmer.FarmerUpdateInfoPatchRequest;
import javaweb.my_project.dto.farmer.FarmerUpdateInfoPutRequest;
import javaweb.my_project.dto.farmer.FarmerResponse;
import javaweb.my_project.entities.Address;
import javaweb.my_project.entities.Farmer;
import javaweb.my_project.enums.FarmerStatus;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.AddressMapper;
import javaweb.my_project.mapper.FarmerMapper;
import javaweb.my_project.repository.AddressRepository;
import javaweb.my_project.repository.FarmerRepository;
import javaweb.my_project.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FarmerService {

    private final SecurityUtil securityUtil;
    private final FarmerRepository farmerRepository;
    private final FarmerMapper farmerMapper;
    private final AddressMapper addressMapper;
    private final AddressRepository addressRepository;

    public FarmerResponse getFarmer(String id) {
        Farmer farmer = farmerRepository.findById(id).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Farmer not found", "farmer-e-01"));
        return farmerMapper.toFarmerResponse(farmer);
    }

    public FarmerResponse getFarmerByOwner() {
        Farmer farmer = securityUtil.getFarmer();
        return farmerMapper.toFarmerResponse(farmer);
    }

    public List<FarmerResponse> getAllFarmers() {
        List<Farmer> farmers = farmerRepository.findAll();
        return farmerMapper.toFarmerResponseList(farmers);
    }

    public FarmerResponse createAddress(AddressRequest request) {
        Farmer farmer = securityUtil.getFarmer();

        if (farmer.getAddress() != null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Farmer already has an address", "farmer-e-07");
        }

        Address address = addressMapper.toAddress(request);
        address.setIsDefault(true);
        address.setAccount(farmer.getAccount()); // Link to account for consistency, though not strictly used for farmer address
        Address savedAddress = addressRepository.save(address);

        farmer.setAddress(savedAddress);
        farmerRepository.save(farmer);

        return farmerMapper.toFarmerResponse(farmer);
    }

    public AddressResponse updateAddress(String addressId, AddressRequest request) {
        Farmer farmer = securityUtil.getFarmer();

        if (farmer.getAddress() == null || !Objects.equals(farmer.getAddress().getId(), addressId)) {
            throw new AppException(HttpStatus.NOT_FOUND, "Farmer's address not found or not owned by farmer", "farmer-e-08");
        }

        Address address = farmer.getAddress();
        addressMapper.updateAddress(address, request);
        address.setIsDefault(true); // Farmer's address is always default
        Address updatedAddress = addressRepository.save(address);

        return addressMapper.toAddressResponse(updatedAddress);
    }

    public void deleteAddress(String addressId) {
        Farmer farmer = securityUtil.getFarmer();

        if (farmer.getAddress() == null || !Objects.equals(farmer.getAddress().getId(), addressId)) {
            throw new AppException(HttpStatus.NOT_FOUND, "Farmer's address not found or not owned by farmer", "farmer-e-09");
        }

        Address addressToDelete = farmer.getAddress();
        farmer.setAddress(null);
        farmerRepository.save(farmer);
        addressRepository.delete(addressToDelete);
    }

    public FarmerResponse updateFarmerInfoPut(FarmerUpdateInfoPutRequest request) {
        Farmer farmer = securityUtil.getFarmer();
        farmerMapper.updateFarmer(farmer, request);
        farmerRepository.save(farmer);
        return farmerMapper.toFarmerResponse(farmer);
    }

    public FarmerResponse updateFarmerInfoPatch(FarmerUpdateInfoPatchRequest request) {
        Farmer farmer = securityUtil.getFarmer();
        if (request.getName() != null) {
            farmer.setName(request.getName());
        }
        if (request.getAvatar() != null) {
            farmer.setAvatar(request.getAvatar());
        }
        if (request.getCoverImage() != null) {
            farmer.setCoverImage(request.getCoverImage());
        }
        if (request.getDescription() != null) {
            farmer.setDescription(request.getDescription());
        }
        farmerRepository.save(farmer);
        return farmerMapper.toFarmerResponse(farmer);
    }

    public FarmerResponse changeFarmerStatus(String farmerId, ChangeFarmerStatusRequest request) {
        Farmer farmer = farmerRepository.findById(farmerId).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Farmer not found", "farmer-e-01"));

        Set<FarmerStatus> allowedStatuses = Set.of(
                FarmerStatus.ACTIVE,
                FarmerStatus.SELF_BLOCK,
                FarmerStatus.ADMIN_BLOCK
        );

        if (!allowedStatuses.contains(request.getStatus())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Invalid farmer status", "farmer-e-02");
        }
        farmer.setStatus(request.getStatus());
        farmerRepository.save(farmer);
        return farmerMapper.toFarmerResponse(farmer);
    }
}
