package javaweb.my_project.controller.admin;

import javaweb.my_project.dto.api.ApiResponse;
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

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getPendingOcopProducts() {
        ApiResponse<List<ProductResponse>> apiResponse = ApiResponse.<List<ProductResponse>>builder()
                .code("admin-ocop-s-01")
                .message("Get pending OCOP products successfully")
                .data(adminOcopService.getPendingOcopProducts())
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
    public ResponseEntity<ApiResponse<ProductResponse>> rejectOcop(@PathVariable String productId, @RequestBody String reason) {
        ApiResponse<ProductResponse> apiResponse = ApiResponse.<ProductResponse>builder()
                .code("admin-ocop-s-03")
                .message("OCOP rejected successfully")
                .data(adminOcopService.rejectOcop(productId, reason))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
