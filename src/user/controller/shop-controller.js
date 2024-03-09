app.controller('shopController', function ($scope, $http) {

    // Khai báo biến lấy giá trị trang đầu
    $scope.currentPage = 1;
    // Số lượng bản ghi trên mỗi trang
    $scope.itemsPerPage = 9;
    // Biến mảng
    $scope.sanPhamShop = [];
    $scope.listDanhMuc = [];
    $scope.listSize = [];
    $scope.listMauSac = [];

    // khai báo 2 biến cho các hàm tìm kiếm
    $scope.pageNumber = 0;
    $scope.pageSize = 9

    // Xử lý sự kiện trang trước
    $scope.previousPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
    };

    // Xử lý sự kiện trang tiếp theo
    $scope.nextPage = function () {
        var totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        if ($scope.currentPage < totalPages) {
            $scope.currentPage++;
        }
    };

    // Hàm lấy tổng số trang
    $scope.getTotalPages = function () {
        return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };


    // Hàm cập nhật trang từ ô input
    $scope.updatePage = function () {
        var totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        if (!/^[1-9]\d*$/.test($scope.currentPage)) {
            $scope.currentPage = 1;
        } else if ($scope.currentPage > totalPages) {
            $scope.currentPage = totalPages;
        }
    };


    // Load sp lên trang chủ
    function loadSPShop() {
        $http.get(`http://localhost:8080/api/san-pham/show-phan-trang?page=${$scope.currentPage - 1}`).then(resp => {
            $scope.sanPhamShop = resp.data.content;
            console.log("Load SPShop :", $scope.sanPhamShop);

            // Tổng số bản ghi
            $scope.totalItems = resp.data.totalElements;
            // Tổng số trang
            $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
            // console.log("TST :", $scope.totalItems);

            if ($scope.sanPhamShop.length < $scope.itemsPerPage) {
                $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
                $scope.showNextButton = true; // Hiển thị nút "Next"
            }
        }).catch(error => {
            console.log("Error", error);
        });
    }


    $scope.$watch('currentPage', loadSPShop);


    // ------------------- Tìm Kiếm Dòng Sản Phẩm -------------------- //

    // Tìm kiếm sản phẩm theo name
    $scope.searchProductKey = function () {
        var name = $scope.tensp;

        if (!name) {
            // Nếu giá trị là null, gọi lại danh sách đầy đủ
            loadSPShop();
        } else {
            $http
                .get(
                    "http://localhost:8080/api/san-pham/loc-tensp?pageNumber=" +
                    $scope.pageNumber +
                    "&pageSize=" +
                    $scope.pageSize +
                    "&tensp=" +
                    name
                )
                .then(function (response) {
                    $scope.sanPhamShop = response.data;
                    console.log("TK SP Theo Name:", $scope.sanPhamShop);
                    if ($scope.sanPhamShop.length < $scope.pageSize) {
                        $scope.showNextButton = false; // Ẩn nút "Next"
                    } else {
                        $scope.showNextButton = true; // Hiển thị nút "Next"
                    }
                });
        }
    };


    // Show danh mục lên Combobox
    $scope.getAllDanhMuc = function () {
        $http
            .get("http://localhost:8080/api/san-pham/hien-thi-danh-muc-shop")
            .then(function (response) {
                $scope.listDanhMuc = response.data;
                console.log("ListDM :", $scope.listDanhMuc);
            });
    };
    $scope.getAllDanhMuc();

    // Tìm Kiếm Danh Mục Theo Tên Danh Mục
    $scope.searchDanhMuc = function () {
        var namedm = $scope.tendanhmuc;
        console.log("Name DM :", namedm)

        if (!namedm) {
            // Nếu giá trị là null, gọi lại danh sách đầy đủ
            loadSPShop();
        } else {
            $http
                .get(
                    "http://localhost:8080/api/san-pham/loc-danh-muc?pageNumber=" +
                    $scope.pageNumber +
                    "&pageSize=" +
                    $scope.pageSize +
                    "&tendanhmuc=" +
                    namedm
                )
                .then(function (response) {
                    // $scope.listDanhMuc = response.data;
                    $scope.sanPhamShop = response.data.content;
                    console.log("TK SP Theo Name DanhMuc:", $scope.sanPhamShop);
                    if ($scope.sanPhamShop.length < $scope.pageSize) {
                        $scope.showNextButton = false; // Ẩn nút "Next"
                    } else {
                        $scope.showNextButton = true; // Hiển thị nút "Next"
                    }
                });
        }
    };

    // Show Size 
    $scope.getAllSize = function () {
        $http
            .get("http://localhost:8080/api/san-pham/hien-thi-size-shop")
            .then(function (response) {
                $scope.listSize = response.data;
                // Sắp xếp dữ liệu theo thứ tự mong muốn (S, M, L, XL, XXL)
                $scope.listSize.sort(function (a, b) {
                    var sizesOrder = ['S', 'M', 'L', 'XL', 'XXL'];
                    return sizesOrder.indexOf(a.tensize) - sizesOrder.indexOf(b.tensize);
                });
                console.log("ListSize :", $scope.listSize);
            });
    };
    $scope.getAllSize();

    // Tìm Kiếm Size Theo Tên Size
    $scope.searchSize = function () {
        var namesize = $scope.tensize;
        console.log("Name Size :", $scope.tensize)

        if (!namesize) {
            // Nếu giá trị là null, gọi lại danh sách đầy đủ
            loadSPShop();
        } else {
            $http
                .get(
                    "http://localhost:8080/api/san-pham/loc-size?pageNumber=" +
                    $scope.pageNumber +
                    "&pageSize=" +
                    $scope.pageSize +
                    "&tensize=" +
                    namesize
                )
                .then(function (response) {
                    // $scope.listDanhMuc = response.data;
                    $scope.sanPhamShop = response.data.content;
                    console.log("TK SP Theo Name Size:", $scope.sanPhamShop);
                    if ($scope.sanPhamShop.length < $scope.pageSize) {
                        $scope.showNextButton = false; // Ẩn nút "Next"
                    } else {
                        $scope.showNextButton = true; // Hiển thị nút "Next"
                    }
                });
        }
    };

    // Show danh mục lên Combobox
    $scope.getAllMauSac = function () {
        $http
            .get("http://localhost:8080/api/san-pham/hien-thi-mau-sac-shop")
            .then(function (response) {
                $scope.listMauSac = response.data;
                console.log("ListMS :", $scope.listMauSac);
            });
    };
    $scope.getAllMauSac();


    // Tìm Kiếm Màu Sắc Theo Tên mausac
    $scope.searchMauSac = function () {
        var namemausac = $scope.tenmausac;
        console.log("Name Size :", $scope.tenmausac)

        if (!namemausac) {
            // Nếu giá trị là null, gọi lại danh sách đầy đủ
            loadSPShop();
        } else {
            $http
                .get(
                    "http://localhost:8080/api/san-pham/loc-mau-sac?pageNumber=" +
                    $scope.pageNumber +
                    "&pageSize=" +
                    $scope.pageSize +
                    "&tenmausac=" +
                    namemausac
                )
                .then(function (response) {
                    // $scope.listDanhMuc = response.data;
                    $scope.sanPhamShop = response.data.content;
                    console.log("TK SP Theo Name MauSac:", $scope.sanPhamShop);
                    if ($scope.sanPhamShop.length < $scope.pageSize) {
                        $scope.showNextButton = false; // Ẩn nút "Next"
                    } else {
                        $scope.showNextButton = true; // Hiển thị nút "Next"
                    }
                });
        }
    };



    /*--------------------- Price range --------------------- */
    // kéo thả gias
    var sliderrange = $('#slider-range');
    var amountprice = $('#amount');
    $(function () {
        sliderrange.slider({
            range: true,
            min: 16000,
            max: 400000,
            values: [0, 300000],
            slide: function (event, ui) {
                amountprice.val(ui.values[0] + "đ" + " - " + ui.values[1] + "đ");
            },
            stop: function (event, ui) {
                $scope.searchSPGiaBan();
            }
        });
        amountprice.val(sliderrange.slider("values", 0) + "đ" +
            " - " + sliderrange.slider("values", 1) + "đ" );
    });


    // Tìm Kiếm Màu Sắc Theo giá
    $scope.searchSPGiaBan = function () {
        var key1 = sliderrange.slider("values", 0);
        var key2 = sliderrange.slider("values", 1);
        console.log("key1 :", key1);
        console.log("key2 :", key2);
        if (!key1 && !key2) {
            // Nếu giá trị là null, gọi lại danh sách đầy đủ
            loadSPShop();
        } else {
            $http
                .get(
                    "http://localhost:8080/api/san-pham/loc-gia-ban?pageNumber=" +
                    $scope.pageNumber +
                    "&pageSize=" +
                    $scope.pageSize +
                    "&key1=" +
                    key1 +
                    "&key2=" +
                    key2
                )
                .then(function (response) {
                    // $scope.listDanhMuc = response.data;
                    $scope.sanPhamShop = response.data.content;
                    console.log("TK SP Theo Giá Bán :", $scope.sanPhamShop);
                    if ($scope.sanPhamShop.length < $scope.pageSize) {
                        $scope.showNextButton = false; // Ẩn nút "Next"
                    } else {
                        $scope.showNextButton = true; // Hiển thị nút "Next"
                    }
                });
        }
    };

});