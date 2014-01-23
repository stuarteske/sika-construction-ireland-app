Ext.define('app.model.Products', {
    extend: 'Ext.data.Model',

    requires: ['Ext.data.proxy.Sql'],

    config: {
        fields: [
            'slug',
            'Title',
            'Intro',
            'Copy',
            'ThumbImageData',
            'Image',
            'Download',
            'project_title',
            "Architect",
            "Contractor",
            'categories'
        ],
        proxy: {
            type: 'sql'
        }
    }
});