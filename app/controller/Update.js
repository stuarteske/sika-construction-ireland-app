Ext.define('app.controller.Update', {
    extend: 'app.controller.Base',

    requires: [
        //'CfaSika.view.Categories',
        'app.view.update.UpdateMainContainerView'
    ],

    config: {
        debugMode: true,
        refs: {
            'mainView': 'xtypeMainNavigationView',
            'updateContainerView': 'xtypeUpdateMainContainerView'
        },

        control: {},

        routes: {
            'update': 'navigationUpdateData'
        },

        listeners : {},

        currentProgress: 0,
        productCategoriesProgressTotal: 0,
        sectorProgressTotal: 0,
        projectProgressTotal: 0,
        navigationProgressTotal: 0,
        infoProgressTotal: 0
    },

    init: function() {
        this.log('Init: app.controller.Update');

        this.setCurrentProgress(0);
        this.setProductCategoriesProgressTotal(0);
        this.setSectorProgressTotal(0);
        this.setProjectProgressTotal(0);
        this.setNavigationProgressTotal(0);
        this.setInfoProgressTotal(0);
    },

    navigationUpdateData: function() {
        this.log('Navigation: #Update');

        if (this.getMainView().getItems().length >= 2) {
            this.getMainView().push({xtype: 'xtypeUpdateMainContainerView'});
            this.updateAppData();
            this.setMessage('Contacting Server');
            this.setProgress('0');

        } else window.location.hash = '';
    },

    updateAppData: function() {
        var thisObj = this;

        this.setProgress('0');

        // Get the data stores
        var sectorDataStore = Ext.getStore('ProjectCategoryData');
        var projectDataStore = Ext.getStore('ProjectData');
        var productCategoriesDataStore = Ext.getStore('ProductCategoryData');
        var navigationDataStore = Ext.getStore('NavigationData');
        var infoDataStore = Ext.getStore('InfoData');

        // Are the databases ready?
        if (productCategoriesDataStore.isReady()
            && sectorDataStore.isReady()
            && projectDataStore.isReady()
            && navigationDataStore.isReady()
            && infoDataStore.isReady()
            ) {
            this.log('Data Stores are ready.');

            thisObj.updateSectionData();

        } else {
            var dbRetry = function () {
                thisObj.log('Testing databases again');
                this.updateAppData();
            };
            var delayedDbRetry = Ext.Function.createDelayed(dbRetry, 500, this);

            delayedDbRetry();

            thisObj.log('Databases are not ready.');
        }
    },

    updateSectionData: function() {
        var thisObj = this;

        thisObj.setMessage('Getting Sector Information');

        var sectorDataStore = Ext.getStore('ProjectCategoryData');

        sectorDataStore.on('progressUpdate', function(currentProgress) {
            thisObj.setMessage('Storing Sector Information');

            thisObj.setSectorProgressTotal(currentProgress);
            thisObj.setProgress(
                Math.ceil(
                    (thisObj.getProductCategoriesProgressTotal()
                        + thisObj.getSectorProgressTotal()
                        + thisObj.getProjectProgressTotal()
                        + thisObj.getNavigationProgressTotal()
                        + thisObj.getInfoProgressTotal()) / 5
                )
            )

            if (currentProgress == 100) {
                sectorDataStore.un('progressUpdate');

                thisObj.updateProjectData();
            }
        });

        // Query region update
        sectorDataStore.checkDataVersionAndUpdateDateIfRequired();
    },

    updateProjectData: function() {
        var thisObj = this;

        thisObj.setMessage('Getting Project Information');

        var projectDataStore = Ext.getStore('ProjectData');

        projectDataStore.on('progressUpdate', function(currentProgress) {
            thisObj.setMessage('Storing Project Information');

            thisObj.setProjectProgressTotal(currentProgress);
            thisObj.setProgress(
                Math.ceil(
                    (thisObj.getProductCategoriesProgressTotal()
                        + thisObj.getSectorProgressTotal()
                        + thisObj.getProjectProgressTotal()
                        + thisObj.getNavigationProgressTotal()
                        + thisObj.getInfoProgressTotal()) / 5
                )
            )

            if (currentProgress == 100) {
                projectDataStore.un('progressUpdate');

                thisObj.updateProductCategoriesData();
            }
        });

        // Query region update
        projectDataStore.checkDataVersionAndUpdateDateIfRequired();
    },

    updateProductCategoriesData: function() {
        var thisObj = this;

        thisObj.setMessage('Getting Product Categories Information');

        var productCategoriesDataStore = Ext.getStore('ProductCategoryData');

        productCategoriesDataStore.on('progressUpdate', function(currentProgress) {
            thisObj.setMessage('Storing Product Category information');

            thisObj.setProductCategoriesProgressTotal(currentProgress);
            thisObj.setProgress(
                Math.ceil(
                    (thisObj.getProductCategoriesProgressTotal()
                        + thisObj.getSectorProgressTotal()
                        + thisObj.getProjectProgressTotal()
                        + thisObj.getNavigationProgressTotal()
                        + thisObj.getInfoProgressTotal()) / 5
                )
            )

            if (currentProgress == 100) {
                productCategoriesDataStore.un('progressUpdate');

                thisObj.updateNavigationData();
            }
        });

        // Query region update
        productCategoriesDataStore.checkDataVersionAndUpdateDateIfRequired();
    },

    updateNavigationData: function() {
        var thisObj = this;

        thisObj.setMessage('Getting Navigation Information');

        var navigationDataStore = Ext.getStore('NavigationData');

        navigationDataStore.on('progressUpdate', function(currentProgress) {
            thisObj.setMessage('Storing navigation information');

            thisObj.setNavigationProgressTotal(currentProgress);
            thisObj.setProgress(
                Math.ceil(
                    (thisObj.getProductCategoriesProgressTotal()
                        + thisObj.getSectorProgressTotal()
                        + thisObj.getProjectProgressTotal()
                        + thisObj.getNavigationProgressTotal()
                        + thisObj.getInfoProgressTotal()) / 5
                )
            )

            if (currentProgress == 100) {
                navigationDataStore.un('progressUpdate');

                thisObj.updateInfomationData();
            }
        });

        // Query region update
        navigationDataStore.checkDataVersionAndUpdateDateIfRequired();
    },

    updateInfomationData: function() {
        var thisObj = this;

        thisObj.setMessage('Getting Navigation Information');

        var infoDataStore = Ext.getStore('InfoData');

        infoDataStore.on('progressUpdate', function(currentProgress) {
            thisObj.setMessage('Storing navigation information');

            thisObj.setInfoProgressTotal(currentProgress);
            thisObj.setProgress(
                Math.ceil(
                    (thisObj.getProductCategoriesProgressTotal()
                        + thisObj.getSectorProgressTotal()
                        + thisObj.getProjectProgressTotal()
                        + thisObj.getNavigationProgressTotal()
                        + thisObj.getInfoProgressTotal()) / 5
                )
            )

            if (currentProgress == 100) {
                infoDataStore.un('progressUpdate');

                thisObj.updateAppDataComplete();
            }
        });



        infoDataStore.removeAllRecords();
        infoDataStore.removeAllRecords();

        setTimeout(function() {
            infoDataStore.checkDataVersionAndUpdateDateIfRequired();
        },1000);


    },

    updateAppDataComplete: function() {
        var thisObj = this;

        thisObj.log('Getting ready to change back');

        var delayedFunction = Ext.Function.createDelayed(function () {
            location.reload();
        }, 3000);

        delayedFunction();

        this.setMessage('Restarting App');
    },

    setProgress: function(progress) {
        this.setCurrentProgress(progress);

        // Set the progress text
        Ext.get(
            Ext.DomQuery.select('#update-screen .progress-text h1')
        ).setHtml(progress + '%');

        // Set the progress bar
        Ext.get(
            Ext.DomQuery.select('.meter span')
        ).setWidth(progress + '%');
    },

    setMessage: function(text) {

        // Set the message text
        Ext.get(
            Ext.DomQuery.select('#update-screen .summary h1')
        ).setHtml(text);
    }
});