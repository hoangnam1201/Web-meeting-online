# KHOA ĐÀO TẠO CHẤT LƯỢNG CAO

# TIỂU LUẬN CHUYÊN NGÀNH (HK 1 năm 2021-2022)

**Đề tài**: Tìm hiểu website remo.co và xây dựng website họp nhóm, học tập và làm việc trực tuyến \

**Công nghệ sử dụng**: MERN Stack

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

```

git clone https://github.com/hoangnam1201/Web-meeting-online.git

```

### Database

- Có thể tải về từ https://docs.mongodb.com/manual/installation/
- Hoặc tải mongo container về sử dụng

```
docker pull mongo:latest
docker run --name mongodb -d -p 27017:27017 -v YOUR_LOCAL_DIR:/data/db mongo
```

### BACK-END

- project backend nằm trong thư mục meetingbe

```
cd meetingBe
```

- khi mở file .env bạn sẽ thấy các thông tin \
  PORT: cổng sẽ chạy project be \
  HOST_DB: địa chỉ máy chủ database, localhost là địa chỉ local của máy bạn \
  ACCESS_TOKEN_SECRET: key để mã hóa/giải mã token \
  ACCESS_TOKEN_LIFE: Thời gian sống của token \
- Chạy các lệnh sau để run project ở local

```
npm install
npm start
```

- Nếu muốn build docker image thì chạy lênh sau

```
docker build -t <username>/<imagename>:<tag> .
```

- Run docker image

```
docker run -p 3002:3002 <username>/<imagename>:<tag>
```

### FRONT_END

- project backend nằm trong thư mục fe

```
cd fe
```

- Ở trong các file /src/api/instaceAxios.js và /src/serices/connection.js, sẽ thấy các địa chỉ của backend bạn có thể thay đổi nếu khác địa chỉ backend. Trong trường hợp backend chạy ở local ở port 3002 thì không cần thay đổi.
- Chạy các lệnh sau để run project ở local

```
npm install
npm start
```

- Nếu muốn build docker image thì chạy lênh sau

```
docker build -t <username>/<imagename>:<tag> .
```

- Run docker image

```
docker run -p 3000:3000 <username>/<imagename>:<tag>
```

## CÁCH DEPLOY LÊN EC2 AWS

### DATABASE

- vào instance chứa database
- pull mongodb container

```
docker pull mongo:latest
docker run --name mongodb -d -p 27017:27017 -v YOUR_LOCAL_DIR:/data/db mongo
```

- Mở port 27017 của instance cho backend truy cập

### BACKEND

Mở file .env trong folder meetingBe \
 đổi địa chỉ database thành địa chỉ Private IPv4 của database: **mongodb://<IPv4Address>:27017/meetingdb** (lưu ý nếu be và database cùng 1 máy ảo thì địa chỉ là 127.0.0.1)
Build docker image:

```
  docker build -t <username>/<image-name>:<tag> .
```

Push docker image lên docker hub:

```
  docker push <username>/<image-name>:<tag>
```

Kết nối vào máy ảo chứa backend
Pull backend project image:

```
docker pull <username>/<image-name>:<tag>

```

Chạy image backend (port bằng 3002 tại vì trong file .env đã cấu hình sẽ chạy ở port 3002):

```
docker run -p 3002:3002 <username>/<image-name>:<tag>
```

### FRONTEND

#### Cài đặt và cấu hình nginx

Install and enable NGINX

```
sudo apt install nginx -y
sudo systemctl enable nginx
```

Di chuyển đến '/etc/nginx/sites-available'

```
cd /etc/nginx/sites-available
```

Copy file default sang một file mới

```
sudo cp default mydomain
```

ghi nội dung sau vào file mydomain

```
server {
        listen 80;
        listen [::]:80;

        root /home/ubuntu/apps/yelp-app/client/build

        server_name utemeeting.online www.utemeeting.online;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

         location /api {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

         location /peerjs {
            proxy_pass http://<backendAddress>:3002;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

         location /socket {
            proxy_pass http://<backendAddress>:3002;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
}
```

khởi động lại nginx

```
sudo ln -s /etc/nginx/sites-available/sanjeev.xyz /etc/nginx/sites-enabled/
systemctl restart ngin
```

#### Enable Firewall

```
sudo ufw status
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

#### Enable SSL bằng Encrypt

Install

```
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

Cài đặt tính chỉ

```
sudo certbot --nginx
```