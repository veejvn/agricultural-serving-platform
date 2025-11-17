package javaweb.my_project.controller;

import jakarta.validation.Valid;
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
@RequestMapping("/api/farmers")
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
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ApiResponse<FarmerResponse>> getFarmerByOwner() {
        ApiResponse<FarmerResponse> apiResponse = ApiResponse.<FarmerResponse>builder()
                .code("farmer-s-02")
                .message("Get farmer by owner successfully")
                .data(farmerService.getFarmerByOwner())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FarmerResponse>>> getAllFarmers() {
        ApiResponse<List<FarmerResponse>> apiResponse = ApiResponse.<List<FarmerResponse>>builder()
                .code("farmer-s-03")
                .message("Get all farmers successfully")
                .data(farmerService.getAllFarmers())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping
    @PreAuthorize("hasRole('FARMER')")
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
    @PreAuthorize("hasRole('FARMER')")
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('FARMER')")
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
