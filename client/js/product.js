app.controller('productController', function ($scope, $http, Product) {
    // Products
    $scope.Products = Product.find();
    $scope.Product = {};
    $scope.TotalProducts = 0;
    // Options
    $scope.PageSize = 5;
    $scope.SortDirection = "ASC";
    $scope.SortExpression = "name";
    $scope.CurrentPageNumber = 1;
    // Sets variables
    $scope.button = {
        showAddButton: true,
        showSaveButton: false
    };
    $scope.message = {
        showSuccessMessage: false,
        showDangerMessage: false,
        successMessage: "Add new product successfully",
        dangerMessage: "Add new product failed"
    };
    $scope.focusMe = true;
    $scope.loading = false;

    // Gets products when changing page
    $scope.pageChanged = function () {
        $scope.getProducts();
    };
    // Gets list of products by conditions
    $scope.getProducts = function () {
        var productInquiry = $scope.createProductInquiryObject();
        // productService.getProducts(productInquiry($scope.productInquiryCompleted, $scope.productInquiryError));
    };
    $scope.createProductInquiryObject = function () {
        var productInquiry = new Object();

        productInquiry.id = $scope.Product.id;
        productInquiry.name = $scope.Product.name;
        productInquiry.CurrentPageNumber = $scope.CurrentPageNumber;
        productInquiry.SortExpression = $scope.SortExpression;
        productInquiry.SortDirection = $scope.SortDirection;
        productInquiry.PageSize = $scope.PageSize;

        return productInquiry;
    };
    // Define table headers
    $scope.tableHeaders = [{
        label: "Product Name"
    }, {
        label: "Price"
    },
    // {
    //     label: "Category"
    // },
    {
        label: "In Stock"
    }, {

    }];
    // Binds total products count
    Product.count().$promise.then(function (response) {
        $scope.TotalProducts = response.count;
    });
    // Add
    $scope.add = function () {
        $scope.loading = true;
        $scope.turnoffMessage();

        Product.create({ name: $scope.Product.name, inStock: $scope.Product.inStock, price: $scope.Product.price }).$promise
            .then(function (product) {
                $scope.Products.push(product);
                $scope.Product = {};
                $scope.TotalProducts++;
                $scope.loading = false;
                $scope.successCallback("add");
            })
            .catch($scope.errorCallback)
            .finally($scope.finallyCallback);
    };
    // Delete
    $scope.delete = function ($index) {
        $scope.loading = true;
        $scope.turnoffMessage();
                $scope.Product = {};

        var product = $scope.Products[$index];

        Product.deleteById({ id: product.id }).$promise
            .then(function () {
                $scope.Products.splice($index, 1);
                $scope.TotalProducts--;
                $scope.loading = false;
                $scope.successCallback("delete");
            })
            .catch($scope.errorCallback)
            .finally($scope.finallyCallback);
    };
    $scope.onAddButtonClick = function ($index) {
        $scope.Product = {};
        $scope.focusMe = true;
        $scope.turnoffMessage();
        $scope.swapAddSaveButtonStates(!$scope.button.showAddButton);
    };
    $scope.onEditButtonClick = function ($index) {
        var product = $scope.Products[$index];
        if ($scope.Product !== product) {
            $scope.Product = product;
            $scope.focusMe = true;
            $scope.turnoffMessage();
            $scope.swapAddSaveButtonStates(!$scope.button.showSaveButton);
        } else {
            alert("Please finishing edit on current record.");
        }
    };
    $scope.onSaveButtonClick = function () {
        $scope.loading = true;
        $scope.turnoffMessage();

        Product.upsert($scope.Product).$promise
            .then(function () {
                $scope.loading = false;
                $scope.successCallback("save");
            })
            .catch($scope.errorCallback)
            .finally($scope.finallyCallback);
    };
    // Update
    $scope.update = function (Product) {
        $scope.loading = true;
        $scope.turnoffMessage();

        Product.$save().$promise
            .then(function (product) {
                $scope.loading = false;
                $scope.successCallback("save");
            })
            .catch($scope.errorCallback)
            .finally($scope.finallyCallback);
    };
    // Update all Product
    $scope.updateAll = function (Products) {
        $scope.loading = true;
        $scope.turnoffMessage();

        angular.forEach(Products, function (Product, value) {
            Product.$save().$promise
                .then(function (products) {
                    $scope.loading = false;
                    $scope.successCallback("save");
                })
                .catch($scope.errorCallback)
                .finally($scope.finallyCallback);
        });
    };
    // Invoke ALERT message
    $scope.ok = function (message) {
        alert(message);
    };
    $scope.successCallback = function (type) {
        $scope.message.showSuccessMessage = true;
        $scope.message.showDangerMessage = false;
        if (type === "add") {
            $scope.message.successMessage = "Add new product successfully";
        }
        else if(type == "save") {
            $scope.message.successMessage = "Save product successfully";
        }
        else {
            $scope.message.successMessage = "Delete product successfully";
        }
    };
    // Define callback function for exception handler
    $scope.errorCallback = function (response) {
        $scope.message.showSuccessMessage = false;
        $scope.message.showDangerMessage = true;
        alert(response.data.error.message);
        $scope.loading = false;
    };
    // Define callback function for finally block
    $scope.finallyCallback = function () {
        $scope.loading = false;
    };
    $scope.swapAddSaveButtonStates = function (perform) {
        if (!perform) return;
        var temp = $scope.button.showAddButton;
        $scope.button.showAddButton = $scope.button.showSaveButton;
        $scope.button.showSaveButton = temp;
    };
    $scope.turnoffMessage = function () {
        $scope.message.showSuccessMessage = false;
        $scope.message.showDangerMessage = false;
    };
});
