Ext.define('app.controller.Sectors', {
    extend: 'app.controller.Base',

    requires: [
        'app.view.Main',
        'app.view.sectors.SectorCategoryContainerDataView',
        'app.view.sectors.ProjectListContainerDataView',
        'app.view.projects.ProjectContainerView',
        'app.view.projects.ProjectContainerBackContainerView'
    ],

    config: {
        debugMode: true,
        categorySlug: '',
        refs: {
            'mainView': 'xtypeMainNavigationView',
            'sectorCategoryDataView': 'xtypeSectorCategoryContainerDataView',
            'projectListDataView': 'xtypeProjectListContainerDataView',
            'projectDetailsView': 'xtypeProjectContainerView',
            'projectNavigationBackBtn': 'xtypeProjectContainerBackContainerView'
        },

        control: {
            sectorCategoryDataView: {
                itemtap: 'onCategoryNavItemTap'
            },
            projectListDataView: {
                itemtap: 'onProjectNavItemTap'
            },
            projectDetailsView: {
                swipeRight: 'onSwipeRight'
            },
            projectNavigationBackBtn: {
                tap: 'onNavigationBackBtnTap'
            }
        },

        routes: {
            'sectors': 'navigationSectors',
            'projects/:categorySlug': 'navigationCategoryView',
            'projects/:categorySlug/:productSlug': 'navigationProjectsView'
        },

        listeners : {}
    },

    init: function() {
        this.log('Init: app.controller.Sectors');
    },

    navigationSectors: function() {
        this.log('Navigation: #Sectors');

        // Get the Sectors data store
        var projectsCategoriesDataStore = Ext.getStore('ProjectCategoryData');
        var settingsDataStore = Ext.getStore('SettingsData');

        // Are the databases ready?
        if (projectsCategoriesDataStore.isReady() && settingsDataStore.isReady()) {
            this.log('Data Stores are ready.');

            // store has data?
            if (!projectsCategoriesDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                projectsCategoriesDataStore.getOfflineData();
            }

            var afterDataLoad = function () {
                Ext.Viewport.setMasked(false);

                // Load the main view
                this.getMainView().push({
                    xtype:'xtypeSectorCategoryContainerDataView',
                    store: projectsCategoriesDataStore
                });
            };

            if (!projectsCategoriesDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
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

    onCategoryNavItemTap: function(thisObj, index, target, record, event) {
        this.categorySlug = record.get('slug');
        window.location.hash = '#projects/' + record.get('slug');
    },

    navigationCategoryView: function(categorySlug) {
        this.log('Navigation: #projects/' + categorySlug);

        // Get tbe data bases
        var projectCategoriesDataStore = Ext.getStore('ProjectCategoryData');
        var ProjectDataStore = Ext.getStore('ProjectData');
        var imageDataStore = Ext.getStore('ImageData');
        var settingsDataStore = Ext.getStore('SettingsData');

        // Are the databases ready?
        if (
            projectCategoriesDataStore.isReady() &&
                ProjectDataStore.isReady() &&
                imageDataStore.isReady() &&
                settingsDataStore.isReady()
        ) {
            this.log('Data Stores are ready.');

            // store has data?
            if (!ProjectDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                ProjectDataStore.getOfflineData();
            }

            var afterDataLoad = function () {
                Ext.Viewport.setMasked(false);

                ProjectDataStore.verifySqlData('conireland', 'Projects', 'slug');

                // Load the main view
                this.getMainView().push({
                    xtype:'xtypeProjectListContainerDataView',
                    store: ProjectDataStore.queryByCategories(this.categorySlug)
                });
            };

            if (!ProjectDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
                else var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);

            delayedAfterDataLoad();

        } else {
            var dbRetry = function () {
                this.log('Testing databases again');
                this.navigationCategoryView();
            };
            var delayedDbRetry = Ext.Function.createDelayed(dbRetry, 500, this);

            delayedDbRetry();

            this.log('Databases are not ready.');
        }
    },

    onProjectNavItemTap: function(thisObj, index, target, record, event) {
        window.location.hash = '#projects/' + this.categorySlug + '/' + record.get('slug');
    },

    navigationProjectsView: function(categorySlug, projectSlug) {
        this.log('Navigation: #projects/' + categorySlug + '/' + projectSlug);

        // Get tbe data bases
        var projectDataStore = Ext.getStore('ProjectData');
        var imageDataStore = Ext.getStore('ImageData');
        var settingsDataStore = Ext.getStore('SettingsData');

        // Are the databases ready?
        if (
            projectDataStore.isReady() &&
                imageDataStore.isReady() &&
                settingsDataStore.isReady()
        ) {
            this.log('Data Stores are ready.');

            // store has data?
            if (!projectDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                projectDataStore.getOfflineData();

            }

            var afterDataLoad = function () {
                Ext.Viewport.remove(this.projectContainerView, true);

                Ext.Viewport.setMasked(false);

                // Load the main view
                this.projectContainerView = Ext.create('app.view.projects.ProjectContainerView', {
                    record: projectDataStore.findRecord('slug', projectSlug)
                });

                Ext.Viewport.add([this.projectContainerView]);

                Ext.Viewport.animateActiveItem(this.projectContainerView, { type: 'slide', direction: 'left' });
            };

            if (!projectDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
            else var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);

            delayedAfterDataLoad();

        } else {
            var dbRetry = function () {
                this.log('Testing databases again');
                this.navigationProjectsView();
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