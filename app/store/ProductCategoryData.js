Ext.define('app.store.ProductCategoryData', {
    extend: 'app.store.Base',

    requires: [
        'app.store.SettingsData',
        'app.model.ProductCategories',
        'app.store.Base'
    ],

    properties: {
        settingsKey: 'product-categories-version',
        offlineDataUrl: 'data/product-categories-data.json'
    },

    config :{
        debugMode: true,
        model: 'app.model.ProductCategories',
        storeId: "ProductCategoryData",
        autoLoad: true,
        listeners: {
            addrecords: function( store, records, eOpts ) {
                this.log("ProductCategoryData addrecords");
            },
            beforeload: function( store, operation, eOpts ) {
                this.log("ProductCategoryData beforeload");
            },
            beforesync: function( options, eOpts ) {
                this.log("ProductCategoryData beforesync");
            },
            clear: function( thisObj, eOpts ) {
                this.log("ProductCategoryData clear");
            },
            load: function( thisObj, records, successful, operation, eOpts ) {
                this.log("ProductCategoryData load");
                thisObj.setIsReady(true);
            },
            metachange: function( thisObj, data, eOpts ) {
                this.log("ProductCategoryData metachange");
            },
            refresh: function( thisObj, data, eOpts ) {
                this.log("ProductCategoryData refresh");
            },
            removerecords: function( store, records, indices, eOpts ) {
                this.log("ProductCategoryData removerecords");
            },
            updaterecord: function( thisObj, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues, eOpts ) {
                this.log("ProductCategoryData updaterecord");
            },
            write: function( store, operation, eOpts ) {
                this.log("ProductCategoryData write");
            },
            retrievedExternalData: function(data) {
                this.log("ProductCategoryData retrievedData");
                this.retrievedExternalData(data);
            },
            retrievedExternalDataFailed: function() {
                this.log("ProductCategoryData RetrievedDataFailed");
            },
            retrievedExternalDataVersion: function(versionString) {
                this.log("ProductCategoryData retrievedDataVersion");
                this.retrievedExternalDataVersion(versionString);
            },
            retrievedExternalDataVersionFailed: function(errorString) {
                this.log("ProductCategoryData retrievedDataVersionFailed");
            },
            progressUpdate: function(currentProgress) {
                this.log('ProductCategoryData: ' + currentProgress);

                this.setProgress(currentProgress);
            }
        }
    },

    checkDataVersionAndUpdateDateIfRequired: function() {
        var thisObj = this;

        thisObj.fireEvent('progressUpdate', 0);

        if ( this.isEmpty() ) {
            // Get the cms data
            this.log('ProductCategoryData is empty');

            // get the data
            thisObj.getOnlineData();
        } else {
            this.log('ProductCategoryData not empty');

            // Check for update
            thisObj.getOnlineDataVersion();
        }
    },

    getAjaxDataUrl: function() {
        return 'http://construction.sika.cfadigital.com/api/ProductCategories.php';
    },

    getAjaxUpdateUrl: function() {
        return 'http://construction.sika.cfadigital.com/api/ProductCategories.php?update=1';
    },

    getOfflineData: function() {
        var thisObj = this;

        // Load the offline data
        Ext.Ajax.request({
            url: thisObj.getOfflineDataUrl(),
            timeout: thisObj.getAjaxTimeout(),
            success: function(response, opts) {
                var data = Ext.JSON.decode(response.responseText.trim());

                // Send the data out for parsing
                if (data != '') {
                    thisObj.fireEvent('retrievedExternalData', data);
                } else {
                    // Data connection failed
                    thisObj.fireEvent('retrievedExternalDataFailed', 'Data returned Empty');

                    thisObj.fireEvent('progressUpdate', 100);
                }
            },
            failure: function(response, opts) {
                thisObj.log('server-side failure with status code ' + response.status);
                thisObj.fireEvent('retrievedExternalDataFailed', response.status);

                thisObj.fireEvent('progressUpdate', 100);
            }
        });
    },

    getOnlineData: function() {
        // Get the settings database
        var settingDataStore = Ext.getStore('SettingsData');

        // Increase this scope
        var thisObj = this;

        thisObj.removeAllRecords();

        thisObj.fireEvent('progressUpdate', 40);

        // Get the online data
        Ext.Ajax.request({
            url: this.getAjaxDataUrl(),
            timeout: this.getAjaxTimeout(),
            success: function(response, opts) {
                var data = Ext.JSON.decode(response.responseText.trim());

                // Send the data out for parsing
                if (data != '') {
                    thisObj.fireEvent('retrievedExternalData', data);
                } else {
                    // Data connection failed
                    thisObj.fireEvent('retrievedExternalDataFailed', 'Data returned Empty');

                    thisObj.fireEvent('progressUpdate', 100);
                }
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
                thisObj.fireEvent('retrievedExternalDataFailed', response.status);

                thisObj.fireEvent('progressUpdate', 100);
            }
        });
    },

    getOnlineDataVersion: function() {
        // Increase this scope
        var thisObj = this;

        // Get the online data
        Ext.Ajax.request({
            url: thisObj.getAjaxUpdateUrl(),
            timeout: thisObj.getAjaxTimeout(),
            success: function(response, opts) {
                var data = Ext.JSON.decode(response.responseText.trim());

                thisObj.fireEvent('progressUpdate', 25);

                // Send the data out for parsing
                if (data != '') {
                    thisObj.fireEvent('retrievedExternalDataVersion', data.version);
                } else {
                    // Data connection failed
                    thisObj.fireEvent('retrievedExternalDataVersionFailed', 'Data Empty');
                }
            },
            failure: function(response, opts) {
                thisObj.fireEvent('retrievedExternalDataVersionFailed', response.status);

                thisObj.fireEvent('progressUpdate', 100);
            }
        });
    },

    removeAllRecords: function () {
        this.removeAllTableData('ProductCategories');

        // Todo: delay and cascade these functions
        if (this.getTotalCount() > 0) {
            this.removeAll();
            this.sync();
            this.load();
        }

        this.data.all = []
        this.data.items = []
        this.data.keys = []
        this.data.length = 0

        this.log('Records remaining: ' + this.getCount());

//        if (this.getTotalCount() > 0) {
//            this.removeAll();
//            this.sync();
//            this.load();
//        }

        if (this.getTotalCount() > 0) return false;
            else true;
    },

    retrievedExternalData: function(data) {
        var thisObj = this;

        // Set the new data version
        this.setDataVersion(data.version);

        Ext.Object.each(data.results, function(key, value) {
            thisObj.log(key);
            thisObj.log(value);

            // Query the region database for an existing record
            var records = thisObj.queryBy(function(record, id){
                if (record.get('slug') === key) return true;
                else return false;
            }, thisObj);

            // Test for the record data
            if (!records.length) {
                // No record exists so add one.

                thisObj.add(
                    thisObj.transposeAjaxRecord(key, value)
                );
            } else {
                // A record was found so update the existing
                records.first().set(
                    thisObj.transposeAjaxRecord(key, value)
                );

                // Delete any extras records
                records.each(function (item, index, length) {
                    if (index > 0) thisObj.remove(item);
                });
            }
        });

        // Save the data
        this.sync();

        this.fireEvent('progressUpdate', 100);

        this.log('Product category data update complete');
    },

    retrievedExternalDataVersion: function(versionString) {
        // Get the settings database
        var settingDataStore = Ext.getStore('SettingsData');

        // get the regions data version value
        var dataVersion = settingDataStore.getSetting(
            this.getSettingsKey(),
            versionString
        );

        if (versionString != dataVersion) {
            this.log('Product category data update in progress');

            this.fireEvent('progressUpdate', 30);

            // Get the data
            this.getOnlineData();
        } else {
            this.log('no update needed');

            this.fireEvent('progressUpdate', 100);
        }
    },

    transposeAjaxRecord: function(keyString, ajaxRecord) {
        var newDataObject = {
            'imageData': (ajaxRecord.Image[0].Image == null) ? '': ajaxRecord.Image[0].Image,
            'title': (ajaxRecord.Title == null) ? '': ajaxRecord.Title,
            'slug': (ajaxRecord.urlId == null) ? '': ajaxRecord.urlId
        }

        return newDataObject;
    },

    setDataVersion: function(versionString) {

        // Get the settings database
        var settingDataStore = Ext.getStore('SettingsData');

        // get the regions data version value
        settingDataStore.setSetting(
            this.getSettingsKey(),
            versionString
        );
    }
});
