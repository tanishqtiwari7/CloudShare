# 🌩️ CloudShare - Secure File Sharing Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.org/)
[![MinIO](https://img.shields.io/badge/MinIO-Object%20Storage-red.svg)](https://min.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment-blue.svg)](https://razorpay.com/)

## 📋 Overview

CloudShare is a secure file sharing platform built with Spring Boot that allows users to upload, manage, and share files with anyone. The platform features a credit-based system, JWT authentication, and MinIO object storage.

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT Token Authentication** - Secure login system
- **Email Verification** - Account activation via email links
- **Password Reset & Change** - Complete password management
- **Secure Access Control** - Protected endpoints

### 📁 File Management
- **Multi-file Upload** - Upload multiple files simultaneously
- **MinIO Object Storage** - Scalable, cloud-ready file storage
- **File Privacy Controls** - Toggle between private and public
- **Share with Anyone** - Generate public links for easy sharing
- **Direct Downloads** - Download files with original names
- **File Deletion** - Remove files instantly

### 💰 Credit System
- **Credit-based Usage** - 1 credit per file upload
- **Razorpay Payment Integration** - Buy credits securely
- **Credit Tracking** - Monitor remaining credits

### 🔗 File Sharing
- **Public File Links** - Share files with anyone via simple links
- **Anonymous Downloads** - No login required for public files
- **Privacy Toggle** - Switch between private and public instantly

## 🏗️ Tech Stack
- **Backend**: Spring Boot 3.x
- **Database**: MySQL + JPA
- **Storage**: MinIO Object Storage
- **Authentication**: JWT + Spring Security
- **Payment**: Razorpay Integration
- **Email**: Spring Mail

## 📚 API Endpoints

### Authentication
```http
POST /api/auth/register          # Register new user
POST /api/auth/login             # Login user
POST /api/auth/verify-email      # Verify email
POST /api/auth/forgot-password   # Request password reset
POST /api/auth/reset-password    # Reset password
PUT  /api/auth/change-password   # Change password
```

### File Management
```http
POST   /files/upload             # Upload files (requires credits)
GET    /files/my                 # Get user's files
GET    /files/public/{id}        # Get public file info
GET    /files/download/{id}      # Download file (public access)
DELETE /files/delete/{id}        # Delete file
PATCH  /files/{id}/toggle-public # Make file public/private
```

### Payments
```http
POST /api/payments/create-order  # Create payment order
POST /api/payments/verify        # Verify payment
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- MinIO Server

### Quick Setup

1. **Clone & Setup Database**
```bash
git clone https://github.com/Surendra1341/CloudShare.git
cd CloudShare

# Create MySQL database
CREATE DATABASE cloudshare;
```

2. **Start MinIO**
```bash
# Download and start MinIO
./minio server /data --console-address ":9001"
```

3. **Configure Application**
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/cloudshare
spring.datasource.username=your_username
spring.datasource.password=your_password

minio.endpoint=http://localhost:9000
minio.access-key=minioadmin
minio.secret-key=minioadmin
minio.bucket-name=cloudshare-files

jwt.secret=your-jwt-secret
razorpay.key.id=your-razorpay-key-id
razorpay.key.secret=your-razorpay-secret
```

4. **Run Application**
```bash
mvn spring-boot:run
```

Access API at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

## 💡 How It Works

### File Upload & Sharing Flow
1. **Register/Login** → Get JWT token
2. **Buy Credits** → Use Razorpay to purchase upload credits
3. **Upload Files** → Upload multiple files (consumes credits)
4. **Make Public** → Toggle file privacy to public
5. **Share Link** → Anyone can download using the file ID

### Example Usage
```bash
# Upload files
curl -X POST "localhost:8080/files/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf" \
  -F "file=@image.jpg"

# Make file public
curl -X PATCH "localhost:8080/files/{fileId}/toggle-public" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Share this link with anyone:
http://localhost:8080/files/download/{fileId}
```

## 🔒 Security Features
- JWT-based authentication
- Email verification system
- Password encryption (BCrypt)
- Secure file access controls
- Input validation & sanitization

## 🤝 Contributing
1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 👨‍💻 Author
**Surendra** - [GitHub](https://github.com/Surendra1341)

---
⭐ **Star this repo if you find it useful!**
