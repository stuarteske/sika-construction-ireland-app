Ext.define('app.model.InfoPage', {
    extend: 'Ext.data.Model',
    requires: [],

    config: {
        fields: [
            'url',
            'ThumbImageData',
            'Image',
            'Title',
            'copy'
        ],
        proxy: {
            type: 'sql'
        }
    }
});