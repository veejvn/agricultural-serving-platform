package javaweb.my_project.controller;

import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {
    private final UploadService uploadService;

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<String>> uploadFile(@RequestParam("image") MultipartFile image) {
        try {
            String imageUrl = uploadService.uploadFile(image);
            ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                    .success(true)
                    .code("upload-s-01")
                    .message("Upload successfully!")
                    .data(imageUrl)
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (IOException e) {
            ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                    .success(false)
                    .code("upload-e-01")
                    .message("Upload failed!")
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }

    @PostMapping("/images")
    public ResponseEntity<ApiResponse<List<String>>> uploadFiles(@RequestParam("images") MultipartFile[] images) {
        try {
            List<String> imageUrls = uploadService.uploadFiles(images);
            ApiResponse<List<String>> apiResponse = ApiResponse.<List<String>>builder()
                    .success(true)
                    .code("upload-s-02")
                    .message("Upload successfully!")
                    .data(imageUrls)
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (IOException e) {
            ApiResponse<List<String>> apiResponse = ApiResponse.<List<String>>builder()
                    .success(false)
                    .code("upload-e-02")
                    .message("Upload failed!")
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }

    @PostMapping("/video")
    public ResponseEntity<ApiResponse<String>> uploadVideo(@RequestParam("video") MultipartFile video) {
        if (video.getSize() > 50 * 1024 * 1024) { // MB -> bit
            ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                    .success(false)
                    .code("upload-e-03")
                    .message("File size must be less 50MB")
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);

        }
        try {
            String videoUrl = uploadService.uploadVideo(video);
            ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                    .success(true)
                    .code("upload-s-03")
                    .message("Video upload successful")
                    .data(videoUrl)
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (IOException e) {
            ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                    .success(false)
                    .code("upload-e-04")
                    .message("Video upload failed!")
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> deleteFile(@RequestParam("file_url") String fileUrl) {
        try {
            uploadService.deleteFile(fileUrl);
            System.out.println("URL: " + fileUrl);
            ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                    .success(true)
                    .code("upload-s-04")
                    .message("File deleted successfully!")
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (IOException e) {
            ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                    .success(false)
                    .code("upload-e-05")
                    .message("File deletion failed!")
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }
}
