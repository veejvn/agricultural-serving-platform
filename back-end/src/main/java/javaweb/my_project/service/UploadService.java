package javaweb.my_project.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import javaweb.my_project.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UploadService {
    private final Cloudinary cloudinary;
    private final SecurityUtil securityUtil;

    @Value("${app.cloudinary.folder}")
    private String CLOUDINARY_FOLDER;

    private String getFolder(MultipartFile file) {
        String userId = securityUtil.getAccountId();
        String typeFolder = Objects.requireNonNull(file.getContentType()).startsWith("image/") ? "/images" : "/videos";
        return CLOUDINARY_FOLDER + "/" + userId + "/" + typeFolder;
    }

    public String uploadFile(MultipartFile image) throws IOException {
        String folder = getFolder(image); // Gọi hàm getFolder
        Map<String, Object> options = ObjectUtils.asMap("folder", folder);
        Map<String, Object> result = cloudinary.uploader().upload(image.getBytes(), options);
        return (String) result.get("secure_url"); // Trả về URL an toàn của file đã upload
    }

    public List<String> uploadFiles(MultipartFile[] images) throws IOException {
        List<String> urls = new ArrayList<>();
        for (MultipartFile image : images) {
            String folder = getFolder(image); // Gọi hàm getFolder
            Map<String, Object> options = ObjectUtils.asMap("folder", folder);
            Map<String, Object> result = cloudinary.uploader().upload(image.getBytes(), options);
            urls.add((String) result.get("secure_url")); // Lấy URL của ảnh và thêm vào danh sách
        }
        return urls;
    }

    public String uploadVideo(MultipartFile video) throws IOException {
        String folder = getFolder(video);
        Map<String, Object> options = ObjectUtils.asMap("resource_type", "video", "folder", folder);

        Map<String, Object> uploadResult = cloudinary.uploader().upload(video.getBytes(), options);
        return (String) uploadResult.get("secure_url"); // Trả về URL an toàn của video đã upload
    }

    public void deleteFile(String url) throws IOException {
        String userId = securityUtil.getAccountId();
        String[] urlParts = url.split("/");
        if (urlParts.length < 5) {
            throw new IllegalArgumentException("Invalid URL format");
        }
        String fileName = urlParts[urlParts.length - 1]; // Lấy tên tệp
        String type = urlParts[urlParts.length - 2]; // Lấy thư mục loại tệp (video hoặc images)
        String publicId;
        if ("images".equals(type)) {
            publicId = CLOUDINARY_FOLDER + "/" + userId + "/" + type + "/" + fileName.replaceFirst("\\.[^\\.]+$", ""); // Bỏ phần mở rộng
            System.out.println("Public ID to delete: " + publicId);
            Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            System.out.println("Delete result: " + result); // Ghi lại kết quả
        } else if ("videos".equals(type)) {
            publicId = CLOUDINARY_FOLDER + "/" + userId + "/" + type + "/" + fileName.replaceFirst("\\.[^\\.]+$", ""); // Bỏ phần mở rộng
            System.out.println("Public ID to delete: " + publicId);
            Map<String, Object> options = ObjectUtils.asMap("resource_type", "video");
            Map<String, Object> result = cloudinary.uploader().destroy(publicId, options);
            System.out.println("Delete result: " + result); // Ghi lại kết quả
        } else {
            throw new IllegalArgumentException("Invalid file type:  " + type);
        }
    }
}
