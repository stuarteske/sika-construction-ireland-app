Ext.define('app.model.Navigation', {
    extend: 'Ext.data.Model',

    requires: ['Ext.data.proxy.Sql'],

    config: {
        fields: [
            'url',
            'ThumbImageData',
            'title'
        ]
    },
    proxy: {
        type: 'sql'
    }
});