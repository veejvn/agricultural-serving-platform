package javaweb.my_project.controller;

import jakarta.validation.Valid;
import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.dto.market_price.MarketPriceCreationRequest;
import javaweb.my_project.dto.market_price.MarketPriceResponse;
import javaweb.my_project.dto.market_price.MarketPriceUpdateRequest;
import javaweb.my_project.service.MarketPriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market-prices")
@RequiredArgsConstructor
public class MarketPriceController {
    private final MarketPriceService marketPriceService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MarketPriceResponse>> create(@RequestBody @Valid MarketPriceCreationRequest request) {
        ApiResponse<MarketPriceResponse> apiResponse = ApiResponse.<MarketPriceResponse>builder()
                .code("market-price-s-01")
                .message("Create market price successfully")
                .data(marketPriceService.create(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MarketPriceResponse>> getById(@RequestParam String id) {
        ApiResponse<MarketPriceResponse> apiResponse = ApiResponse.<MarketPriceResponse>builder()
                .code("market-price-s-02")
                .message("Get market price successfully")
                .data(marketPriceService.findById(id))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MarketPriceResponse>>> getAll() {
        ApiResponse<List<MarketPriceResponse>> apiResponse = ApiResponse.<List<MarketPriceResponse>>builder()
                .code("market-price-s-03")
                .message("Get all market prices successfully")
                .data(marketPriceService.findAll())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MarketPriceResponse>> updatePatch(@PathVariable String id,
                                                                        @RequestBody @Valid MarketPriceUpdateRequest request) {
        ApiResponse<MarketPriceResponse> apiResponse = ApiResponse.<MarketPriceResponse>builder()
                .code("market-price-s-04")
                .message("Update market price successfully")
                .data(marketPriceService.updatePatch(id, request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        marketPriceService.deleteById(id);
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code("market-price-s-05")
                .message("Delete market price successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
