Ext.define('app.store.InfoPageData', {
    extend: 'app.store.Base',

    requires: [
        'app.store.SettingsData',
        'app.model.InfoPage',
        'app.store.Base'
    ],

    properties: {
        settingsKey: 'information-version',
        ajaxTimeout: 60000,
        offlineDataUrl: 'data/info-page-data.json'
    },

    config :{
        debugMode: true,
        model: 'app.model.InfoPage',
        storeId: "InfoData",
        autoLoad: true,
        listeners: {
            addrecords: function( store, records, eOpts ) {

            },
            beforeload: function( store, operation, eOpts ) {

            },
            beforesync: function( options, eOpts ) {

            },
            clear: function( thisObj, eOpts ) {

            },
            load: function( thisObj, records, successful, operation, eOpts ) {
                thisObj.setIsReady(true);
            },
            metachange: function( thisObj, data, eOpts ) {

            },
            refresh: function( thisObj, data, eOpts ) {

            },
            removerecords: function( store, records, indices, eOpts ) {

            },
            updaterecord: function( thisObj, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues, eOpts ) {

            },
            write: function( store, operation, eOpts ) {

            },
            retrievedExternalData: function(data) {
                this.log("InfoPageData retrievedData");
                this.retrievedExternalData(data);
            },
            retrievedExternalDataFailed: function() {
                this.log("InfoPageData retrievedDataFailed");
            },
            retrievedExternalDataVersion: function(versionString) {
                this.log("InfoPageData retrievedDataVersion");
                this.retrievedExternalDataVersion(versionString);
            },
            retrievedExternalDataVersionFailed: function(errorString) {
                this.log("InfoPageData retrievedDataVersionFailed");
            },
            progressUpdate: function(currentProgress) {
                this.log('InfoPageData: ' + currentProgress);

                this.setProgress(currentProgress);
            }
        }
    },

    checkDataVersionAndUpdateDateIfRequired: function() {
        this.fireEvent('progressUpdate', 0);

        if ( this.isEmpty() ) {
            // Get the cms data
            this.log('InfoData is empty');

            // get the data
            this.getOnlineData();
        } else {
            this.log('InfoData not empty');

            // Check for update
            this.getOnlineDataVersion();
        }
    },

    getAjaxDataUrl: function() {
        return app.app.apiUrl + 'Information.php';
    },

    getAjaxUpdateUrl: function() {
        return app.app.apiUrl + 'Information.php?update=1';
    },

    getOfflineData: function() {
        var thisObj = this;

        // Load the offline data
        Ext.Ajax.request({
            url: thisObj.getOfflineDataUrl(),
            timeout: thisObj.getAjaxTimeout(),
            cache: false,
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
            cache: false,
            success: function(response, opts) {
                var data = Ext.JSON.decode(response.responseText.trim());

                console.log('Info Data');
                console.log(data);

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

    getOnlineDataVersion: function() {
        // Increase this scope
        var thisObj = this;

        // Get the online data
        Ext.Ajax.request({
            url: thisObj.getAjaxUpdateUrl(),
            timeout: thisObj.getAjaxTimeout(),
            cache: false,
            success: function(response, opts) {
                var data = Ext.JSON.decode(response.responseText.trim());

                // Send the data out for parsing
                if (data != '') {
                    thisObj.fireEvent('retrievedExternalDataVersion', data.version);

                } else {
                    // Data connection failed
                    thisObj.fireEvent('retrievedExternalDataVersionFailed', 'Data Empty');

                    thisObj.fireEvent('progressUpdate', 100);
                }
            },
            failure: function(response, opts) {
                thisObj.fireEvent('retrievedExternalDataVersionFailed', response.status);

                thisObj.fireEvent('progressUpdate', 100);
            }
        });
    },

    removeAllRecords: function () {

        this.removeAllTableData('InfoData');

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

        return this.getTotalCount();
    },

    retrievedExternalData: function(data) {
        var thisObj = this;

        // Get the image data store
        var imageDataStore = Ext.getStore('ImageData');

        // Set the new data version
        this.setDataVersion(data.version);

        Ext.Object.each(data.results, function(key, value) {
            //thisObj.log(key);
            //thisObj.log(value);
            //thisObj.log(value.sector);
            //thisObj.log(Ext.JSON.encode(value.sector));

            var isThumbImageDataSet = false;

            Ext.Object.each(value.Image, function(key, recordValue) {
                if (!isThumbImageDataSet) value.ThumbImageData = recordValue.Image;
                isThumbImageDataSet = true;

                imageDataStore.setImage(recordValue.ImageId, recordValue.Image);
                recordValue.Image = '';
            });

            // Query the database for an existing record
            var infoRecords = thisObj.queryBy(function(record, id){
                if (record.get('slug') === key) return true;
                else return false;
            }, thisObj);

            // Test for the record data
            if (!infoRecords.length) {
                thisObj.add(
                    thisObj.transposeAjaxRecord(key, value)
                );

            } else {
                // A record was found so update the existing
                infoRecords.first().set(
                    thisObj.transposeAjaxRecord(key, value)
                );

                // Delete any extras records
                infoRecords.each(function (item, index, length) {
                    if (index > 0) thisObj.remove(item);
                });
            }
        });

        // Save the data
        this.sync();
        imageDataStore.sync();


        thisObj.fireEvent('progressUpdate', 100);

        this.log('Info data update complete');
    },

    transposeAjaxRecord: function(keyString, ajaxRecord) {
        var thisObj = this;

        var newDataObject = {
            'url': (ajaxRecord.Url == null) ? '': ajaxRecord.Url,
            'ThumbImageData': (ajaxRecord.ThumbImageData == null) ? thisObj.getDefaultThumbImageData(): ajaxRecord.ThumbImageData,
            'Image': (ajaxRecord.Image == null) ? '[]': Ext.JSON.encode(ajaxRecord.Image),
            'Title':(ajaxRecord.Title == null) ? '': ajaxRecord.Title,
            'copy': (ajaxRecord.Copy == null) ? '': Ext.String.htmlDecode(ajaxRecord.Copy)
        }

        return newDataObject;
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
            this.log('Info update in progress');

            this.fireEvent('progressUpdate', 30);

            // Get the data
            this.getOnlineData();
        } else {
            this.log('no update needed');

            this.fireEvent('progressUpdate', 100);
        }
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