app.factory('dataGridServices', function () {

    var factory = new Object();


    factory.getDefaultFilters = function () {
        return {
            fields: '',
            include: '', // product's category here
            where: { name: { like: '' } }, // filters here
            order: ['name ASC'],
            // Paging
            limit: null,
            skip: null
        }
    };
    factory.tableHeaders = [];
    factory.sortExpression = "";
    factory.sortDirection = "";
    factory.sort = "";

    factory.initializeTableHeaders = function () {
        factory = new Object();
        factory.tableHeaders = [];
    };

    factory.addHeader = function (label, expression, sortable) {
        var tableHeader = new Object();

        tableHeader.label = label;
        tableHeader.sortExpression = expression;
        tableHeader.sortable = sortable;

        factory.tableHeaders.push(tableHeader);
    };

    factory.setTableHeaders = function () {
        return factory.tableHeaders;
    }

    factory.changeSorting = function (columnSelected, currentSort, tableHeaders) {

        factory = new Object();

        factory.sortExpression = "";

        var sort = currentSort;
        if (sort.column == columnSelected) {
            sort.descending = !sort.descending;
        } else {
            sort.column = columnSelected;
            sort.descending = false;
        }

        for (var i = 0; i < tableHeaders.length; i++) {
            if (sort.column == tableHeaders[i].label) {
                factory.sortExpression = tableHeaders[i].sortExpression;
                break;
            }
        }

        if (sort.descending == true)
            factory.sortDirection = "DESC";
        else
            factory.sortDirection = "ASC";

        factory.sort = sort;

    }

    factory.getSort = function (columnSelected, currentSort, tableHeaders) {
        return factory.sort;
    };

    factory.getSortDirection = function () {
        return factory.sortDirection;
    };

    factory.getSortExpression = function () {
        return factory.sortExpression;
    };

    factory.setDefaultSort = function (defaultSort) {
        var sort = {
            column: defaultSort,
            descending: false
        }
        return sort;
    };

    factory.setSortIndicator = function (column, defaultSort) {
        return column == defaultSort.column && 'sort-' + defaultSort.descending;
    };

    return factory;
});