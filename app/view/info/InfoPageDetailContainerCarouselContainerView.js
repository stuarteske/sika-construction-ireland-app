Ext.define('app.view.info.InfoPageDetailContainerCarouselContainerView', {
    extend: 'Ext.Container',

    xtype: 'xtypeInfoPageDetailContainerCarouselContainerView',

    requires: [
        'Ext.Img',
        'Ext.MessageBox',
        'app.view.info.InfoPageDetailContainerCarouselContainerCarouselView'
    ],

    config: {
        layout: 'vbox',
        baseCls: 'project-carousel-panel'
    },

    initialize: function() {
        console.log('app.view.info.InfoPageDetailContainerCarouselContainerView');

        this.setItems([
            {
                xtype: 'xtypeInfoPageDetailContainerCarouselContainerCarouselView',
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