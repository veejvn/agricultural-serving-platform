package javaweb.my_project.exception;

import javaweb.my_project.dto.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.naming.AuthenticationException;
import java.nio.file.AccessDeniedException;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<Void>> handlingAppException(AppException e) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message(e.getMessage())
                .code(e.getCode())
                .build();
        return ResponseEntity.status(e.getStatus()).body(response);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<Void>> handlingMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError -> fieldError.getField().toUpperCase() + ": " + fieldError.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message(errorMessage)
                .code("global-e-02")
                .build();
        return ResponseEntity.status(400).body(response);
    }

    @ExceptionHandler(value = AuthenticationException.class)
    ResponseEntity<ApiResponse<Void>> handlingAuthenticationException(AuthenticationException e) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .code("auth-e-01")
                .message("Authentication failed: " + e.getMessage())
                .build();
        return ResponseEntity.status(401).body(response); // 401 Unauthorized
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse<Void>> handlingAccessDeniedException(AccessDeniedException e) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .code("auth-e-02")
                .message("Access denied: " + e.getMessage())
                .build();
        return ResponseEntity.status(403).body(response); // 403 Forbidden
    }

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<Void>> handlingException(Exception e) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .code("global-e-01")
                .message(e.getMessage())
                .build();
        return ResponseEntity.badRequest().body(response);
    }
}
