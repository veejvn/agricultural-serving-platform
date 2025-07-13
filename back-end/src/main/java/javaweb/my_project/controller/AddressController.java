package javaweb.my_project.controller;

import jakarta.validation.Valid;
import javaweb.my_project.dto.address.AddressRequest;
import javaweb.my_project.dto.address.AddressResponse;
import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponse>> create(@RequestBody @Valid AddressRequest request){
        ApiResponse<AddressResponse> apiResponse = ApiResponse.<AddressResponse>builder()
                .code("address-s-01")
                .message("Create address successfully")
                .data(addressService.create(request))
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressResponse>> get(@PathVariable String id){
        ApiResponse<AddressResponse> apiResponse = ApiResponse.<AddressResponse>builder()
                .code("address-s-02")
                .message("Get address successfully")
                .data(addressService.get(id))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAll(){
        ApiResponse<List<AddressResponse>> apiResponse = ApiResponse.<List<AddressResponse>>builder()
                .code("address-s-03")
                .message("Get addresses successfully")
                .data(addressService.getAll())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressResponse>> update(@PathVariable String id, @RequestBody @Valid AddressRequest request){
        ApiResponse<AddressResponse> apiResponse = ApiResponse.<AddressResponse>builder()
                .code("address-s-04")
                .message("Update address successfully")
                .data(addressService.update(id, request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/isDefault/{id}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateIsDefault(@PathVariable String id){
        ApiResponse<AddressResponse> apiResponse = ApiResponse.<AddressResponse>builder()
                .code("address-s-05")
                .message("Update default address successfully")
                .data(addressService.updateIsDefault(id))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id){
        addressService.delete(id);
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code("address-s-06")
                .message("Delete address successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
