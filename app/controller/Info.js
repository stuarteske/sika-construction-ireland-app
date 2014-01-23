Ext.define('app.controller.Info', {
    extend: 'app.controller.Base',

    requires: [
        'app.view.Main',
        'app.view.info.InfoPageDataView',
        'app.view.info.InfoPageDetailContainerView',
        'app.view.info.InfoPageDetailContainerBackContainerView'
    ],

    config: {
        debugMode: true,

        refs: {
            mainView: 'xtypeMainNavigationView',
            infoPageDataView: 'xtypeInfoPageDataView',
            infoPageDetailContainerView: 'xtypeInfoPageDetailContainerView',
            infoPageNavigationBackButton: 'xtypeInfoPageDetailContainerBackContainerView'
        },

        before: {},

        control: {
            infoPageDataView: {
                itemtap: 'onInfoNavItemTap'
            },
            infoPageNavigationBackButton: {
                tap: 'onNavigationBackBtnTap'
            },
            infoPageDetailContainerView:  {
                swipeRight: 'onSwipeRight'
            }
        },

        routes: {
            'info': 'navigationInfo',
            'info/:id': 'navigationInfoPage'
        },

        listeners : {}
    },

    init: function() {
        this.log('Init: app.controller.Info');
    },

    navigationInfo: function() {
        this.log('Navigation: #Info');

        // Get the Sectors data store
        var infoPageDataStore = Ext.getStore('InfoData');
        var settingsDataStore = Ext.getStore('SettingsData');

        // Are the databases ready?
        if (infoPageDataStore.isReady() && settingsDataStore.isReady()) {
            this.log('Data Stores are ready.');

            // store has data?
            if (!infoPageDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                infoPageDataStore.getOfflineData();
            }

            var afterDataLoad = function () {
                Ext.Viewport.setMasked(false);

                // Load the main view
                this.getMainView().push({
                    xtype:'xtypeInfoPageDataView',
                    store: infoPageDataStore
                });
            };

            if (!infoPageDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
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

    onInfoNavItemTap: function(thisObj, index, target, record, event) {
        window.location.hash = '#info/' + record.get('url');
    },

    navigationInfoPage: function(id) {
        this.log('Navigation: #Info/' + id);

        // Get the InfoPage data store
        var infoPageDataStore = Ext.getStore('InfoData');

        // Are the databases ready?
        if (infoPageDataStore.isReady()) {
            this.log('Data Stores are ready.');

            var afterDataLoad = function () {
                Ext.Viewport.remove(this.infoPageDetailsView, true);

                Ext.Viewport.setMasked(false);

                // Load the main view
                this.infoPageDetailsView = Ext.create('app.view.info.InfoPageDetailContainerView', {
                    record: infoPageDataStore.findRecord('url', id)
                });

                Ext.Viewport.add([this.infoPageDetailsView]);

                Ext.Viewport.animateActiveItem(this.infoPageDetailsView, { type: 'slide', direction: 'left' });
            };

            if (!infoPageDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
                else var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 0, this);

            delayedAfterDataLoad();

        } else {
            var dbRetry = function () {
                this.log('Testing databases again');
                this.navigationInfoPage();
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