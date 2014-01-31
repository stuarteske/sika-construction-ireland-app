Ext.define('app.store.ImageData', {
    extend: 'app.store.Base',

    requires: ['app.model.Images'],

    properties: {
        isReady: false
    },

    config :{
        debugMode: true,
        model: 'app.model.Images',
        storeId: "ImageData",
        autoLoad: true,
        listeners: {
            load: function() {
                // Verify the data
                this.verifySqlData(app.app.dbName, 'Images', 'imageId');
            },
            updaterecord : function() {
                this.log("ImageData Update Record");
            },
            recordVerified: function(recordId) {
                this.log("ImageData Verification Record: " + recordId);
            },
            sync: function() {
                this.log("ImageData Sync");
            },
            save: function() {
                this.log("ImageData Save");
            }
        }
    },

    getImage: function(imageId) {

        // Query the image database for an existing record
        var imageRecords = this.queryBy(function(record, id){
            if (record.get('imageId') === imageId) return true;
            else return false;
        }, this);

        if (imageRecords.getCount()) return imageRecords.first().get('imageData');
        else return null;
    },

    setImage: function(imageId, imageData) {
        var thisObj = this;

        // Query the image database for an existing record
        var imageRecords = this.queryBy(function(record, id){
            if (record.get('imageId') === imageId) return true;
            else return false;
        }, this);

        // Test for the record data
        if (!imageRecords.length) {
            // No record exists so add one.
            this.add({
                'imageId': imageId,
                'imageData': imageData
            });
        } else {
            // A record was found so update the existing
            imageRecords.first().set({
                'imageId': imageId,
                'imageData': imageData
            });

            // Delete any extras records
            imageRecords.each(function (item, index, length) {
                if (index > 0) thisObj.remove(item);
            });
        }
    },

    isReady: function() {
        return this.getIsReady();
    },

    getIsReady: function() {
        return this.properties.isReady;
    },

    setIsReady: function(isReady) {
        this.properties.isReady = isReady;
    }
});