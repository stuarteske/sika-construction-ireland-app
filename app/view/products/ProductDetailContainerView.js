Ext.define('app.view.products.ProductDetailContainerView', {
    extend: 'Ext.Container',

    xtype: 'xtypeProductDetailContainerView',

    requires: [
        'Ext.Img',
        'Ext.MessageBox',
        'app.view.products.ProductDetailContainerPanelView',
        'app.view.products.ProductDetailContainerCarouselContainerView',
        'app.view.products.ProductDetailContainerBackContainerView'
    ],

    config: {
        layout: 'hbox',
        baseCls: 'project-view',
        fullscreen: true
    },

    initialize: function() {
        console.log('app.view.products.ProductDetailContainerView');

        this.setItems([
            {
                xtype: 'xtypeProductDetailContainerBackContainerView',
                flex: 1
            },
            {
                xtype: 'xtypeProductDetailContainerPanelView',
                flex: 3,
                record: this.getRecord()
            },
            {
                xtype: 'xtypeProductDetailContainerCarouselContainerView',
                baseCls: 'project-carousel-panel',
                flex: 3,
                record: this.getRecord()
            }
        ]);

        this.callParent(arguments);
    }
});