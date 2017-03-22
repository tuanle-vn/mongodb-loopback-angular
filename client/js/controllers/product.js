// TODO: reuse these methods by creating a base controller
app.controller('productController', function ($scope, $http, Product, dataGridServices) {

    // Init the controller with default values
    $scope.InitController = function () {
        $scope.Products = [];
        $scope.TotalProducts = $scope.Products.length;
        $scope.allowGet = true;

        // Options
        $scope.PageSize = 5;
        $scope.SortDirection = "ASC";
        $scope.SortExpression = "name";
        $scope.CurrentPageNumber = 1;

        // Filters
        $scope.filter = $scope.getProductDefaultFilter();

        var filtersKeys = Object.keys($scope.filter);
        filtersKeys.forEach(function (element) {
            if (element != "filters") {
                $scope.$watch('filter["' + element + '"]', function (newValue, oldValue, $scope) {
                    $scope.onFiltersWatchChange(element, newValue);
                }, true);
            }
        }, this);

        // Gets the fresh data on every change of filter values, use $watch to trigger with deep = true
        $scope.$watch('filter["filters"]', function (newValue, oldValue) {
            $scope.allowGet && $scope.getProductsByCondition();
        }, true);

        $scope.onFiltersWatchChange = function (filter, data) {
            $scope.filter.filters.where[filter] = undefined;

            if (data) {
                if (data.op) {
                    if (data.value) {
                        $scope.filter.filters.where[filter] = {};
                        $scope.filter.filters.where[filter][data.op] = data.value;
                    }
                }
                if (data.like) {
                    $scope.filter.filters.where[filter] = data;
                }
            }
        };

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
                            self.hide();
                        })
                        .catch(scope.errorCallback)
                        .finally(scope.finallyCallback);
                }
            }
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

        // $scope.defaultSort = dataGridServices.setDefaultSort("name");
        $scope.changeSorting = function (column) {
            debugger;
            // dataGridServices.changeSorting(column, $scope.defaultSort, $scope.tableHeaders);

            // $scope.defaultSort = dataGridServices.getSort();
            // $scope.SortDirection = dataGridServices.getSortDirection();
            // $scope.SortExpression = dataGridServices.getSortExpression();
            // $scope.CurrentPageNumber = 1;

            // $scope.getProductsByCondition();

        };

        $scope.setSortIndicator = function (column) {
            debugger;
            // return dataGridServices.setSortIndicator(column, $scope.defaultSort);
        };

        $scope.getProductsByCondition();
    };

    // Defines default filter object
    $scope.getProductDefaultFilter = function () {
        return {
            filters: dataGridServices.getDefaultFilters(),
            name: { like: '' },
            description: { like: '' },
            price: {
                op: "eq",
                value: null
            }
        };
    };
    // Gets products when changing page
    $scope.pageChanged = function () {
        this.getProductsByCondition();
    };
    // Gets products by condition (filter, sort, paging)
    $scope.getProductsByCondition = function () {
        Product.find({
            filter: $scope.filter.filters
        }).$promise
            .then(function (response) {
                // Binds total products count
                $scope.Products = response;
                $scope.TotalProducts = response.length;
            })
            .catch($scope.errorCallback)
            .finally($scope.finallyCallback);
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

    $scope.turnoffMessage = function () {
        this.message.showSuccessMessage(this.message.showDangerMessage(false));
    };

    $scope.onSaveButtonClick = function () {
        var scope = $scope;

        scope.setLoading();
        scope.turnoffMessage();

        Product.upsert(scope.Product).$promise
            .then(function (response) {
                scope.successCallback("save");
            })
            .catch(scope.errorCallback)
            .finally(scope.finallyCallback);
    };

    $scope.onClearFilterButtonClick = function (allowGet = true) {
        $scope.allowGet = allowGet;
        $scope.filter = $scope.getProductDefaultFilter();
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

    // Invokes ALERT message
    $scope.ok = function (message) {
        alert(message);
    };

    // Defines callback function for success handler
    $scope.successCallback = function (state, product, $index) {
        var scope = $scope;
        var msg = scope.message;

        msg.showDangerMessage(!msg.showSuccessMessage());
        scope.form.setValue(null);

        if (state === "add") {
            // scope.TotalProducts++;
            // scope.Products.push(product);
            msg.setSuccessMessage("Add new product successfully");
        }
        else if (state == "save") {
            msg.setSuccessMessage("Save product successfully");
        }
        else {
            // scope.TotalProducts--;
            // scope.Products.splice($index, 1);
            msg.setSuccessMessage("Delete product successfully");
        }
        $scope.onClearFilterButtonClick(false);
        $scope.getProductsByCondition();
    };

    // Defines callback function for exception handler
    $scope.errorCallback = function (response) {
        var scope = $scope;
        var msg = scope.message;

        scope.setLoading(false);
        if (response && response.data && response.data.error) {
            msg.showSuccessMessage(!msg.showDangerMessage());
            msg.setDangerMessage(response.data.error.message);
        }
    };

    // Defines callback function for finally block
    $scope.finallyCallback = function () {
        $scope.setLoading(false);
        $scope.allowGet = true;
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
    /* end CRUD */
});
