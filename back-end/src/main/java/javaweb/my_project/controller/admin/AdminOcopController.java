package javaweb.my_project.controller.admin;

import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.dto.ocop.OcopRejectRequest;
import javaweb.my_project.dto.product.ProductResponse;
import javaweb.my_project.service.admin.AdminOcopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ocop")
@RequiredArgsConstructor
@PreAuthorize("hasRole(\"ADMIN\")")
public class AdminOcopController {
    private final AdminOcopService adminOcopService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllOcopProducts() {
        ApiResponse<List<ProductResponse>> apiResponse = ApiResponse.<List<ProductResponse>>builder()
                .code("admin-ocop-s-01")
                .message("Get all OCOP products successfully")
                .data(adminOcopService.getAllOcopProducts())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping("/{productId}/approve")
    public ResponseEntity<ApiResponse<ProductResponse>> approveOcop(@PathVariable String productId) {
        ApiResponse<ProductResponse> apiResponse = ApiResponse.<ProductResponse>builder()
                .code("admin-ocop-s-02")
                .message("OCOP approved successfully")
                .data(adminOcopService.approveOcop(productId))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping("/{productId}/reject")
    public ResponseEntity<ApiResponse<ProductResponse>> rejectOcop(@PathVariable String productId, @RequestBody OcopRejectRequest request) {
        ApiResponse<ProductResponse> apiResponse = ApiResponse.<ProductResponse>builder()
                .code("admin-ocop-s-03")
                .message("OCOP rejected successfully")
                .data(adminOcopService.rejectOcop(productId, request.getReason()))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
