## Stage 1: Build ứng dụng Spring Boot với Maven
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
## Thiết lập thư mục làm việc
WORKDIR /app

## Copy file cấu hình Maven và mã nguồn
COPY pom.xml ./
COPY src ./src

## Build ứng dụng Spring Boot (tạo file JAR)
RUN mvn clean package -DskipTests

## Stage 2: Tạo image cuối cùng với JRE Alpine
FROM eclipse-temurin:21-jre-alpine

## Cài đặt timezone và các dependencies cần thiết
RUN apk add --no-cache tzdata

## Thiết lập thư mục làm việc trong container
WORKDIR /app

## Copy file JAR từ Stage 1 vào container
COPY --from=builder /app/target/*.jar app.jar

## Cấu hình JVM và biến môi trường
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV TZ=Asia/Ho_Chi_Minh

## Expose cổng 8080
EXPOSE 8080

## Lệnh khởi chạy ứng dụng với các tùy chọn JVM
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]