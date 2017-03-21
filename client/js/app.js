// angular.module('my-app-module', ['ngRoute' /* etc */, 'lbServices', 'my-app.controllers']);
var app = angular.module('app', [
    'lbServices',
    'ui.router'
])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            var product = {
                name: 'product',
                url: '/product',
                templateUrl: 'views/product/product.html',
                controller: 'productController'
            };
            var productAdmin = {
                name: 'product-admin',
                url: '/product-admin',
                templateUrl: 'views/product/product-admin.html',
                controller: 'productController'
            };
            var testPage = {
                name: "test",
                url: '/test-page',
                // template: 'Hello, this is a test content for Angular UI Route',
                templateUrl: 'views/test-route.html'
            };
            $stateProvider
                .state(product)
                .state(productAdmin)
                .state(testPage);

            $urlRouterProvider.otherwise('product');
        }
    ]);

app.controller('appController', function ($scope, $http, Product) { $scope.date = new Date(); });

// Custom derectives
app.directive('focusMe', [
    '$timeout',
    '$parse',
    function ($timeout, $parse) {
        return {
            //scope: true,   // optionally create a child scope
            link: function (scope, element, attrs) {
                var model = $parse(attrs.focusMe);
                scope.$watch(model, function (value) {
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
                // to address @blesh's comment, set attribute value to 'false'
                // on blur event:
                element.bind('blur', function () {
                    scope.$apply(model.assign(scope, false));
                });
            }
        };
    }
]);
