Ext.define('app.model.Projects', {
    extend: 'Ext.data.Model',

    requires: ['Ext.data.proxy.Sql'],

    config: {
        fields: [
            'slug',
            'Title',
            'Copy',
            'ThumbImageData',
            'Image',
            "Architect",
            "Contractor",
            'categories',
            'solutions',
            'system'
        ],
        proxy: {
            type: 'sql'
        }
    }
});

//fields: [
//    'slug',
//    'Title',
//    'Intro', // r
//    'Copy',
//    'Image',
//    'Download', // r
//    'project_title', // r
//    "Architect",
//    "Contractor",
//    'Pin', // r
//    'categories', // r
//    'sector', // r
//    'region' // r
//],