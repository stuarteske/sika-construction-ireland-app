Ext.define('app.store.ProjectData', {
    extend: 'app.store.Base',

    requires: [
        'app.store.SettingsData',
        'app.model.Projects',
        'app.store.Base'
    ],

    properties: {
        settingsKey: 'projects-version',
        ajaxTimeout: 60000,
        offlineDataUrl: 'data/project-data.json'
    },

    config :{
        debugMode: true,
        model: 'app.model.Projects',
        storeId: "ProjectData",
        autoLoad: true,
        listeners: {
            addrecords: function( store, records, eOpts ) {
                this.log("ProjectData addrecords");
            },
            beforeload: function( store, operation, eOpts ) {
                this.log("ProjectData beforeload");
            },
            beforesync: function( options, eOpts ) {
                this.log("ProjectData beforesync");
            },
            clear: function( thisObj, eOpts ) {
                this.log("ProjectData clear");
            },
            load: function( thisObj, records, successful, operation, eOpts ) {
                this.log("ProjectData load");
                thisObj.setIsReady(true);

                thisObj.verifySqlData('conireland', 'Projects', 'slug');
            },
            metachange: function( thisObj, data, eOpts ) {
                this.log("ProjectData metachange");
            },
            refresh: function( thisObj, data, eOpts ) {
                this.log("ProjectData refresh");
            },
            removerecords: function( store, records, indices, eOpts ) {
                this.log("ProjectData removerecords");
            },
            updaterecord: function( thisObj, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues, eOpts ) {
                this.log("ProjectData updaterecord");
            },
            write: function( store, operation, eOpts ) {
                this.log("ProjectData write");
            },
            retrievedExternalData: function(data) {
                this.log("ProjectData retrievedData");
                this.retrievedExternalData(data);
            },
            retrievedExternalDataFailed: function() {
                this.log("ProjectData etrievedDataFailed");
            },
            retrievedExternalDataVersion: function(versionString) {
                this.log("ProjectData retrievedDataVersion");
                this.retrievedExternalDataVersion(versionString);
            },
            retrievedExternalDataVersionFailed: function(errorString) {
                this.log("ProjectData retrievedDataVersionFailed");
            },
            progressUpdate: function(currentProgress) {
                this.log('ProjectData: ' + currentProgress);

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
            this.getOnlineData();
        } else {
            this.log('ProjectData not empty');

            // Check for update
            this.getOnlineDataVersion();
        }
    },

    getAjaxDataUrl: function() {
        return 'http://construction.ireland.sika.cfadigital.com/api/Projects.php';
    },

    getAjaxUpdateUrl: function() {
        return 'http://construction.ireland.sika.cfadigital.com/api/Projects.php?update=1';
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

                console.log('Project Data');
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
        this.removeAllTableData('Projects');

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

            // Query the region database for an existing record
            var projectRecords = thisObj.queryBy(function(record, id){
                if (record.get('slug') === key) return true;
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


        thisObj.fireEvent('progressUpdate', 100);

        this.log('Project data update complete');
    },

    transposeAjaxRecord: function(keyString, ajaxRecord) {
        var thisObj = this;

        var newDataObject = {
            'slug': (keyString == null) ? '': keyString,
            'Title': (ajaxRecord.Title == null) ? '': ajaxRecord.Title,
            'Copy': (ajaxRecord.Copy == null) ? '': Ext.String.htmlDecode(ajaxRecord.Copy),
            'ThumbImageData': (ajaxRecord.ThumbImageData == null) ? thisObj.getDefaultThumbImageData(): ajaxRecord.ThumbImageData,
            'Image': (ajaxRecord.Image == null) ? '[]': Ext.JSON.encode(ajaxRecord.Image),
            'Architect': (ajaxRecord.Architect == null || ajaxRecord.Architect == 0) ? '': ajaxRecord.Architect,
            'Contractor': (ajaxRecord.Contractor == null || ajaxRecord.Contractor == '0') ? '': ajaxRecord.Contractor,
            'categories': (ajaxRecord.Sector == null) ? '[]': Ext.JSON.encode(ajaxRecord.Sector),
            'solutions': (ajaxRecord.ProductCategory == null) ? '[]' : Ext.JSON.encode(ajaxRecord.ProductCategory),
            'system': (ajaxRecord.System == null || ajaxRecord.System == '0') ? '': ajaxRecord.System
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
            this.log('Projects update in progress');

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
