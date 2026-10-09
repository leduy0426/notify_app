# Kế Hoạch Phát Triển Ứng Dụng Notify App (Expo - React Native)

## 🎯 Mục tiêu
Xây dựng ứng dụng đơn giản bằng React Native (Expo) có chức năng nhập văn bản, gửi thông báo nội bộ (Local Notification) và mở ứng dụng từ thông báo để cập nhật lại ô nhập dữ liệu.

---

## 📋 Chi tiết các bước thực hiện

### 1. Khởi tạo dự án Expo (Expo React Native)
- Khởi tạo cấu trúc dự án Expo trong thư mục hiện tại.
- Cấu hình file `package.json` và `app.json`.

### 2. Cài đặt các thư viện hỗ trợ
- Cài đặt `expo-notifications` để quản lý và gửi thông báo trên thiết bị di động (Android & iOS).
- Cài đặt `expo-device` (nếu cần) phục vụ việc kiểm tra và cấu hình kênh thông báo trên Android.

### 3. Cấu hình Quyền & Notification Handler
- Cấu hình `Notifications.setNotificationHandler` để thông báo có thể hiển thị kể cả khi ứng dụng đang chạy ở Foreground (tiền cảnh).
- Đăng ký xin quyền nhận thông báo từ người dùng (`Notifications.requestPermissionsAsync()`).
- Cấu hình Notification Channel đối với nền tảng Android.

### 4. Xây dựng Giao diện người dùng (UI)
- **TextInput**:
  - Giá trị mặc định khi khởi chạy ứng dụng là `"Name"`.
  - Cho phép người dùng chỉnh sửa nội dung văn bản.
- **Button (Notify)**:
  - Nút bấm có nhãn "Notify".
  - Thiết kế chỉn chu, hiện đại với hiệu ứng bấm mượt mà.

### 5. Xử lý chức năng Bắn thông báo (Local Notification)
- Khi người dùng bấm nút **Notify**:
  - Kiểm tra dữ liệu trong ô TextInput.
  - Sử dụng `Notifications.scheduleNotificationAsync` để gửi thông báo lập tức (`trigger: null`).
  - Đưa nội dung nhập vào phần `body` của thông báo cũng như truyền dữ liệu payload `data: { name: textValue }`.

### 6. Xử lý khi nhấn vào thông báo để mở lại Ứng dụng
- Khi ứng dụng thoát và mở lại thông thường: State của ô TextInput giữ giá trị mặc định là `"Name"`.
- Khi người dùng bấm vào thông báo:
  - Lắng nghe phản hồi từ thông báo bằng `Notifications.useLastNotificationResponse` hoặc `addNotificationResponseReceivedListener`.
  - Trích xuất thông tin `name` từ payload của thông báo.
  - Cập nhật lại state của ô TextInput bằng tên/nội dung thu được từ thông báo.

### 7. Kiểm thử & Xác nhận (Testing & Verification)
- Khởi chạy ứng dụng qua Expo (`npx expo start`).
- Kiểm tra kịch bản 1: Nhập chữ -> Bấm Notify -> Thông báo hiển thị trên điện thoại.
- Kiểm tra kịch bản 2: Mở ứng dụng bình thường -> Hiển thị "Name".
- Kiểm tra kịch bản 3: Chạm vào thông báo -> Ứng dụng mở ra và hiển thị nội dung nhập từ thông báo vào ô TextInput.
