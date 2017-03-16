// angular.module('my-app-module', ['ngRoute' /* etc */, 'lbServices', 'my-app.controllers']);
var app = angular.module('app', ['lbServices', 'ui.bootstrap']);

app.controller('appController', function ($scope, $http, Product) {
    $scope.date = new Date();
});

// Custom derectives
app.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
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
}]);
