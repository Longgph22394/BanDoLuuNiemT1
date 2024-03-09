var app = angular.module("app", []);
app.controller("registerController", function ($scope, $http, $window) {
  $scope.taikhoan = "";
  $scope.email = "";
  $scope.matkhau = "";
  $scope.chucvu = 2;

  $scope.authenticate = function () {
    var authenticationData = {
      taikhoan: $scope.taikhoan,
      matkhau: $scope.matkhau,
    };

    // Gửi yêu cầu POST đến API localhost:8080/ban/hang/login
    $http.post("http://localhost:8080/ban/hang/login", authenticationData)
      .then(function (response) {
        console.log("Đăng nhập thành công:", response.data);

        // Lưu AccessToken vào localStorage
        var accessToken = response.data.accessToken; // Thay đổi thành accessToken
        localStorage.setItem("accessToken", accessToken); // Thay đổi thành accessToken

        //Lưu Id TaiKhoan Và localstorage
        var idtk = response.data.idtk;
        localStorage.setItem("idtk", idtk);

        var taikhoan = response.data.username;
        localStorage.setItem("username", taikhoan);
        //lưu quyen hang
        var role = response.data.role;
        localStorage.setItem("role", role);
        // Hiển thị thông báo SweetAlert2 khi đăng nhập thành công
        // Kiểm tra vai trò và chuyển hướng đến trang phù hợp
        if (role === "USER") {
          Swal.fire({
            title: "Success",
            text: "Đăng nhập thành công tài khoản user",
            icon: "success",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });

          // Lấy IdTK sau khi đăng nhập
          var idtaikhoantimkiem = localStorage.getItem('idtk');
          console.log("IdTKDangNhap :", idtaikhoantimkiem);
          // Hàm tìm kiếm id giỏ hàng của người dùng khi đăng nhập
          $scope.finByIdGioHang = function () {

            $http.get('http://localhost:8080/api/gio-hang/tim-kiem/gio-hang?idtk=' + idtaikhoantimkiem)
              .then(resp => {
                $scope.timKiemIdGH = resp.data;

                if ($scope.timKiemIdGH && $scope.timKiemIdGH.id !== null && $scope.timKiemIdGH.id !== "") {
                  localStorage.setItem("idgiohang", $scope.timKiemIdGH.id);
                  console.log("Đã Tìm Thấy IdGH :", resp)
                } else {
                  console.log("K Tìm Thấy IdGH Hoặc Chưa Tạo !");
                }

              }).catch(error => {
                console.log("Lỗi K Load DC IDGH !")
              });
          }
          $scope.finByIdGioHang();

          // Tải lại trang sau 1.5 giây khi thông báo biến mất
          setTimeout(function () {
            $window.location.href = "/src/user/index_user.html";
          }, 1500);

        } else if (role === "ADMIN") {
          Swal.fire({
            title: "Success",
            text: "Đăng nhập thành công tài khoản Admin",
            icon: "success",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });

          // Tải lại trang sau 1.5 giây khi thông báo biến mất
          setTimeout(function () {
            $window.location.href = "/index_Admin.html";
          }, 1500);
        }

      })
      .catch(function (error) {

        console.error("Lỗi khi đăng nhập:", error);

        // Hiển thị thông báo đăng nhập thất bại (bạn có thể sử dụng thư viện thông báo thay vì alert)
        Swal.fire({
          title: "Error",
          text: "Đăng nhập thất bại, hãy thử lại",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
      });

  };



  $scope.register = function () {
    var registrationData = {
      taikhoan: $scope.taikhoan,
      email: $scope.email,
      matkhau: $scope.matkhau,
      chucvu: $scope.chucvu,
      // Thêm các trường thông tin cần thiết khác
    };

    // Gửi yêu cầu POST đến API localhost:8080/ban/hang/register
    $http
      .post("http://localhost:8080/ban/hang/register", registrationData)
      .then(function (response) {
        console.log("Đăng ký thành công:", response.data);

        // Hiển thị thông báo SweetAlert2 khi đăng ký thành công
        Swal.fire({
          title: "Success",
          text: "Đăng ký thành công",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });

        // Tải lại trang sau 1.5 giây khi thông báo biến mất
        setTimeout(function () {
          $window.location.reload();
        }, 1500);
      })
      .catch(function (error) {
        console.error("Lỗi khi đăng ký:", error);

        // Hiển thị thông báo đăng ký thất bại (bạn có thể sử dụng thư viện thông báo thay vì alert)
        Swal.fire({
          title: "Error",
          text: "Đăng ký thất bại, hãy thử lại",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

});
