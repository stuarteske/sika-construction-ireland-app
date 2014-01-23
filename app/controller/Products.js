Ext.define('app.controller.Products', {
    extend: 'app.controller.Base',

    requires: [
        'app.view.Main',
        'app.view.products.ProductCategoryContainerDataView',
        'app.view.products.ProductListContainerDataView',
        'app.view.products.ProductDetailContainerView',
        'app.view.products.ProductDetailContainerBackContainerView'
    ],

    config: {
        debugMode: true,
        categorySlug: '',
        refs: {
            'mainView': 'xtypeMainNavigationView',
            'productCategory': 'xtypeProductCategoryContainerDataView',
            'productList': 'xtypeProductListContainerDataView',
            'productDetailsView': 'xtypeProductDetailContainerView',
            'productNavigationBackBtn': 'xtypeProductDetailContainerBackContainerView'
        },

        control: {
            productCategory: {
                itemtap: 'onCategoryNavItemTap'
            },
            productList: {
                itemtap: 'onProductNavItemTap'
            },
            productDetailsView: {
                swipeRight: 'onSwipeRight'
            },
            productNavigationBackBtn: {
                tap: 'onNavigationBackBtnTap'
            }
        },

        routes: {
            'products': 'navigationProducts',
            'products/:categorySlug': 'navigationCategoryView',
            'products/:categorySlug/:productSlug': 'navigationProductsView'
        },

        listeners : {}
    },

    init: function() {
        this.log('Init: app.controller.Products');
    },

    navigationProducts: function() {
        this.log('Navigation: #Products');

        // Get the products data store
        var prodructCategoriesDataStore = Ext.getStore('ProductCategoryData');
        var settingsDataStore = Ext.getStore('SettingsData');

        // Are the databases ready?
        if (prodructCategoriesDataStore.isReady() && settingsDataStore.isReady()) {
            this.log('Region Data Store is ready.');

            // store has data?
            if (!prodructCategoriesDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                prodructCategoriesDataStore.getOfflineData();

            }

            var afterDataLoad = function () {
                Ext.Viewport.setMasked(false);

                // Load the main view
                this.getMainView().push({
                    xtype:'xtypeProductCategoryContainerDataView',
                    store: prodructCategoriesDataStore
                });
            };

            if (!prodructCategoriesDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
                else var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 0, this);

            delayedAfterDataLoad();


        } else {
            var dbRetry = function () {
                this.log('Testing databases again');
                this.navigationProducts();
            };
            var delayedDbRetry = Ext.Function.createDelayed(dbRetry, 500, this);

            delayedDbRetry();

            this.log('Databases are not ready.');
        }
    },

    onCategoryNavItemTap: function(thisObj, index, target, record, event) {
        this.categorySlug = record.get('slug');
        window.location.hash = '#products/' + record.get('slug');
    },

    navigationCategoryView: function(categorySlug) {
        this.log('Navigation: #products/' + categorySlug);

        // Get tbe data bases
        var productCategoriesDataStore = Ext.getStore('ProductCategoryData');
       // var productDataStore = Ext.getStore('ProductData');
        var projectDataStore = Ext.getStore('ProjectData');
        var imageDataStore = Ext.getStore('ImageData');
        var settingsDataStore = Ext.getStore('SettingsData');

        // Are the databases ready?
        if (
            productCategoriesDataStore.isReady() &&
            projectDataStore.isReady() &&
            imageDataStore.isReady() &&
            settingsDataStore.isReady()
        ) {
            this.log('Data Stores are ready.');

            // store has data?
            if (!projectDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                projectDataStore.getOfflineData();

            }

            var afterDataLoad = function () {
                Ext.Viewport.setMasked(false);

                // Load the main view
                this.getMainView().push({
                    xtype:'xtypeProductListContainerDataView',
                    store: projectDataStore.queryBySolutions(this.categorySlug)
                });
            };

            if (!projectDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
                else var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 250, this);

            delayedAfterDataLoad();

        } else {
            var dbRetry = function () {
                this.log('Testing databases again');
                this.navigationCategoryView();
            };
            var delayedDbRetry = Ext.Function.createDelayed(dbRetry, 500, this);

            delayedDbRetry();

            this.log('Databases are not ready.');
        }
    },

    onProductNavItemTap: function(thisObj, index, target, record, event) {
        window.location.hash = '#projects/' + this.categorySlug + '/' + record.get('slug');
    },

    navigationProductsView: function(categorySlug, productSlug) {
        this.log('Navigation: #products/' + categorySlug + '/' + productSlug);

        // Get tbe data bases
        var productDataStore = Ext.getStore('ProductData');
        var imageDataStore = Ext.getStore('ImageData');
        var settingsDataStore = Ext.getStore('SettingsData');

        // Are the databases ready?
        if (
            productDataStore.isReady() &&
            imageDataStore.isReady() &&
            settingsDataStore.isReady()
        ) {
            this.log('Data Stores are ready.');

            // store has data?
            if (!productDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                productDataStore.getOfflineData();

            }

            var afterDataLoad = function () {
                Ext.Viewport.remove(this.productDetailsView, true);

                Ext.Viewport.setMasked(false);

                // Load the main view
                this.productDetailsView = Ext.create('app.view.products.ProductDetailContainerView', {
                    record: productDataStore.findRecord('slug', productSlug)
                });

                Ext.Viewport.add([this.productDetailsView]);

                Ext.Viewport.animateActiveItem(this.productDetailsView, { type: 'slide', direction: 'left' });
            };

            if (!productDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
                else var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 0, this);

            delayedAfterDataLoad();

        } else {
            var dbRetry = function () {
                this.log('Testing databases again');
                this.navigationProductsView();
            };
            var delayedDbRetry = Ext.Function.createDelayed(dbRetry, 500, this);

            delayedDbRetry();

            this.log('Databases are not ready.');
        }
    },

    onNavigationBackBtnTap: function() {
        this.animateBack();
    },

    onSwipeRight: function() {
        this.animateBack();
    },

    animateBack: function() {
        window.location.hash = '#back';

        Ext.Viewport.animateActiveItem(this.getMainView(), { type: 'slide', direction: 'right' });
    }
});