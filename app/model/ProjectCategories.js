Ext.define('app.model.ProjectCategories', {
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