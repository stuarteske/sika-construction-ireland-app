Ext.define('app.controller.Home', {
    extend: 'app.controller.Base',

    requires: [
        'app.view.Main',
        'app.view.TopNavigationDataView'
    ],

    config: {
        debugMode: true,

        refs: {
            mainView: 'xtypeMainNavigationView',
            homeNavDataView: 'xtypeTopNavigationDataView'
        },

        before: {},

        control: {
            homeNavDataView: {
                itemtap: 'onHomeNameItemTap'
            },
            mainView: {
                back: 'onNavigationBackBtnTap',
                swipeLeft: 'onSwipeLeft',
                swipeRight: 'onSwipeRight'
            }
        },

        routes: {
            '': 'navigationHome'
        },

        listeners : {}
    },

    init: function() {
        this.log('Init: app.controller.Home');
    },

    navigationHome: function() {
        this.log('Home: #Home');

        var thisObj = this;

        // Get the settings database
        var settingDataStore = Ext.getStore('SettingsData');

        // Get the regions data store
        var navigationDataStore = Ext.getStore('NavigationData');

        // Are the databases ready?
        if (navigationDataStore.isReady() && settingDataStore.isReady()) {
            this.log('Navigation Data Store is ready.');

            // Load the main view
            this.getMainView().push({
                xtype:'xtypeTopNavigationDataView',
                store: navigationDataStore
            });

            if (navigationDataStore.getCount() == 0) {
                navigationDataStore.getOfflineData();
            }

        } else {
            var dbRetry = function () {
                this.log('Testing databases again');
                this.navigationHome();
            };
            var delayedDbRetry = Ext.Function.createDelayed(dbRetry, 250, this);

            delayedDbRetry();

            this.log('Databases are not ready.');
        }
    },

    onHomeNameItemTap: function(thisObj, index, target, record, event) {
        //this.log(record.get('url'));

        window.location.hash = record.get('url');
    },

    onNavigationBackBtnTap: function(thisObj, eOpts) {
        //this.log('Back button tapped');

        window.location.hash = '#back';

        Ext.Viewport.setMasked(false);
    },

    onSwipeLeft: function() {
        // Only slide to update if navigaition curently on the top level
        if(this.getMainView().getInnerItems().length == 1)
            window.location.hash = '#update';
    },

    onSwipeRight: function() {
        // Only slide backwards if navigated below the top view
        if (this.getMainView().getInnerItems().length > 1) {
            window.location.hash = '#back';
            this.getMainView().pop();
        }
    }
});