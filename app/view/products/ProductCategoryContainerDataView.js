Ext.define('app.view.products.ProductCategoryContainerDataView', {
    extend: 'Ext.dataview.DataView',

    xtype: 'xtypeProductCategoryContainerDataView',

    config: {
        baseCls: 'categories-list',

        itemTpl: [
            '<div class="image" style="background-image:url({imageData})"></div>',
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
        ],
        records: null
    }
});
