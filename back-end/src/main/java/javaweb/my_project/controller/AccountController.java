package javaweb.my_project.controller;

import jakarta.validation.Valid;
import javaweb.my_project.dto.account.AccountRequest;
import javaweb.my_project.dto.account.AccountResponse;
import javaweb.my_project.dto.account.DeleteAccountRequest;
import javaweb.my_project.dto.account.UpgradeToFarmerRequest;
import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.dto.farmer.FarmerResponse;
import javaweb.my_project.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<AccountResponse>> getAccount() {
        ApiResponse<AccountResponse> apiResponse = ApiResponse.<AccountResponse>builder()
                .code("account-s-01")
                .message("Get account successfully")
                .data(accountService.getAccount())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping
    public ResponseEntity<ApiResponse<AccountResponse>> updateAccount(@RequestBody @Valid AccountRequest request) {
        ApiResponse<AccountResponse> apiResponse = ApiResponse.<AccountResponse>builder()
                .code("account-s-02")
                .message("Update account successfully")
                .data(accountService.updateAccount(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping("/upgradeToFarmer")
    public ResponseEntity<ApiResponse<FarmerResponse>> upgradeToFarmer(
            @RequestBody @Valid UpgradeToFarmerRequest request) {
        ApiResponse<FarmerResponse> apiResponse = ApiResponse.<FarmerResponse>builder()
                .code("account-s-02")
                .message("Update account to farmer successfully")
                .data(accountService.upgradeToFarmer(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> delete(@RequestBody @Valid DeleteAccountRequest request) {
        accountService.delete(request);
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code("account-s-03")
                .message("Delete account successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccount() {
        ApiResponse<List<AccountResponse>> apiResponse = ApiResponse.<List<AccountResponse>>builder()
                .code("address-s-04")
                .message("Get all user successfully")
                .data(accountService.getAllAccount())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
