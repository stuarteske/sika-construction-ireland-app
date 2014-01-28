Ext.define('app.view.products.ProductDetailContainerCarouselContainerView', {
    extend: 'Ext.Container',

    xtype: 'xtypeProductDetailContainerCarouselContainerView',

    requires: [
        'Ext.Img',
        'Ext.MessageBox',
        'app.view.products.ProductDetailContainerCarouselContainerCarouselView'
    ],

    config: {
        layout: 'vbox',
        baseCls: 'project-carousel-panel'
    },

    initialize: function() {
        //console.log('app.view.products.ProjectDetailContainerCarouselContainerView');

        this.setItems([
            {
                xtype: 'xtypeProductDetailContainerCarouselContainerCarouselView',
                baseCls: 'project-carousel',
                flex: 2,
                record: this.getRecord()
            },
            {
                xtype: 'panel',
                layout: 'hbox',
                items: [],
                flex: 1
            },
            {
                xtype: 'img',
                src: 'resources/images/footer-title-panel.png',
                flex: 2
            }
        ]);

        this.callParent(arguments);
    }
});