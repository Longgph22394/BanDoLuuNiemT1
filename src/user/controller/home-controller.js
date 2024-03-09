app.controller("homeController", function ($scope, $http, $window, $route) {


    // --------------- Phân Trang SP Home --------------- //

    // khai báo biến trang đầu tiên là 1
    $scope.currentPageHome = 1;
    // khai báo biến có 12 sp trên 1 trang
    $scope.itemsPerPageHome = 12;

    // Xử lý sự kiện trang trước
    $scope.previousPageHome = function () {
        if ($scope.currentPageHome > 1) {
            $scope.currentPageHome--;
        }
    };

    // Xử lý sự kiện trang tiếp theo
    $scope.nextPageHome = function () {
        var totalPagesHome = Math.ceil($scope.totalItemsHome / $scope.itemsPerPageHome);
        if ($scope.currentPageHome < totalPagesHome) {
            $scope.currentPageHome++;
        }
    };

    // Hàm cập nhật trang từ ô input
    $scope.updatePageHome = function () {
        var totalPagesHome = Math.ceil($scope.totalItemsHome / $scope.itemsPerPageHome);
        if (!/^[1-9]\d*$/.test($scope.currentPageHome)) {
            $scope.currentPageHome = 1;
        } else if ($scope.currentPageHome > totalPagesHome) {
            $scope.currentPageHome = totalPagesHome;
        }
    };

    // Load sp lên trang chủ
    function loadSPHome() {
        $http.get(`http://localhost:8080/api/san-pham/show?page=${$scope.currentPageHome - 1}`)
            .then(resp => {
                $scope.sanPhamS = resp.data.content;
                console.log($scope.sanPhamS);
                // Tổng số bản ghi
                $scope.totalItemsHome = resp.data.totalElements;
                // Tổng số trang
                $scope.totalPagesHome = Math.ceil($scope.totalItemsHome / $scope.itemsPerPageHome);
                console.log($scope.totalItemsHome);

                console.log("Success Data SPHome ", resp);
            }).catch(error => {
                console.log("Error", error);
            });
    }

    $scope.$watch('currentPageHome', loadSPHome);



    // ---------------- Phân Trang SP Nam ---------------- //

    // khai báo biến trang đầu tiên là 1
    $scope.currentPageNam = 1;
    // khai báo biến có 12 sp trên 1 trang
    $scope.itemsPerPageNam = 12;

    // Xử lý sự kiện trang trước
    $scope.previousPageNam = function () {
        if ($scope.currentPageNam > 1) {
            $scope.currentPageNam--;
        }
    };

    // Xử lý sự kiện trang tiếp theo
    $scope.nextPageNam = function () {
        var totalPagesNam = Math.ceil($scope.totalItemsNam / $scope.itemsPerPageNam);
        if ($scope.currentPageNam < totalPagesNam) {
            $scope.currentPageNam++;
        }
    };

    // Hàm cập nhật trang từ ô input
    $scope.updatePageNam = function () {
        var totalPagesNam = Math.ceil($scope.totalItemsNam / $scope.itemsPerPageNam);
        if (!/^[1-9]\d*$/.test($scope.currentPageNam)) {
            $scope.currentPageNam = 1;
        } else if ($scope.currentPageNam > totalPagesNam) {
            $scope.currentPageNam = totalPagesNam;
        }
    };



    // Load sp Nam lên trang chủ
    function loadSPNamHome() {
        $http.get(`http://localhost:8080/api/san-pham/show-nam?page=${$scope.currentPageNam - 1}`)
            .then(resp => {
                $scope.sanPhamNamS = resp.data.content;
                console.log($scope.sanPhamNamS);
                // Tổng số bản ghi
                $scope.totalItemsNam = resp.data.totalElements;
                // Tổng số trang
                $scope.totalPagesNam = Math.ceil($scope.totalItemsNam / $scope.itemsPerPageNam);
                console.log($scope.totalPagesNam);

                console.log("Success Data SPNam ", resp);
            }).catch(error => {
                console.log("Error", error);
            });
    }

    $scope.$watch('currentPageNam', loadSPNamHome);


    // --------------- Phân Trang SP Nữ --------------- //

    // khai báo biến trang đầu tiên là 1
    $scope.currentPageNu = 1;
    // khai báo biến có 12 sp trên 1 trang
    $scope.itemsPerPageNu = 12;


    // Xử lý sự kiện trang trước
    $scope.previousPageNu = function () {
        if ($scope.currentPageNu > 1) {
            $scope.currentPageNu--;
        }
    };

    // Xử lý sự kiện trang tiếp theo
    $scope.nextPageNu = function () {
        var totalPagesNu = Math.ceil($scope.totalItemsNu / $scope.itemsPerPageNu);
        if ($scope.currentPageNu < totalPagesNu) {
            $scope.currentPageNu++;
        }
    };

    // Hàm cập nhật trang từ ô input
    $scope.updatePageNu = function () {
        var totalPagesNu = Math.ceil($scope.totalItemsNu / $scope.itemsPerPageNu);
        if (!/^[1-9]\d*$/.test($scope.currentPageNu)) {
            $scope.currentPageNu = 1;
        } else if ($scope.currentPageNu > totalPagesNu) {
            $scope.currentPageNu = totalPagesNu;
        }
    };



    // Load sp Nam lên trang chủ
    function loadSPNuHome() {
        $http.get(`http://localhost:8080/api/san-pham/show-nu?page=${$scope.currentPageNu - 1}`)
            .then(resp => {
                $scope.sanPhamNuS = resp.data.content;
                console.log($scope.sanPhamNuS);
                // Tổng số bản ghi
                $scope.totalItemsNu = resp.data.totalElements;
                // Tổng số trang
                $scope.totalPagesNu = Math.ceil($scope.totalItemsNu / $scope.itemsPerPageNu);
                console.log($scope.totalPagesNu);

                console.log("Success Data SPNu ", resp);
            }).catch(error => {
                console.log("Error", error);
            });
    }

    $scope.$watch('currentPageNu', loadSPNuHome);


    // Load sp Mới lên trang chủ
    function loadSPMoi() {

        $http.get('http://localhost:8080/api/san-pham/show-new').then(resp => {
            $scope.sanPhamMoi = resp.data;
            console.log("Success Data SP Mới :", resp)
        }).catch(error => {
            console.log("Error", error)
        });
    }
    loadSPMoi();

});