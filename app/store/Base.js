Ext.define('app.store.Base', {
    extend: 'Ext.data.Store',

    mixins: ['Ext.mixin.Observable'],

    properties: {
        isReady: false,
        progress: false,
        settingsKey: '',
        ajaxTimeout: 30000,
        offlineDataUrl: ''
    },

    config :{
        autoLoad: true,
        debugMode: true,
        defaultThumbImageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAACRCAMAAAAb4ZYGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCMjFENEU3RjY3MkQxMUUzQUU0MEIzMkU2MEIwMTQwQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCMjFENEU4MDY3MkQxMUUzQUU0MEIzMkU2MEIwMTQwQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkIyMUQ0RTdENjcyRDExRTNBRTQwQjMyRTYwQjAxNDBBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkIyMUQ0RTdFNjcyRDExRTNBRTQwQjMyRTYwQjAxNDBBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+lHY/CwAAAYBQTFRFMWaWc8zkMXOq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',
        databaseName: 'Sarnafill'
    },

    getDatabaseConnection: function() {
        // Make the sql connection
        return openDatabase(
            this.getDatabaseName(),
            '1.0',
            '',
            10 * 1024 * 1024
        );
    },

    removeAllTableData: function(tableName) {
        //console.log('Removing Record ready');

        // Make the sql connection
        var db = this.getDatabaseConnection();

        // Do the transaction
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM ' + tableName, [], function (tx, results) {});
            //console.log('Run the sql');
        });
    },

    verifySqlData: function(dbName, dbTableName, modelFieldName) {
        // Get a handel on the class
        var thisObj = this;

        // Make the sql connection
        var db = this.getDatabaseConnection();

        // Do the transaction
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM ' + dbTableName, [], function (tx, results) {

                // Get the result length
                var resultLength = results.rows.length, i;

                // Get the store length
                var thisLength = thisObj.getCount();

                // If they are not equal then there is data missing
                if (resultLength != thisLength) {

                    // Load the missing data
                    for (i = 0; i < resultLength; i++) {

                        // Try and find the id of the records
                        var checkedRecordId = thisObj.find(
                            modelFieldName,
                            results.rows.item(i)[modelFieldName]
                        )

                        // If -1 then it is missing, so add it
                        if (checkedRecordId < 0) {
                            thisObj.add(
                                results.rows.item(i)
                            );

                            thisObj.fireEvent(
                                'recordVerified',
                                results.rows.item(i)[modelFieldName]
                            );
                        }
                    }
                }

                // Data ready flag
                thisObj.setIsReady(true);
            });
        });
    },

    queryByCategories: function(categoryString) {

        categoryString = categoryString.toLowerCase();
        categoryString = categoryString.replace(/ /g,"-");

        //console.log('Search Key: ' + categoryString);

        var tempStore = new app.store.Base();

        tempStore.data = this.queryBy(function(record, id) {

            var returnFlag = false;

            if (record.get('categories') != '') {

                //console.log('Categorie JSON: ');
                //console.log(record.get('categories'));
                //console.log(' ');

                var attachedSectors = Ext.JSON.decode(
                    record.get('categories'),
                    false
                );

                //console.log('Attached Sectors: ');
                //console.log(attachedSectors);
                //console.log(attachedSectors.length);
                //console.log(' ');

                var returnFlag = false;

                if (attachedSectors.length) {
                    Ext.each(attachedSectors, function(item){
                        //console.log('Item Object');
                        //console.log(item);
                        //console.log(item.urlId);
                        //console.log(' ');

                        if (item.urlId) {
                            item.urlId = item.urlId.toLowerCase();
                            item.urlId = item.urlId.replace(/ /g,"-");

                            //console.log('Found Key: ' + item.urlId);

                            if (item.urlId === categoryString) {
                                //console.log('Matched Key: ');
                                //console.log(item.urlId);
                                //console.log(' ');

                                returnFlag = true;
                            }
                        }
                    })
                }
            }

            //console.log('Return Flag: ');
            //console.log(returnFlag);
            //console.log(' ');

            return returnFlag;
        }, this);

        //console.log('Return Objects: ');
        //console.log(tempStore);
        //console.log(' ');
        //console.log('---------');
        //console.log(' ');

        return tempStore;
    },

    queryBySolutions: function(solutionString) {

        solutionString = solutionString.toLowerCase();
        solutionString = solutionString.replace(/ /g,"-");

        //console.log('Search Key: ' + solutionString);

        var tempStore = new app.store.Base();

        tempStore.data = this.queryBy(function(record, id) {

            var returnFlag = false;

            if (record.get('solutions') != '') {
                var records = Ext.JSON.decode(
                    record.get('solutions')
                );

                var returnFlag = false;

                if (records.length) {

                    Ext.each(records, function(item){

                        if (item.urlId) {
                            item.urlId = item.urlId.toLowerCase();
                            item.urlId = item.urlId.replace(/ /g,"-");

                            //console.log('Found Key: ' + item.urlId);

                            if (item.urlId === solutionString) {
                                //console.log('Matched Key: ' + item.urlId);
                                returnFlag = true;
                            }
                        }
                    });
                }
            }

            return returnFlag;
        }, this);

        return tempStore;
    },

    isEmpty: function() {
        if ( !this.getCount() ) return true;
        else return false;
    },

    isReady: function() {
        return this.getIsReady();
    },

    getIsReady: function() {
        return this.properties.isReady;
    },

    setIsReady: function(isReady) {
        this.properties.isReady = isReady;
    },

    getProgress: function() {
        return this.properties.Progress;
    },

    setProgress: function(currentProgress) {
        this.properties.Progress = currentProgress;
    },

    getSettingsKey: function() {
        return this.properties.settingsKey;
    },

    getAjaxTimeout: function() {
        return this.properties.ajaxTimeout;
    },

    getOfflineDataUrl: function() {
        return this.properties.offlineDataUrl;
    },

    log: function(printObject) {
        if (app.app.debugMode && this.getDebugMode()) {
            console.log(printObject);
        }
    }
});
