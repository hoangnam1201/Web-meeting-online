# KHOA ĐÀO TẠO CHẤT LƯỢNG CAO

# TIỂU LUẬN CHUYÊN NGÀNH (HK 1 năm 2021-2022)

**Đề tài**: Tìm hiểu website remo.co và xây dựng website họp nhóm, học tập và làm việc trực tuyến
Công nghệ sử dụng: MERN Stack

**Các chức năng chính**:

- Đăng ký, đăng nhập, chỉnh sửa profile
- Quản lý phòng họp
- Chat
- Sử dụng microphone, camera
- Thuyết trình
- ...

**Thành viên (hệ CLC Tieng Viet)**:

Lê Hoàng Nam 18110160

Vũ Thanh Lâm 18110142

**Thông tin liên lạc**:

SĐT: 0789687961

Email: lehoangnam1201@gmail.com

FB: https://www.facebook.com/hoangnam22

**GVHD**: TS. Huỳnh Xuân Phụng

## CÁCH CÀI ĐẶT

- clone project

---

git clone https://github.com/hoangnam1201/Web-meeting-online.git

---

### BACK-END

- project backend nằm trong thư mục meetingbe

---

cd meetingbe

---

- khi mở file .env bạn sẽ thấy các thông tin \
  PORT: cổng sẽ chạy project be \
  HOST_DB: địa chỉ máy chủ database, localhost là địa chỉ local của máy bạn \
  ACCESS_TOKEN_SECRET: key để mã hóa/giải mã token \
  ACCESS_TOKEN_LIFE: Thời gian sống của token \
- Chạy các lệnh sau để run project ở local

---

npm install
npm start

---

- Nếu muốn build docker image thì chạy lênh sau

---

docker build -t <username>/<imagename>:<tag> .

---

- Run docker image

---

docker run -p 3002:3002 <username>/<imagename>:<tag>

---

### FRONT_END

- project backend nằm trong thư mục fe

---

cd fe

---

- Ở trong các file /src/api/instaceAxios.js và /src/serices/connection.js, sẽ thấy các địa chỉ của backend bạn có thể thay đổi nếu khác địa chỉ backend. Trong trường hợp backend chạy ở local ở port 3002 thì không cần thay đổi.
- Chạy các lệnh sau để run project ở local

---

npm install
npm start

---

- Nếu muốn build docker image thì chạy lênh sau

---

docker build -t <username>/<imagename>:<tag> .

---

- Run docker image

---

docker run -p 3000:3000 <username>/<imagename>:<tag>

---
