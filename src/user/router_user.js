var app = angular.module('app',['ngRoute']);
app.config(function ($routeProvider,  $locationProvider){
    $locationProvider.hashPrefix("");
    
    $routeProvider.when('/',{
        templateUrl:'pages/index.html'
    }).when('/shop',{
        templateUrl:'pages/shop.html'
    }).when('/product-details/:id',{
        templateUrl:'pages/product-details.html'
    }).when('/cart/:id',{
        templateUrl:'pages/cart.html'
    }).when('/checkout',{
        templateUrl:'pages/checkout.html'
    }).when('/thanhyou', {
        templateUrl:'pages/Thanhyou.html',
        controller: "checkoutController"
    })
     .otherwise({
        redirectTo: '/' 
    });

    
});