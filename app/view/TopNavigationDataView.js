Ext.define('app.view.TopNavigationDataView', {
    extend: 'Ext.dataview.DataView',

    xtype: 'xtypeTopNavigationDataView',

    config: {
        baseCls: 'categories-list',
        itemTpl: new Ext.XTemplate(
            '<div class="image" style="background-image:url({ThumbImageData})"></div>',
            '<div class="name">{[this.limitString(values.title)]}</div>',
            {
                limitString: function(targetString) {
                    var outputString = '';

                    if (targetString.length > 20) {
                        outputString = targetString.substr(0, 20) + "&#46&#46&#46";
                    } else {
                        outputString = targetString;
                    }

                    return outputString;
                }
            }
        ),
        records: null
    }
});
