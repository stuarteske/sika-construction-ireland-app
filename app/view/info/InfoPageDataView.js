Ext.define('app.view.info.InfoPageDataView', {
    extend: 'Ext.dataview.DataView',

    xtype: 'xtypeInfoPageDataView',

    config: {
        baseCls: 'categories-list',
        itemTpl: [
            '<div class="image" style="background-image:url({ThumbImageData})"></div>',
            '<div class="name">{Title}</div>'
        ].join(''),
        records: null
    }
});
