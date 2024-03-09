app.controller('checkoutController', function ($scope, $http, $window, $location, $timeout, $route, $routeParams) {

    // Lấy idGioHang từ localStorage
    var IdGioHang = localStorage.getItem('idgiohang');
    console.log("ID GioHang LocalStor :", IdGioHang);

    var IdTK = localStorage.getItem('idtk');
    console.log("ID TK : ", IdTK);

    // Get All checkout
    function loadcheckout() {

        // Check id giỏ hàng
        if (IdGioHang !== null) {
            var url = "http://localhost:8080/api/ghct/show-tong-tien?idgiohang=" + IdGioHang;
            $http.get(url).then(resp => {
                $scope.checkout = resp.data;
                console.log('DaTa Tổng Tiền :', $scope.checkout);
                $window.localStorage.setItem(
                    "listCart",
                    $scope.checkout.map((item) => item.id)
                );

                // Tính tổng tiền tất cả sản phẩm
                if ($scope.checkout !== null) {
                    $scope.totalAmount = 0;
                    for (var i = 0; i < $scope.checkout.length; i++) {
                        $scope.totalAmount += parseFloat($scope.checkout[i].tongtien);
                    }
                }

            }).catch(error => {
                console.log("Error", error);
            });
        } else {
            console.log('Chưa tạo giỏ Hàng');
        }

    }

    loadcheckout();

    // Get Tổng Số Tiền 
    function loadTongSoTien() {

        // Check id giỏ hàng

        if (IdGioHang !== null) {

            var url = 'http://localhost:8080/api/ghct/show-tong-so-tien?idgiohang=' + IdGioHang;
            $http.get(url).then(resp => {
                $scope.tongSoTienS = resp.data;
                console.log('DaTa Tổng Số Tiền :', $scope.tongSoTienS);

                $window.localStorage.setItem(
                    "tongsotien",
                    $scope.tongSoTienS.map((item) => item.tongsotien)
                );

            }).catch(error => {
                console.log("Chưa Có SP để tính TST :", error);
            });
        } else {
            console.log('Chưa tạo giỏ Hàng');
        }


    }

    loadTongSoTien();

    // ---------- Xử Lý VouCher ----------

    // Load VouCher
    $scope.loadVoucher = function () {

        var url = 'http://localhost:8080/api/voucher/hien-thi';
        $http.get(url).then(resp => {
            $scope.vouChers = resp.data;
            console.log('DaTa VouCher :', $scope.vouChers);

        }).catch(error => {
            console.log("K Tìm Thấy vouCher :", error);
        });


    }
    $scope.loadVoucher();

    // Khi áp dụng mã giảm giá

    var tongsotienIF = parseFloat($window.localStorage.getItem("tongsotien"));
    var giatritoithieuhoadon = parseFloat(giatritoithieuhoadon);
    // tổng tiền khi chưa apdung voucher;
    $scope.tongCong = tongsotienIF;
    // Hàm Xử lý khi chọn voucher

    $scope.voucherId = function (
        id,
        giatrigiam,
        hinhthucgiam,
        magiamgia,
        giatritoithieuhoadon,
    ) {
        //Get tổng giá trị


        if (tongsotienIF >= giatritoithieuhoadon) {
            $window.localStorage.setItem("idVoucher", id);
            console.log($window.localStorage.getItem("idVoucher"));
            $window.localStorage.setItem("giatrigiam", giatrigiam);
            console.log($window.localStorage.getItem("giatrigiam"));
            $window.localStorage.setItem("hinhthucgiam", hinhthucgiam);
            console.log($window.localStorage.getItem("hinhthucgiam"));
            $window.localStorage.setItem("maVoucher", magiamgia);
            console.log($window.localStorage.getItem("maVoucher"));
            $window.localStorage.setItem("giatritoithieuhoadon", giatritoithieuhoadon);

            // Lấy giá trị từ localStorage
            $scope.magiamgia = $window.localStorage.getItem("maVoucher");
            var idGiamGiaVoucher = $window.localStorage.getItem("idVoucher");
            console.log("IdVouCher Đang ÁP Dụng :", idGiamGiaVoucher);
            var hinhThucGiam = $window.localStorage.getItem("hinhthucgiam");
            var giatrigiam = parseFloat($window.localStorage.getItem("giatrigiam"));
            // Kiểm tra hình thức giảm giá
            if (hinhThucGiam === "1") {
                // Giảm giá theo tỷ lệ %
                console.log("Giảm giá theo tỷ lệ %");
                $scope.giamGiaVoucher = (tongsotienIF * giatrigiam) / 100;
            } else if (hinhThucGiam === "2") {
                // Giảm giá theo giá trị VNĐ
                console.log("Giảm giá theo giá trị VNĐ");
                $scope.giamGiaVoucher = giatrigiam;
            }

            // Tính tổng cộng dựa trên giá trị giảm giá
            $scope.tongCong = tongsotienIF - $scope.giamGiaVoucher;
            Swal.fire({
                title: "Thành công",
                text: "Đã áp dụng voucher",
                icon: "success",
                position: "top-end", // Đặt vị trí ở góc trái
                toast: true, // Hiển thị thông báo nhỏ
                showConfirmButton: false, // Ẩn nút xác nhận
                timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
            });
            // Tải lại trang sau 1.5 giây khi thông báo biến mất
            // setTimeout(function () {
            //    $route.reload();
            // }, 1500);
        } else {

            Swal.fire({
                title: "Sorry",
                text: "Giá trị đơn hàng chưa đủ ",
                icon: "error",
                position: "top-end", // Đặt vị trí ở góc trái
                toast: true, // Hiển thị thông báo nhỏ
                showConfirmButton: false, // Ẩn nút xác nhận
                timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
            });

        }
        // Cập nhật trạng thái isApplied của voucher đã áp dụng
        $scope.vouChers.forEach(function (voucher) {
            if (voucher.mavoucher === $scope.magiamgia) {
                voucher.isApplied = true;
            } else {
                voucher.isApplied = false;

            }
        });

    };

    // Hàm để nắng nghe sự thay đổi của LocalStorage
    $scope.$watch(function () {
        // Lấy IdVoucher trên localStorage
        return $window.localStorage.getItem('idVoucher');
    }, function (newIdVoucher) {

        if (newIdVoucher === null || newIdVoucher === undefined) {
            // Nếu giá trị mới từ localStorage là null hoặc undefined,
            // thì gán giá trị mặc định
            $scope.idVoucher = 'B1F22B75-A800-446B-8963-548AB7F94678';
        } else {
            // Ngược lại, gán giá trị mới từ localStorage
            $scope.idVoucher = newIdVoucher;
            console.log("NewIdVoucher :", $scope.idVoucher);
        }

    });

    // Khai báo biến để lưu các giá trị đã binding
    $scope.hovaten = "";
    $scope.sodienthoai = "";
    $scope.email = "";
    $scope.diachi = "";
    $scope.tinh = "";
    $scope.huyen = "";
    $scope.xa = "";
    $scope.phuongThucThanhToan = 1;
    $scope.tongTien = 0; // Để tránh lỗi nếu không có giá trị tổng tiền
    $scope.tienKhachTra = 0; // Để tránh lỗi nếu không có giá trị tiền khách trả
    $scope.gioHangChiTietList = [];


    var idctsp = $window.localStorage.getItem("listCart");

    if (idctsp !== null) {

        var gioHangChiTietList = idctsp.split(",");
        console.log("IDCTSP :", gioHangChiTietList);

    } else {
        console.log("K thấy IdCTSP");
        // loadcheckout();
        // loadTongSoTien();
    }


    // Lấy giá trị tổng tiền từ localStorage
    var tongSoTien = parseFloat($window.localStorage.getItem("tongsotien"));
    console.log('TST LocalStrore :', tongSoTien);

    // Lấy accessToken trên localSotrage
    var token = localStorage.getItem("accessToken")
    console.log("ToKen :", token);

    // Nếu có token gửi header lên sever để tìm kiếm thông tin người dùng
    if (token) {
        // Nếu có token, gọi API để lấy thông tin khách hàng
        var apiEndpoint = "http://localhost:8080/api/thong-tin/tim-kiem/nguoi-dung";
        var apiAddress = "http://localhost:8080/api/thong-tin/dia-chi/hien-thi";
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        $http.get(apiEndpoint, config).then(
            function (response) {
                console.log("DaTa Token :", response.data);
                // Lấy thông tin từ server và gán vào các biến $scope
                $scope.hovaten = response.data.hovaten;
                $scope.email = response.data.email;
                $scope.sodienthoai = response.data.sodienthoai;

                // Gọi API địa chỉ
                $http.get(apiAddress, config).then(
                    function (diachiReponse) {
                        $scope.diachiND = diachiReponse.data;
                        console.log("DaTa DCND :", $scope.diachiND);
                        // Lọc các địa chỉ có trạng thái là 1
                        $scope.filteredAddresses = diachiReponse.data.filter(function (address) {
                            return address.trangthai === "1";
                        });

                        // Lấy địa chỉ đầu tiên từ danh sách đã lọc và gán vào $scope.diaChi
                        $scope.diachi =
                            $scope.filteredAddresses.length > 0
                                ? $scope.filteredAddresses[0].diachi
                                : "";
                    },
                    function (diaChiError) {
                        console.error("Lỗi khi gọi API địa chỉ: " + diaChiError);
                    }
                );
            },
            function (error) {
                console.error("Lỗi khi gọi API thông tin cá nhân: " + error);
            }
        );
    }


    // Hàm xử lý khi người dùng click nút "Đặt Hàng"
    // ---------- Thanh Toán Khi Nhận Hàng ---------- //
    $scope.hovatenValid = true;
    $scope.sodienthoaiValid = true;
    $scope.emailValid = true;
    $scope.diachiValid = true;
    $scope.sodienthoaiFomart = true;
    $scope.emailFomart = true;

    var sdtRegex = /^(0[2-9]{1}\d{8,9})$/;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    $scope.thanhToan = function () {
        
        // Check trống họ và tên
        if(!$scope.hovaten){
            $scope.hovatenValid = false;
        }else{
            $scope.hovatenValid = true;
        }

        // Check trống địa chỉ
        if(!$scope.diachi){
            $scope.diachiValid = false;
        }else{
            $scope.diachiValid = true;
        }

        // Check trống số điện thoại và định dạng sdt
        if(!$scope.sodienthoai){
            $scope.sodienthoaiValid = false;

        } else if(!sdtRegex.test($scope.sodienthoai)) {
            $scope.sodienthoaiValid = true;
            $scope.sodienthoaiFomart = false;
            return;
        }else {
            $scope.hovatenValid = true;
            $scope.sodienthoaiFomart = true;
        }

        // Check trống email và định dạng email
        if(!$scope.email){
            $scope.emailValid = false;
        } else if (!emailRegex.test($scope.email)) {
            $scope.emailValid = true;
            $scope.emailFomart = false;
            return;
        }else{
            $scope.emailValid = true;
            $scope.emailFomart = true;
        }

        // Thông báo không được để trống
        if (
            !$scope.hovatenValid ||
            !$scope.sodienthoaiValid ||
            !$scope.emailValid ||
            !$scope.diachiValid
        ) {
            Swal.fire({
                title: "Warning",
                text: "Vui lòng điền đủ thông tin",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }


        if (IdTK !== null) {

            // Hiển thị Sweet Alert để xác nhận
            Swal.fire({
                title: "Xác nhận đặt hàng?",
                text: "Bạn có chắc chắn muốn đặt đơn hàng?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Đặt hàng",
                cancelButtonText: "Cancel",
            }).then((result) => {

                if (idctsp !== null && tongSoTien !== null) {


                    if (result.isConfirmed) {
                        // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
                        var data = {
                            hovaten: $scope.hovaten,
                            sodienthoai: $scope.sodienthoai,
                            email: $scope.email,
                            diachi: $scope.diachi,
                            tinh: $('#province option:selected').text(),
                            huyen: $('#district option:selected').text(),
                            xa: $('#ward option:selected').text(),
                            phuongThucThanhToan: $scope.phuongThucThanhToan,
                            idvoucher: $scope.idVoucher,
                            giatrigiam: $scope.giamGiaVoucher,
                            tongTien: $scope.tongCong,
                            tienKhachTra: $scope.tienKhachTra,
                            gioHangChiTietList: gioHangChiTietList,
                        };

                        console.log("DATA ThanhToan : ", data);

                        // Gửi dữ liệu POST đến Server
                        $http.post("http://localhost:8080/api/hoa-don/thanh-toan/dang-nhap", data, config)
                            .then(

                                function (resp) {

                                    // Chuyển hướng người dùng đến trang thanh toán thành công 
                                    function reload() {
                                        $window.location.reload();
                                        // $window.location.reload();
                                    }

                                    $location.path('/thanhyou');
                                    $timeout(reload, 100);

                                    // Sau khi thanh toán thành công xáo hết dữ liệu trên localStorage
                                    $window.localStorage.removeItem("idgiohang");
                                    $window.localStorage.removeItem("idVoucher");
                                    $window.localStorage.removeItem("maVoucher");
                                    $window.localStorage.removeItem("giatritoithieuhoadon");
                                    $window.localStorage.removeItem("giatrigiam");
                                    $window.localStorage.removeItem("listCart");
                                    $window.localStorage.removeItem("tongsotien");
                                    $window.localStorage.removeItem("hinhthucgiam");

                                },

                                function (eror) {
                                    // Xử lý lỗi nếu có
                                }


                            );
                    }
                } else {

                    console.log("Chưa Tìm Thấy IDCTSP Và SoLuong");
                }

            });

        } else {

            // Thanh Toán Không Đăng Nhập
            // Hiển thị Sweet Alert để xác nhận
            Swal.fire({
                title: "Xác nhận đặt hàng?",
                text: "Bạn có chắc chắn muốn đặt đơn hàng?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Đặt hàng",
                cancelButtonText: "Cancel",
            }).then((result) => {

                if (idctsp !== null && tongSoTien !== null) {


                    if (result.isConfirmed) {
                        // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
                        var data = {
                            hovaten: $scope.hovaten,
                            sodienthoai: $scope.sodienthoai,
                            email: $scope.email,
                            diachi: $scope.diachi,
                            tinh: $('#province option:selected').text(),
                            huyen: $('#district option:selected').text(),
                            xa: $('#ward option:selected').text(),
                            phuongThucThanhToan: $scope.phuongThucThanhToan,
                            idvoucher: $scope.idVoucher,
                            giatrigiam: $scope.giamGiaVoucher,
                            tongTien: $scope.tongCong,
                            tienKhachTra: $scope.tienKhachTra,
                            gioHangChiTietList: gioHangChiTietList,
                        };

                        console.log("DATA ThanhToan : ", data);

                        // Gửi dữ liệu POST đến Server
                        $http({
                            method: "Post",
                            url: "http://localhost:8080/api/hoa-don/thanh-toan",
                            data: data,
                        }).then(

                            function (resp) {

                                // Chuyển hướng người dùng đến trang thanh toán thành công 
                                function reload() {
                                    $window.location.reload();
                                    // $window.location.reload();
                                }

                                $location.path('/thanhyou');
                                $timeout(reload, 100);

                                // Sau khi thanh toán thành công xáo hết dữ liệu trên localStorage
                                $window.localStorage.removeItem("idgiohang");
                                $window.localStorage.removeItem("idVoucher");
                                $window.localStorage.removeItem("maVoucher");
                                $window.localStorage.removeItem("giatritoithieuhoadon");
                                $window.localStorage.removeItem("giatrigiam");
                                $window.localStorage.removeItem("listCart");
                                $window.localStorage.removeItem("tongsotien");
                                $window.localStorage.removeItem("hinhthucgiam");

                            },

                            function (eror) {
                                // Xử lý lỗi nếu có
                            }


                        );
                    }
                } else {

                    console.log("Chưa Tìm Thấy IDCTSP Và SoLuong");
                }

            });

        }

    }

    // ---------- Thanh Toán VNPay ---------- //
    $scope.thanhToanVNPay = function () {

        // Check trống họ và tên
        if(!$scope.hovaten){
            $scope.hovatenValid = false;
        }else{
            $scope.hovatenValid = true;
        }

        // Check trống địa chỉ
        if(!$scope.diachi){
            $scope.diachiValid = false;
        }else{
            $scope.diachiValid = true;
        }

        // Check trống số điện thoại và định dạng sdt
        if(!$scope.sodienthoai){
            $scope.sodienthoaiValid = false;

        } else if(!sdtRegex.test($scope.sodienthoai)) {
            $scope.sodienthoaiValid = true;
            $scope.sodienthoaiFomart = false;
            return;
        }else {
            $scope.hovatenValid = true;
            $scope.sodienthoaiFomart = true;
        }

        // Check trống email và định dạng email
        if(!$scope.email){
            $scope.emailValid = false;
        } else if (!emailRegex.test($scope.email)) {
            $scope.emailValid = true;
            $scope.emailFomart = false;
            return;
        }else{
            $scope.emailValid = true;
            $scope.emailFomart = true;
        }

        // Thông báo không được để trống
        if (
            !$scope.hovatenValid ||
            !$scope.sodienthoaiValid ||
            !$scope.emailValid ||
            !$scope.diachiValid
        ) {
            Swal.fire({
                title: "Warning",
                text: "Vui lòng điền đủ thông tin",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        if (IdTK !== null) {

            // Hiển thị Sweet Alert để xác nhận
            Swal.fire({
                title: "Xác nhận đặt hàng?",
                text: "Bạn có chắc chắn muốn đặt đơn hàng?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Đặt hàng",
                cancelButtonText: "Cancel",
            }).then((result) => {

                if (idctsp !== null && tongSoTien !== null) {


                    if (result.isConfirmed) {
                        // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
                        var data = {
                            hovaten: $scope.hovaten,
                            sodienthoai: $scope.sodienthoai,
                            email: $scope.email,
                            diachi: $scope.diachi,
                            tinh: $('#province option:selected').text(),
                            huyen: $('#district option:selected').text(),
                            xa: $('#ward option:selected').text(),
                            phuongThucThanhToan: $scope.phuongThucThanhToan,
                            idvoucher: $scope.idVoucher,
                            giatrigiam: $scope.giamGiaVoucher,
                            tongTien: $scope.tongCong,
                            tienKhachTra: $scope.tongCong,
                            gioHangChiTietList: gioHangChiTietList,
                        };

                        console.log("DATA ThanhToan : ", data);

                        // Gửi dữ liệu POST đến Server
                        $http.post("http://localhost:8080/api/hoa-don/thanh-toan/dang-nhap", data, config)
                            .then(

                                function (resp) {
                                    // Lưu id hóa đơn lên LocalStorage
                                    $window.localStorage.setItem("idHoaDonLogin", resp.data.idhoadon);

                                    // Sau khi thanh toán thành công xáo hết dữ liệu trên localStorage
                                    $window.localStorage.removeItem("idgiohang");
                                    $window.localStorage.removeItem("idVoucher");
                                    $window.localStorage.removeItem("maVoucher");
                                    $window.localStorage.removeItem("giatritoithieuhoadon");
                                    $window.localStorage.removeItem("giatrigiam");
                                    $window.localStorage.removeItem("listCart");
                                    $window.localStorage.removeItem("tongsotien");
                                    $window.localStorage.removeItem("hinhthucgiam");

                                    // Gọi hàm congTTVNPay() để tạo cổng thanh toán
                                    $scope.congTTVNPay($scope.tongCong);

                                },

                                function (eror) {
                                    // Xử lý lỗi nếu có
                                }


                            );
                    }
                } else {

                    console.log("Chưa Tìm Thấy IDCTSP Và SoLuong");
                }

            });

        } else {

            // Thanh Toán Không Đăng Nhập
            // Hiển thị Sweet Alert để xác nhận
            Swal.fire({
                title: "Xác nhận đặt hàng?",
                text: "Bạn có chắc chắn muốn đặt đơn hàng?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Đặt hàng",
                cancelButtonText: "Cancel",
            }).then((result) => {

                if (idctsp !== null && tongSoTien !== null) {


                    if (result.isConfirmed) {
                        // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
                        var data = {
                            hovaten: $scope.hovaten,
                            sodienthoai: $scope.sodienthoai,
                            email: $scope.email,
                            diachi: $scope.diachi,
                            tinh: $('#province option:selected').text(),
                            huyen: $('#district option:selected').text(),
                            xa: $('#ward option:selected').text(),
                            phuongThucThanhToan: $scope.phuongThucThanhToan,
                            idvoucher: $scope.idVoucher,
                            giatrigiam: $scope.giamGiaVoucher,
                            tongTien: $scope.tongCong,
                            tienKhachTra: $scope.tongCong,
                            gioHangChiTietList: gioHangChiTietList,
                        };

                        console.log("DATA ThanhToan : ", data);

                        // Gửi dữ liệu POST đến Server
                        $http({
                            method: "Post",
                            url: "http://localhost:8080/api/hoa-don/thanh-toan",
                            data: data,
                        }).then(

                            function (resp) {

                                // Lưu id hóa đơn lên LocalStorage
                                $window.localStorage.setItem("idHoaDonLogin", resp.data.idhoadon);
                                // Sau khi thanh toán thành công xáo hết dữ liệu trên localStorage
                                $window.localStorage.removeItem("idgiohang");
                                $window.localStorage.removeItem("idVoucher");
                                $window.localStorage.removeItem("maVoucher");
                                $window.localStorage.removeItem("giatritoithieuhoadon");
                                $window.localStorage.removeItem("giatrigiam");
                                $window.localStorage.removeItem("listCart");
                                $window.localStorage.removeItem("tongsotien");
                                $window.localStorage.removeItem("hinhthucgiam");

                                // Gọi hàm congTTVNPay() để tạo cổng thanh toán
                                $scope.congTTVNPay($scope.tongCong);


                            },

                            function (eror) {
                                // Xử lý lỗi nếu có
                            }


                        );
                    }
                } else {

                    console.log("Chưa Tìm Thấy IDCTSP Và SoLuong");
                }

            });

        }


    }

    // Tạo Cổng Thanh Toán VNPay
    $scope.congTTVNPay = function (tongTienAmout) {
        $http
            .post(
                "http://localhost:8080/api/payment/vnpay?tongTienAmout=" +
                tongTienAmout
            )
            .then(function (response) {
                $window.location.href = response.data.url;
                console.log("URL :", response.data.url);
            });
    };

    // Lưu Giá trị từ cổng thanh toán trả ra url
    $scope.queryParams = $location.search();
    console.log("Query :", $scope.queryParams);
    // Lấy giá trị của tham số từ url congTTVNPay trả ra
    $scope.amountVNPayParamValue = $scope.queryParams.vnp_Amount;
    console.log("amountVNPayParamValue :", $scope.amountVNPayParamValue);
    $scope.maGiaoDinh = $scope.queryParams.vnp_TxnRef;
    console.log("maGiaoDinh :", $scope.maGiaoDinh);
    $scope.tienCuoiCungVnPay = $scope.amountVNPayParamValue / 100;
    console.log("tienCuoiCungVnPay :", $scope.tienCuoiCungVnPay);

    // Lấy idhoadon sau khi đã tạo hoadon ở hàm thanhToanVNPay
    var idHoaDonLogin = $window.localStorage.getItem("idHoaDonLogin");
    console.log("Đây là id hóa đơn " + idHoaDonLogin);

    // TODO: thanh toán chuyển khoản
    $scope.taoHTTTVNPay = function () {
        $http
            .post(
                "http://localhost:8080/api/hoa-don/hinh-thuc-tt/vn-pay?idhoadon=" + idHoaDonLogin + "&sotientra=" + $scope.tienCuoiCungVnPay + "&magiaodinh=" + $scope.maGiaoDinh
            )
            .then(function (response) {
                console.log("HTTT DaTa :", response.data);
            });
    };


    var taoHTTTVNPayCalled = false;
    // Check Nếu magiaodich and tiencuoicung != null thì k chạy
    if (
        $scope.maGiaoDinh != null &&
        $scope.tienCuoiCungVnPay != null &&
        !taoHTTTVNPayCalled
    ) {
        console.log("Có vào đây không");
        $scope.taoHTTTVNPay();
        taoHTTTVNPayCalled = true;
        $window.localStorage.removeItem("idHoaDonLogin");
    }




});