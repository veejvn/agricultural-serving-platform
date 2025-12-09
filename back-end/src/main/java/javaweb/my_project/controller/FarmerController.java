package javaweb.my_project.controller;

import jakarta.validation.Valid;
import javaweb.my_project.dto.address.AddressRequest;
import javaweb.my_project.dto.address.AddressResponse;
import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.dto.farmer.ChangeFarmerStatusRequest;
import javaweb.my_project.dto.farmer.FarmerUpdateInfoPatchRequest;
import javaweb.my_project.dto.farmer.FarmerUpdateInfoPutRequest;
import javaweb.my_project.dto.farmer.FarmerResponse;
import javaweb.my_project.service.FarmerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers") // Đã giữ nguyên /api/farmers
@RequiredArgsConstructor
//@PreAuthorize("authenticated()")
public class FarmerController {
    private final FarmerService farmerService;

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<FarmerResponse>> getFarmer(@PathVariable("id") String id) {
        ApiResponse<FarmerResponse> apiResponse = ApiResponse.<FarmerResponse>builder()
                .code("farmer-s-01")
                .message("Get farmer successfully")
                .data(farmerService.getFarmer(id))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole(\'FARMER\')")
    public ResponseEntity<ApiResponse<FarmerResponse>> getFarmerByOwner() {
        ApiResponse<FarmerResponse> apiResponse = ApiResponse.<FarmerResponse>builder()
                .code("farmer-s-02")
                .message("Get farmer by owner successfully")
                .data(farmerService.getFarmerByOwner())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping
    @PreAuthorize("hasRole(\'ADMIN\')")
    public ResponseEntity<ApiResponse<List<FarmerResponse>>> getAllFarmers() {
        ApiResponse<List<FarmerResponse>> apiResponse = ApiResponse.<List<FarmerResponse>>builder()
                .code("farmer-s-03")
                .message("Get all farmers successfully")
                .data(farmerService.getAllFarmers())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    // New endpoints for Farmer Address Management
    @PostMapping("/address")
    @PreAuthorize("hasRole(\'FARMER\')")
    public ResponseEntity<ApiResponse<FarmerResponse>> createAddress(@RequestBody @Valid AddressRequest request) {
        ApiResponse<FarmerResponse> apiResponse = ApiResponse.<FarmerResponse>builder()
                .code("farmer-s-07")
                .message("Create farmer address successfully")
                .data(farmerService.createAddress(request))
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @PatchMapping("/address/{id}")
    @PreAuthorize("hasRole(\'FARMER\')")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(@PathVariable("id") String addressId, @RequestBody @Valid AddressRequest request) {
        ApiResponse<AddressResponse> apiResponse = ApiResponse.<AddressResponse>builder()
                .code("farmer-s-08")
                .message("Update farmer address successfully")
                .data(farmerService.updateAddress(addressId, request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping("/address/{id}")
    @PreAuthorize("hasRole(\'FARMER\')")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable("id") String addressId) {
        farmerService.deleteAddress(addressId);
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code("farmer-s-09")
                .message("Delete farmer address successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping
    @PreAuthorize("hasRole(\'FARMER\')")
    public ResponseEntity<ApiResponse<FarmerResponse>> updateFarmerInfoPut(
            @RequestBody @Valid FarmerUpdateInfoPutRequest request) {
        ApiResponse<FarmerResponse> apiResponse = ApiResponse.<FarmerResponse>builder()
                .code("farmer-s-04")
                .message("Update farmer successfully")
                .data(farmerService.updateFarmerInfoPut(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PatchMapping
    @PreAuthorize("hasRole(\'FARMER\')")
    public ResponseEntity<ApiResponse<FarmerResponse>> updateFarmerInfoPatch(
            @RequestBody @Valid FarmerUpdateInfoPatchRequest request) {
        ApiResponse<FarmerResponse> apiResponse = ApiResponse.<FarmerResponse>builder()
                .code("farmer-s-05")
                .message("Update farmer successfully")
                .data(farmerService.updateFarmerInfoPatch(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping("/{id}/status" )
    @PreAuthorize("hasRole(\'ADMIN\') or hasRole(\'FARMER\')")
    public ResponseEntity<ApiResponse<FarmerResponse>> changeFarmerStatus(
            @PathVariable("id") String farmerId,
            @RequestBody @Valid ChangeFarmerStatusRequest request) {
        ApiResponse<FarmerResponse> apiResponse = ApiResponse.<FarmerResponse>builder()
                .code("farmer-s-06")
                .message("Change farmer status successfully")
                .data(farmerService.changeFarmerStatus(farmerId, request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
