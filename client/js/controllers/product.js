// TODO: reuse these methods by creating a base controller
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
    $scope.buttons = {
        showSaveButton: function (isShown = true) {
            return this.isSaveButtonShown = isShown;
        }
    };
    $scope.message = {
        successMessage: "Add new product successfully",
        dangerMessage: "Add new product failed",
        setSuccessMessage: function (message) {
            return this.successMessage = message;
        },
        setDangerMessage: function (message) {
            return this.dangerMessage = message;
        },
        showSuccessMessage: function (show = true) {
            return this.isSuccessMessageShown = show;
        },
        showDangerMessage: function (show = true) {
            return this.isDangerMessageShown = show;
        }
    };
    $scope.setFocusMe = function (focus = true) {
        return this.focusMe = focus;
    };
    $scope.setLoading = function (loading = true) {
        return this.loading = loading;
    };

    // Gets products when changing page
    $scope.pageChanged = function () {
        this.getProducts();
    };

    // Gets list of products by conditions
    $scope.getProducts = function () {
        var productInquiry = this.createProductInquiryObject();
        // productService.getProducts(productInquiry(this.productInquiryCompleted, this.productInquiryError));
    };

    $scope.createProductInquiryObject = function () {
        return {
            id: this.Product.id,
            name: this.Product.name,
            CurrentPageNumber: this.CurrentPageNumber,
            SortExpression: this.SortExpression,
            SortDirection: this.SortDirection,
            PageSize: this.PageSize
        };
    };

    // Binds total products count
    Product.count().$promise.then(function (response) {
        $scope.TotalProducts = response.count;
    });

    $scope.onAddButtonClick = function ($index) {
        this.Product = {};
        this.focusMe = true;
        this.turnoffMessage();
        this.buttons.showSaveButton(false);
    };

    $scope.onEditButtonClick = function ($index) {
        var scope = $scope;
        var product = scope.Products[$index];

        if (scope.Product !== product) {
            scope.Product = product;
            scope.focusMe = true;
            this.turnoffMessage();
            this.buttons.showSaveButton();
        } else {
            alert("Please finishing edit on current record.");
        }
    };

    $scope.onSaveButtonClick = function () {
        var scope = $scope;

        scope.setLoading();
        scope.turnoffMessage();

        Product.upsert(scope.Product).$promise
            .then(function () {
                scope.Product = {};
                scope.setLoading(false);
                scope.successCallback("save");
            })
            .catch(scope.errorCallback)
            .finally(scope.finallyCallback);
    };

    // Invoke ALERT message
    $scope.ok = function (message) {
        alert(message);
    };

    $scope.successCallback = function (type) {
        var scope = $scope;
        var msg = scope.message;

        scope.setLoading(false);
        msg.showDangerMessage(!msg.showSuccessMessage());

        if (type === "add") {
            msg.setSuccessMessage("Add new product successfully");
        }
        else if (type == "save") {
            msg.setSuccessMessage("Save product successfully");
        }
        else {
            msg.setSuccessMessage("Delete product successfully");
        }
    };

    // Define callback function for exception handler
    $scope.errorCallback = function (response) {
        var scope = $scope;
        var msg = scope.message;

        scope.setLoading(false);
        msg.showSuccessMessage(!msg.showDangerMessage());
        msg.setDangerMessage(response.data.error.message)
    };

    // Define callback function for finally block
    $scope.finallyCallback = function () {
        $scope.setLoading(false);
    };

    $scope.turnoffMessage = function () {
        this.message.showSuccessMessage(this.message.showDangerMessage(false));
    };

    /* CRUD codes */
    $scope.add = function () {
        var scope = $scope;

        scope.setLoading();
        scope.turnoffMessage();

        Product.create({
            name: scope.Product.name,
            inStock: scope.Product.inStock,
            description: scope.Product.description,
            price: scope.Product.price
        }).$promise
            .then(function (product) {
                scope.Products.push(product);
                scope.Product = {};
                scope.TotalProducts++;
                scope.successCallback("add");
                scope.setLoading(false);
            })
            .catch(scope.errorCallback)
            .finally(scope.finallyCallback);
    };

    $scope.delete = function ($index) {
        var scope = $scope;
        var product = scope.Products[$index];

        scope.setLoading();
        scope.turnoffMessage();

        Product.deleteById({ id: product.id }).$promise
            .then(function () {
                scope.Products.splice($index, 1);
                scope.TotalProducts--;
                scope.Product = {};
                scope.successCallback("delete");
                scope.setLoading(false);
            })
            .catch(scope.errorCallback)
            .finally(scope.finallyCallback);
    };

    $scope.update = function (Product) {
        var scope = $scope;

        scope.setLoading();
        scope.turnoffMessage();

        Product.$save().$promise
            .then(function (product) {
                scope.successCallback("save");
                scope.setLoading(false);
            })
            .catch(scope.errorCallback)
            .finally(scope.finallyCallback);
    };
    /* end CRUD */
});
