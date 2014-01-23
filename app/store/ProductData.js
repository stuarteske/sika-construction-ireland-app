Ext.define('app.store.ProductData', {
    extend: 'app.store.Base',

    requires: [
        'app.store.SettingsData',
        'app.store.ImageData',
        'app.model.Products',
        'app.store.Base'
    ],

    properties: {
        settingsKey: 'product-data-version',
        ajaxTimeout: 60000,
        offlineDataUrl: 'data/product-data.json'
    },

    config :{
        debugMode: true,
        model: 'app.model.Products',
        storeId: "ProductData",
        autoLoad: true,
        listeners: {
            addrecords: function( store, records, eOpts ) {
                this.log("ProductData addrecords");
            },
            beforeload: function( store, operation, eOpts ) {
                this.log("ProductData beforeload");
            },
            beforesync: function( options, eOpts ) {
                this.log("ProductData beforesync");
            },
            clear: function( thisObj, eOpts ) {
                this.log("ProductData clear");
            },
            load: function( thisObj, records, successful, operation, eOpts ) {
                this.log("ProductData load");
                thisObj.setIsReady(true);
            },
            metachange: function( thisObj, data, eOpts ) {
                this.log("ProductData metachange");
            },
            refresh: function( thisObj, data, eOpts ) {
                this.log("ProductData refresh");
            },
            removerecords: function( store, records, indices, eOpts ) {
                this.log("ProductData removerecords");
            },
            updaterecord: function( thisObj, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues, eOpts ) {
                this.log("ProductData updaterecord");
            },
            write: function( store, operation, eOpts ) {
                this.log("ProductData write");
            },
            retrievedExternalData: function(data) {
                this.log("ProductData retrievedData");
                this.retrievedExternalData(data);
            },
            retrievedExternalDataFailed: function() {
                this.log("ProductData etrievedDataFailed");
            },
            retrievedExternalDataVersion: function(versionString) {
                this.log("ProductData retrievedDataVersion");
                this.retrievedExternalDataVersion(versionString);
            },
            retrievedExternalDataVersionFailed: function(errorString) {
                this.log("ProductData retrievedDataVersionFailed");
            },
            progressUpdate: function(currentProgress) {
                this.log('ProductData: ' + currentProgress);

                this.setProgress(currentProgress);
            }
        }
    },

    checkDataVersionAndUpdateDateIfRequired: function() {
        this.fireEvent('progressUpdate', 0);

        if ( this.isEmpty() ) {
            // Get the cms data
            this.log('ProjectData is empty');

            // get the data
            thisObj.getOnlineData();
        } else {
            this.log('ProjectData not empty');

            // Check for update
            thisObj.getOnlineDataVersion();
        }
    },

    getAjaxDataUrl: function() {
        return '';
    },

    getAjaxUpdateUrl: function() {
        return '';
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
                this.log('server-side failure with status code ' + response.status);
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

                thisObj.fireEvent('progressUpdate', 25);
            }
        });
    },

    removeAllRecords: function () {
        this.removeAllTableData('Products');

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

        // Get the image data store
        var imageDataStore = Ext.getStore('ImageData');

        // Set the new data version
        this.setDataVersion(data.version);

        Ext.Object.each(data.results, function(key, value) {
            thisObj.log(key);
            thisObj.log(value);

            var isThumbImageDataSet = false;

            Ext.Object.each(value.Image, function(key, recordValue) {
                if (!isThumbImageDataSet) value.ThumbImageData = recordValue.Image;
                isThumbImageDataSet = true;

                imageDataStore.setImage(recordValue.ImageId, recordValue.Image);
                recordValue.Image = '';
            });

            // Query the region database for an existing record
            var projectRecords = thisObj.queryBy(function(record, id){
                if (record.get('urlId') === key) return true;
                else return false;
            }, thisObj);

            // Test for the record data
            if (!projectRecords.length) {

                thisObj.add(
                    thisObj.transposeAjaxRecord(key, value)
                );

            } else {
                // A record was found so update the existing
                projectRecords.first().set(
                    thisObj.transposeAjaxRecord(key, value)
                );

                // Delete any extras records
                projectRecords.each(function (item, index, length) {
                    if (index > 0) thisObj.remove(item);
                });
            }
        });

        // Save the data
        this.sync();
        imageDataStore.sync();

        this.fireEvent('progressUpdate', 100);

        this.log('Project data update complete');
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
            this.log('Projects update in progress');

            this.fireEvent('progressUpdate', 30);

            // Get the data
            this.getOnlineData();
        } else {
            this.log('no update needed');

            this.fireEvent('progressUpdate', 100);
        }
    },

    transposeAjaxRecord: function(keyString, ajaxRecord) {
        var thisObj = this;

        var newDataObject = {
            'slug': (keyString == null) ? '': keyString,
            'Title': (ajaxRecord.Title == null) ? '': ajaxRecord.Title,
            'Intro': (ajaxRecord.Intro == null) ? '': ajaxRecord.Intro,
            'Copy': (ajaxRecord.Copy == null) ? '': Ext.String.htmlDecode(ajaxRecord.Copy),
            'ThumbImageData': (ajaxRecord.ThumbImageData == null) ? thisObj.getDefaultThumbImageData(): ajaxRecord.ThumbImageData,
            'Image': (ajaxRecord.Image == null) ? '[]': Ext.JSON.encode(ajaxRecord.Image),
            'Download': (ajaxRecord.Download == null) ? '': ajaxRecord.Download,
            'project_title': (ajaxRecord.project_title == null) ? '': ajaxRecord.project_title,
            'Architect': (ajaxRecord.Architect == null) ? '': ajaxRecord.Architect,
            'Contractor': (ajaxRecord.Contractor == null) ? '': ajaxRecord.Contractor,
            'categories': (ajaxRecord.categories == null) ? '[]': Ext.JSON.encode(ajaxRecord.categories)
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
