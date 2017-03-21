// TODO: reuse these methods by creating a base controller
app.controller('productController', function ($scope, $http, Product) {
    // Init the controller with default values
    $scope.InitController = function () {
        $scope.Products = [];
        $scope.TotalProducts = $scope.Products.length;

        // Options
        $scope.PageSize = 5;
        $scope.SortDirection = "ASC";
        $scope.SortExpression = "name";
        $scope.CurrentPageNumber = 1;

        // Filters
        $scope.filters = {};

        // Form
        $scope.form = {
            focused: false,
            values: null,
            add: true,
            title: "Add new product",
            setTitle: function (title) {
                this.title = title;
            },
            setValue: function (product = null) {
                this.values = product;
            },
            getValues: function () {
                return this.values;
            },
            setFocus: function (focus = true) {
                this.focused = focus;
            },
            onFormCancel: function () {
                this.setValue(null);
            },
            hide: function () {
                $("#productPopup").modal('hide');
            },
            show: function (isEdit) {
                this.setFocus();
                this.add = !isEdit;
                $("#productPopup").modal('show');
            },
            submitForm: function (form, $isValid) {
                if ($isValid) {
                    var self = this;
                    var scope = $scope;
                    var state = this.add ? "add" : "save";

                    scope.setLoading();
                    scope.turnoffMessage();

                    Product.upsert(self.getValues()).$promise
                        .then(function (product) {
                            scope.setLoading(false);
                            scope.successCallback(state, product);
                            self.setValue(null);
                            self.hide();
                        })
                        .catch(scope.errorCallback)
                        .finally(scope.finallyCallback);
                }
            }
        };

        $scope.onSaveButtonClick = function () {
            var scope = $scope;

            scope.setLoading();
            scope.turnoffMessage();

            Product.upsert(scope.Product).$promise
                .then(function (response) {
                    debugger;
                    scope.successCallback("save");
                })
                .catch(scope.errorCallback)
                .finally(scope.finallyCallback);
        };

        // Sets variables
        $scope.buttons = {
            showSaveButton: function (isShown = true) {
                return this.isSaveButtonShown = isShown;
            }
        };

        // Messages
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
    };

    // Products
    Product.find().$promise
        .then(function (response) {
            // Binds total products count
            $scope.Products = response;
            $scope.TotalProducts = response.length;
        })
        .catch($scope.errorCallback)
        .finally($scope.finallyCallback);

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

    $scope.onAddButtonClick = function ($index) {
        this.form.setValue(null);
        this.form.setFocus();
        this.turnoffMessage();
    };

    $scope.onEditButtonClick = function ($index) {
        var scope = $scope;
        var product = scope.Products[$index];

        if (this.form !== product) {
            this.form.setValue(product);
            this.form.setFocus();
            this.form.show(true);
            this.turnoffMessage();
        } else {
            alert("Please finishing edit on current record.");
        }
    };

    // Invoke ALERT message
    $scope.ok = function (message) {
        alert(message);
    };

    $scope.successCallback = function (state, product, $index) {
        var scope = $scope;
        var msg = scope.message;

        msg.showDangerMessage(!msg.showSuccessMessage());

        if (state === "add") {
            scope.TotalProducts++;
            scope.Products.push(product);
            msg.setSuccessMessage("Add new product successfully");
        }
        else if (state == "save") {
            msg.setSuccessMessage("Save product successfully");
        }
        else {
            scope.TotalProducts--;
            scope.Products.splice($index, 1);
            msg.setSuccessMessage("Delete product successfully");
        }
    };

    // Define callback function for exception handler
    $scope.errorCallback = function (response) {
        var scope = $scope;
        var msg = scope.message;

        scope.setLoading(false);
        msg.showSuccessMessage(!msg.showDangerMessage());
        msg.setDangerMessage(response.data.error.message);
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
                scope.successCallback("add");
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
                scope.successCallback("delete", null, $index);
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
            })
            .catch(scope.errorCallback)
            .finally(scope.finallyCallback);
    };
    /* end CRUD */
});
