app.controller('productDetailController', function ($scope, $http, $window, $routeParams, $location, $route) {

    // Lấy Id Từ $RouteParams
    var idsanpham = $routeParams.id;
    // var idsanphammoi = angular.copy($routeParams.id);
    console.log("IdSP :", idsanpham);

    // Lấy idtk từ localstorage 
    var idtaikoan = localStorage.getItem("idtk");
    console.log("IdTK :", idtaikoan);

    // ---------- Load sp new  ---------- //
    $scope.getAllSPNewCTSP = function () {

        $http.get('http://localhost:8080/api/ctsp/get-all/san-pham-new')
            .then(function (response) {
                $scope.sanPhamNewCTSP = response.data;
                console.log('Data SP New CTSP :', $scope.sanPhamNewCTSP);
            })
            .catch(function (error) {
                console.error('Lỗi K Load được SP New : ', error);
            });
    }

    $scope.getAllSPNewCTSP();

    // Xử lý cộng trừ số lượng
    // Mặc định số lượng là 1
    $scope.soluong = 1;
    $scope.changeQuantityCTSP = function (action) {

        // Tìm Màu Sắc được chọn
        var timKiemMauSac = $scope.detailMauSac.find(function (ms) {
            return ms.isActive;
        });

        // Tìm kiếm Size được chọn
        var timKiemSize = $scope.detailSize.find(function (s) {
            return s.isActive;
        });

        // Check soluong tăng phải nhỏ hơn số lượng sản phẩm theo màu sắc và size
        if (timKiemMauSac && timKiemSize) {

            // Cộng số lượng
            if (action === 'qty-up') {
                $scope.soluong++;

                // Nếu tăng số lượng vượt quá số lượng sản phẩm theo màu sắc và size thì nó sẽ thông báo
                if ($scope.soluong > $scope.chiTietSP.soluongton) {

                    $scope.messageShowSoLuongTon = true;
                    $scope.soluong = $scope.chiTietSP.soluongton;
                } else {
                    $scope.messageShowSoLuongTon = false;
                }
            } else {

                // Nếu số lượng nhỏ hơn sô lượng sản phẩm màu sắc và size thì nó tắt thông báo
                $scope.messageShowSoLuongTon = false;
            }

            // Trừ số lượng
            if (action === 'qty-down' && $scope.soluong > 1) {
                $scope.soluong--;
            }

        } else {

            // Check soluong tăng phải nhỏ hơn tổng số lượng sản phẩm
            if (action === 'qty-up' && $scope.soluong < $scope.getAllTongSoLuongSP.tongsoluongsp) {
                $scope.soluong++;
            } else if (action === 'qty-down' && $scope.soluong > 1) {
                $scope.soluong--;
            }

        }

    };


    // Validate soluong
    $scope.validateNumber = function () {

        // Tìm Màu Sắc được chọn
        var timKiemMauSac = $scope.detailMauSac.find(function (ms) {
            return ms.isActive;
        });

        // Tìm kiếm Size được chọn
        var timKiemSize = $scope.detailSize.find(function (s) {
            return s.isActive;
        });


        // Kiểm tra nếu không phải là số dương, có chữ hoặc là số 0
        if (!/^[1-9]\d*$/.test($scope.soluong)) {
            $scope.soluong = 1;
        }

        // Check soluong lớn hơn số lượng sản phẩm theo màu sắc và size thì trả ra thông báo
        if (timKiemMauSac && timKiemSize) {

            if ($scope.soluong > $scope.chiTietSP.soluongton) {

                $scope.messageShowSoLuongTon = true;
                $scope.soluong = $scope.chiTietSP.soluongton;
            } else {
                $scope.messageShowSoLuongTon = false;
            }

        } else {

            // Check soluong lớn hơn tổng số lượng sản phẩm thì đưa số lượng nhiều nhất tại ô input
            if ($scope.soluong > $scope.getAllTongSoLuongSP.tongsoluongsp) {
                $scope.soluong = $scope.getAllTongSoLuongSP.tongsoluongsp;
            }

        }

    };


    // ---------- Load sp ---------- //
    $scope.getDetailProduct = function () {

        $http.get('http://localhost:8080/api/ctsp/detail/san-pham?idsp=' + idsanpham)
            .then(function (response) {
                $scope.detailProduct = response.data;
                console.log('Data SP :', $scope.detailProduct);
            })
            .catch(function (error) {
                console.error('Lỗi K Load được SP : ', error);
            });
    }

    $scope.getDetailProduct();


    // Load Tổng Số Lượng SP
    $scope.getTongSoLuongSP = function () {

        $http.get('http://localhost:8080/api/ctsp/get-all/tong-so-luong-san-pham?idsp=' + idsanpham)
            .then(function (response) {
                $scope.getAllTongSoLuongSP = response.data;
                console.log('Tổng Số Lượng SP :', $scope.getAllTongSoLuongSP);
            })
            .catch(function (error) {
                console.error('Lỗi K Load được Tổng Số Lượng SP : ', error);
            });
    }

    $scope.getTongSoLuongSP();

    // ---------- Load MauSac ---------- //
    $scope.getDetailMauSac = function () {

        $http.get('http://localhost:8080/api/ctsp/detail/mau-sac?idsp=' + idsanpham)
            .then(function (response) {
                $scope.detailMauSac = response.data;
                console.log('Data MauSac :', $scope.detailMauSac);

                // Khởi tạo trạng thái isActive
                $scope.detailMauSac.forEach(function (mausac) {
                    mausac.isActive = false;
                });
            })
            .catch(function (error) {
                console.error('Lỗi K Load được Màu Sắc :  : ', error);
            });
    }

    // Xử lý css ative khi người dùng click Màu Sắc
    $scope.toggleActiveMS = function (mausac) {

        // Chuyển đổi trạng thái "isActive" của Màu Sắc
        mausac.isActive = !mausac.isActive;

        // Nếu bạn chỉ muốn một Màu Sắc được chọn vào một thời điểm, bạn có thể sử dụng đoạn mã sau:
        $scope.detailMauSac.forEach(function (ms) {
            if (ms !== mausac) {
                ms.isActive = false;
            }
        });


    };

    $scope.getDetailMauSac();


    // ---------- Load size ---------- //
    $scope.getDetailSize = function () {

        $http.get('http://localhost:8080/api/ctsp/detail/size?idsp=' + idsanpham)
            .then(function (response) {
                $scope.detailSize = response.data;

                // Khởi tạo trạng thái isActive
                $scope.detailSize.forEach(function (size) {
                    size.isActive = false;
                });

                // Sắp xếp dữ liệu theo thứ tự mong muốn (S, M, L, XL, XXL)
                $scope.detailSize.sort(function (a, b) {
                    var sizesOrder = ['S', 'M', 'L', 'XL', 'XXL'];
                    return sizesOrder.indexOf(a.tensize) - sizesOrder.indexOf(b.tensize);
                });

                console.log('Data Size :', $scope.detailSize);
            })
            .catch(function (error) {
                console.error('Lỗi K Load được SIZE : ', error);
            });
    }

    // Xử lý css ative khi người dùng click Size
    $scope.toggleActiveSize = function (size) {
        // Chuyển đổi trạng thái "isActive" của size
        size.isActive = !size.isActive;

        // Nếu bạn chỉ muốn một size được chọn vào một thời điểm, bạn có thể sử dụng đoạn mã sau:
        $scope.detailSize.forEach(function (s) {
            if (s !== size) {
                s.isActive = false;
            }
        });

    };

    $scope.getDetailSize();


    // ---------- Hàm xử lý tìm kiếm màu sắc theo idsp và idsize ---------- //

    // Biến để theo dõi trạng thái đã chọn size hay chưa
    $scope.isSizeSelected = false;

    $scope.timKiemMauSac = function () {
        // Tìm size được chọn
        var selectedSize = $scope.detailSize.find(function (size) {
            return size.isActive;
        });

        if (selectedSize) {
            var idsize = selectedSize.id;
            console.log('IdSize đang chọn để tìm kiếm màu sắc : ' + idsize);

            $http.get('http://localhost:8080/api/ctsp/tim-kiem/mau-sac?idsp=' + idsanpham + '&idsize=' + idsize)
                .then(function (response) {

                    // Lấy danh sách màu sắc từ server
                    var mauSacFromServer = response.data;

                    // Cập nhật trạng thái của màu sắc dựa trên dữ liệu nhận được
                    $scope.detailMauSac.forEach(function (ms) {
                        // Kiểm tra xem màu sắc có trong danh sách nhận được từ server không
                        var matchingColor = mauSacFromServer.find(function (availableMs) {
                            return availableMs.tenmausac === ms.tenmausac; // Điều này có thể phụ thuộc vào cách bạn so sánh màu sắc
                        });

                        // Cập nhật trạng thái của chất liệu dựa trên dữ liệu nhận được

                        // Cập nhật trạng thái isActive và isSelectable của màu sắc
                        ms.isAvailable = !!matchingColor;
                        ms.isSelectable = !!matchingColor;
                    });

                    // Đã chọn size
                    $scope.isSizeSelected = true;

                    // Hiển thị kết quả trong console để kiểm tra
                    // console.log('Danh Sách Màu Sắc :', $scope.detailMauSac);

                    // console.log(response.data);
                })
                .catch(function (error) {
                    console.error('Lỗi K thể tìm kiếm Màu Sắc: ', error);
                });
        } else {
            $scope.detailMauSac.forEach(function (ms) {
                ms.isSelectable = true;
            });
            console.error('Chưa chọn size !');
        }
    };



    // ---------- Hàm Xử Lý Tìm kiếm SIZE và Chất Liệu theo idmausac và idsp ---------- //

    // Biến để theo dõi trạng thái đã chọn Màu Sắc Hay Chưa hay chưa
    $scope.isMauSacSelected = false;

    // Hàm xử lý tìm kiếm màu sắc theo idsp và idsize
    $scope.timKiemSize = function () {
        // Tìm Màu Sắc được chọn
        var selectedMauSac = $scope.detailMauSac.find(function (ms) {
            return ms.isActive;
        });

        if (selectedMauSac) {
            // Khai báo biến idmausac để lấy id của màu sắc đc chọn
            var idmausac = selectedMauSac.id;
            console.log('Idmausac đang chọn để tìm kiếm size : ' + idmausac);

            $http.get('http://localhost:8080/api/ctsp/tim-kiem/size?idsp=' + idsanpham + '&idmausac=' + idmausac)
                .then(function (response) {


                    console.log('Size muốn tìm :', response.data);

                    // Lấy danh sách hàm tìm kiếm trả ra từ server
                    var sizeFromServer = response.data;

                    // Cập nhật trạng thái của SIZE dựa trên dữ liệu nhận được
                    $scope.detailSize.forEach(function (s) {
                        // Kiểm tra xem size có trong danh sách nhận được từ server không
                        var matchingColor = sizeFromServer.find(function (availableSize) {
                            // Điều này có thể phụ thuộc vào cách bạn so sánh size
                            return availableSize.tensize === s.tensize;
                        });

                        // Cập nhật trạng thái isActive và isSelectable của size
                        s.isAvailable = !!matchingColor;
                        s.isSelectable = !!matchingColor;
                    });

                    // Đã chọn màu sắc
                    $scope.isMauSacSelected = true;

                    // Hiển thị kết quả trong console để kiểm tra
                    // console.log('Danh Sách SIZE :', $scope.detailSize);

                })
                .catch(function (error) {
                    console.error('Lỗi K thể tìm kiếm Size: ', error);
                });
        } else {

            // Reset lại size khi bỏ chọn màu sắc
            $scope.detailSize.forEach(function (s) {
                s.isSelectable = true;
            });

            console.error('Chưa chọn màu sắc !');
        }
    };


    // ---------- Tìm kiếm ra IDCTSP theo IdSP , IDMauSac , IDSize ---------- //

    // Khi chưa chọn màu sắc và size sẽ load tổng số lượng sản phẩm
    $scope.isSoLuongTonAndTongSoLuongSP = false;

    $scope.detailIDCTSP = function () {

        // Tìm Màu Sắc được chọn
        var timKiemMauSac = $scope.detailMauSac.find(function (ms) {
            return ms.isActive;
        });

        // Tìm kiếm Size được chọn
        var timKiemSize = $scope.detailSize.find(function (s) {
            return s.isActive;
        });


        // Check Nếu màu sắc hoặc size chưa được chọn thì sẽ k tìm kiếm ra idctsp
        if (timKiemMauSac && timKiemSize) {

            // Nếu chọn đã chọn màu sắc và size thì sẽ reset soluong tại ô inut về 1
            $scope.soluong = 1;

            // Khai báo biến lấy idmausac
            var idMauSac = timKiemMauSac.id;

            // Khai báo biến lấy idsize
            var idSize = timKiemSize.id;

            // Khi đã chọn màu sắc và size sẽ load số lượng sản phẩm theo màu sắc và size
            $scope.isSoLuongTonAndTongSoLuongSP = true;

            console.log('IDMauSac Để Tìm IDCTSP :', timKiemMauSac.id);
            console.log('IDSize Để Tìm IDCTSP :', timKiemSize.id);


            $http.get('http://localhost:8080/api/ctsp/tim-kiem/id-ctsp?idsp=' + idsanpham + '&idmausac=' + idMauSac + '&idsize=' + idSize)
                .then(function (response) {

                    $scope.chiTietSP = response.data;

                    // // Lưu soluongton theo mausac và size vào localStorage
                    // localStorage.setItem('soluongton', $scope.chiTietSP.soluongton);
                    console.log('IDCTSP :', $scope.chiTietSP);
                })
                .catch(function (error) {
                    console.error('Lỗi K Tìm Được IDCTSP : ', error);
                });
        } else {

            // Chưa chọn mausac và size thì trả về tổng số lượng sp
            $scope.isSoLuongTonAndTongSoLuongSP = false;

            // Bỏ chọn mausac và size thì đưa soluong tại ô input về 1 
            $scope.soluong = 1;
            $scope.messageShowSoLuongTon = false;
            console.error('Chưa chọn đủ Màu Sắc và Size!');

        }
    }


    // Tạo Giỏ Hàng Mới
    $scope.taoGioHang = function () {

        if (idtaikoan !== null) {
            $http.post('http://localhost:8080/api/gio-hang/add?idtk=' + idtaikoan)
                .then(function (response) {
                    $scope.addGioHang = response.data;
                    console.log("DATA GH :", $scope.addGioHang);
                    // Lưu idgiohang vào localStorage
                    localStorage.setItem('idgiohang', $scope.addGioHang.idgiohang);

                    // Gọi hàm taoGioHangCT sau khi tạo giỏ hàng mới
                    $scope.taoGioHangCT();
                })
                .catch(function (error) {
                    console.error(error.data.message);
                });
        } else {
            // console.log("IdTK Không Có ");
            $http.post('http://localhost:8080/api/gio-hang/khong-dang-nhap')
                .then(function (response) {
                    $scope.addGioHangKhongDN = response.data;
                    console.log("DATA GH :", $scope.addGioHangKhongDN);
                    // Lưu idgiohang vào localStorage
                    localStorage.setItem('idgiohang', $scope.addGioHangKhongDN.idgiohang);

                    // Gọi hàm taoGioHangCT sau khi tạo giỏ hàng mới
                    $scope.taoGioHangCT();
                })
                .catch(function (error) {
                    console.log("Lỗi K Tạo Được Giỏ Hàng !");
                });
        }

    };

    // Tạo Giỏ Hàng CT và thêm sản phẩm vào giỏ hàng
    $scope.taoGioHangCT = function () {

        // Lấy idGioHang từ localStorage
        var IdGioHang = localStorage.getItem('idgiohang');

        // Lấy idct quan hàm tìm chiTietSP và soluong ở ô input
        var idctsp = $scope.chiTietSP.id;
        var soluong = $scope.soluong

        // Hiển thị Sweet Alert để xác nhận
        Swal.fire({
            title: "Thêm Vào Giỏ Hàng",
            text: "Bạn có chắc chắn muốn thêm vào giỏ hàng ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add To Cart",
            cancelButtonText: "Cancel",
        }).then((result) => {

            if (result.isConfirmed) {
                $http.post('http://localhost:8080/api/ghct/add-san-pham?idgiohang=' + IdGioHang + '&idctsp=' + idctsp + '&soluong=' + soluong)
                    .then(function (response) {
                        $scope.ghct = response.data;
                        console.log('Data GHCT :', $scope.ghct);
                        $window.location.reload();
                        // $route.reload();
                    })
                    .catch(function (error) {
                        console.error('Lỗi K Thêm Được SP Vào Giỏ Hàng CT : ', error);
                    });


                // Sử dụng $location để thay đổi địa chỉ URL
                // $location.path('/cart/' + idctsp + '&soluong=' + soluong);
            }

        });
    }


    // Hàm lấy IDCTSP , SL và chuyển sang trang cart   
    $scope.layIdCTSPAndSL = function () {

        // if (idtaikoan !== null) {


            // Tìm Màu Sắc được chọn
            var isMauSacSelected = $scope.detailMauSac.find(function (ms) {
                return ms.isActive;
            });

            // Tìm kiếm Size được chọn
            var isSizeSelected = $scope.detailSize.find(function (s) {
                return s.isActive;
            });

            // Check khi chưa chọn màu sắc và size
            if (isMauSacSelected && isSizeSelected) {

                // Lấy idGioHang từ localStorage
                var IdGioHang = localStorage.getItem('idgiohang');

                // Gọi hàm taoGioHang nếu không có idGioHang trong localStorage
                if (!IdGioHang) {

                    $scope.taoGioHang()

                } else {

                    // Nếu có idGioHang trong localStorage, thực hiện thêm vào giỏ hàng và chuyển trang
                    $scope.taoGioHangCT();

                }

            } else {
                Swal.fire({
                    title: "Thông Báo",
                    text: "Vui Lòng Chọn Đủ Màu Sắc Và Size",
                    icon: "warning",
                    position: "top-end", // Đặt vị trí ở góc trái
                    toast: true, // Hiển thị thông báo nhỏ
                    showConfirmButton: false, // Ẩn nút xác nhận
                    timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
                })
                // alert('Vui lòng chọn đủ màu sắc và size.');
            }
        // }else{

        //     Swal.fire({
        //         title: "Đăng Nhập",
        //         text: "Bạn Cần Phải Đăng Nhập !",
        //         icon: "warning",
        //         showCancelButton: true,
        //         confirmButtonColor: "#28a745",
        //         cancelButtonColor: "#d33",
        //         confirmButtonText: "Đăng Nhập",
        //         cancelButtonText: "Cancel",
        //     }).then((result) => {
                
        //         if(result.isConfirmed){
        //             $window.location.href = "/src/Page/Login.html";
        //         }
        //     });

            
        // }
    };

})
