# VICARE FAMILY

Prototype B2C theo dõi sức khỏe tại nhà, xây dựng bằng React 19 và Vite, dùng dữ liệu demo cục bộ.

## Chạy ứng dụng

```bash
npm install
npm run dev
```

Tạo bản build production:

```bash
npm run build
npm run preview
```

## Tài khoản demo

| Tài khoản | Mật khẩu | Hộ gia đình |
| --- | --- | --- |
| `admin1` | `123` | Family 01 |
| `admin2` | `123` | Family 02 |
| `admin3` | `123` | Family 03 |
| `admin4` | `123` | Family 04 |
| `admin5` | `123` | Family 05 |

Mỗi phiên đăng nhập chỉ đọc một bộ dữ liệu hộ gia đình trong `src/data/families.ts`. Dùng nút **Đăng xuất** để quay lại màn hình đăng nhập.

Trong ứng dụng, dùng nút **Quay lại** trên thanh đầu trang hoặc nhấn `Alt + ←` để trở về màn hình trước.

## Dữ liệu và camera

Các chỉ số và cảnh báo là dữ liệu mô phỏng phục vụ prototype, không dùng để chẩn đoán. Camera hồng ngoại phát clip IMVIA-NIR thang xám; camera nhiệt phát bản false-color từ cùng subject NIR bằng OpenCV2 `applyColorMap`. Mỗi hộ được gán một subject khác nhau trong tập IMVIA để tránh dùng lặp hình ảnh một người. Đây không phải dữ liệu đo nhiệt thực và không phải luồng camera trực tiếp. Video té ngã cũng là bản ghi minh họa.

Ngưỡng cảnh báo huyết áp từ 140/90 mmHg được dùng riêng cho tình huống mô phỏng. Cần nhân viên y tế đánh giá các số đo thực tế.
