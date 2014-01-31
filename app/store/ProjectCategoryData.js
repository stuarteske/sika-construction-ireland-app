Ext.define('app.store.ProjectCategoryData', {
    extend: 'app.store.Base',

    requires: [
        'app.store.SettingsData',
        'app.model.ProductCategories',
        'app.store.Base'
    ],

    properties: {
        settingsKey: 'project-categories-version',
        offlineDataUrl: 'data/project-categories-data.json'
    },

    config :{
        debugMode: true,
        model: 'app.model.ProjectCategories',
        storeId: "ProjectCategoryData",
        autoLoad: true,
        listeners: {
            addrecords: function( store, records, eOpts ) {
                this.log("ProjectCategoryData addrecords");
            },
            beforeload: function( store, operation, eOpts ) {
                this.log("ProjectCategoryData beforeload");
            },
            beforesync: function( options, eOpts ) {
                this.log("ProjectCategoryData beforesync");
            },
            clear: function( thisObj, eOpts ) {
                this.log("ProjectCategoryData clear");
            },
            load: function( thisObj, records, successful, operation, eOpts ) {
                this.log("ProjectCategoryData load");
                thisObj.setIsReady(true);
            },
            metachange: function( thisObj, data, eOpts ) {
                this.log("ProjectCategoryData metachange");
            },
            refresh: function( thisObj, data, eOpts ) {
                this.log("ProjectCategoryData refresh");
            },
            removerecords: function( store, records, indices, eOpts ) {
                this.log("ProjectCategoryData removerecords");
            },
            updaterecord: function( thisObj, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues, eOpts ) {
                this.log("ProjectCategoryData updaterecord");
            },
            write: function( store, operation, eOpts ) {
                this.log("ProjectCategoryData write");
            },
            retrievedExternalData: function(data) {
                this.log("ProjectCategoryData retrievedData");
                this.retrievedExternalData(data);
            },
            retrievedExternalDataFailed: function() {
                this.log("ProjectCategoryData RetrievedDataFailed");
            },
            retrievedExternalDataVersion: function(versionString) {
                this.log("ProjectCategoryData retrievedDataVersion");
                this.retrievedExternalDataVersion(versionString);
            },
            retrievedExternalDataVersionFailed: function(errorString) {
                this.log("ProjectCategoryData retrievedDataVersionFailed");
            },
            progressUpdate: function(currentProgress) {
                this.log('ProjectCategoryData: ' + currentProgress);

                this.setProgress(currentProgress);
            }
        }
    },

    checkDataVersionAndUpdateDateIfRequired: function() {
        var thisObj = this;

        thisObj.fireEvent('progressUpdate', 0);

        if ( this.isEmpty() ) {
            // Get the cms data
            this.log('ProjectCategoryData is empty');

            // get the data
            thisObj.getOnlineData();
        } else {
            this.log('ProjectCategoryData not empty');

            // Check for update
            thisObj.getOnlineDataVersion();
        }
    },

    getAjaxDataUrl: function() {
        return app.app.apiUrl + 'sectors.php';
    },

    getAjaxUpdateUrl: function() {
        return app.app.apiUrl + 'sectors.php?update=1';
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
        this.removeAllTableData('ProjectCategories');

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
        var slug = (ajaxRecord.urlId == null) ? '': ajaxRecord.urlId;
        slug = slug.toLowerCase();
        slug = slug.replace(" ","-");

        var newDataObject = {
            'imageData': (ajaxRecord.Image[0].Image == null) ? '': ajaxRecord.Image[0].Image,
            'title': (ajaxRecord.Title == null) ? '': ajaxRecord.Title,
            'slug': slug
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
