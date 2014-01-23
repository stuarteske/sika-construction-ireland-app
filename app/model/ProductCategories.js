Ext.define('app.model.ProductCategories', {
    extend: 'Ext.data.Model',
    requires: [],

    config: {
        fields: [
            'title',
            'slug',
            'imageData'
        ],
        proxy: {
            type: 'sql'
        }
    }
});