import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";

const UploadService = {
  // Upload một ảnh
  uploadImage(image: File) {
    const formData = new FormData();
    formData.append("image", image);

    return service(
      axios.post(getApiUrl("/uploads/image"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      true
    );
  },

  // Upload nhiều ảnh
  uploadImages(images: File[]) {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    return service(
      axios.post(getApiUrl("/uploads/images"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      true
    );
  },

  // Upload video
  uploadVideo(video: File) {
    const formData = new FormData();
    formData.append("video", video);

    return service(
      axios.post(getApiUrl("/uploads/video"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      true
    );
  },

  // Xóa file
  deleteFile(fileUrl: string) {
    return service(
      axios.delete(getApiUrl("/uploads"), {
        params: {
          file_url: fileUrl,
        },
      }),
      true
    );
  },

  // Utility method - Kiểm tra file có phải là ảnh không
  isImageFile(file: File): boolean {
    const imageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    return imageTypes.includes(file.type);
  },

  // Utility method - Kiểm tra file có phải là video không
  isVideoFile(file: File): boolean {
    const videoTypes = [
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/flv",
    ];
    return videoTypes.includes(file.type);
  },

  // Utility method - Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Utility method - Kiểm tra kích thước file video (50MB)
  isValidVideoSize(file: File): boolean {
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    return file.size <= maxSize;
  },
};

export default UploadService;
