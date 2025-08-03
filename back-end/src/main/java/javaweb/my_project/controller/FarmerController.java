package javaweb.my_project.controller;

import jakarta.validation.Valid;
import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.dto.farmer.FarmerRequest;
import javaweb.my_project.dto.farmer.FarmerResponse;
import javaweb.my_project.service.FarmerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmers")
@RequiredArgsConstructor
@PreAuthorize("authenticated()")
public class FarmerController {
    private final FarmerService farmerService;

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<FarmerResponse>> getFarmer(@PathVariable("id") String id){
        ApiResponse<FarmerResponse> apiResponse =  ApiResponse.<FarmerResponse>builder()
                .code("farmer-s-01")
                .message("Get farmer successfully")
                .data(farmerService.getFarmer(id))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ApiResponse<FarmerResponse>> getFarmerByOwner(){
        ApiResponse<FarmerResponse> apiResponse =  ApiResponse.<FarmerResponse>builder()
                .code("farmer-s-02")
                .message("Get farmer by owner successfully")
                .data(farmerService.getFarmerByOwner())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ApiResponse<FarmerResponse>> updateFarmerInfo(@RequestBody @Valid FarmerRequest request){
        ApiResponse<FarmerResponse> apiResponse =  ApiResponse.<FarmerResponse>builder()
                .code("farmer-s-03")
                .message("Update farmer successfully")
                .data(farmerService.updateFarmerInfo(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
