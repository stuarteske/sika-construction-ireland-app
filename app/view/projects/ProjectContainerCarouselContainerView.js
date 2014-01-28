Ext.define('app.view.projects.ProjectContainerCarouselContainerView', {
    extend: 'Ext.Container',

    xtype: 'xtypeProjectContainerCarouselContainerView',

    requires: [
        'Ext.Img',
        'Ext.MessageBox',
        'app.view.projects.ProjectContainerCarouselContainerCarouselView'
    ],

    config: {
        layout: 'vbox',
        baseCls: 'project-carousel-panel'
    },

    initialize: function() {
        //console.log('app.view.projects.ProjectContainerCarouselContainerView');

        this.setItems([
            {
                xtype: 'xtypeProjectContainerCarouselContainerCarouselView',
                baseCls: 'project-carousel',
                flex: 1,
                record: this.getRecord()
            },
            {
                xtype: 'img',
                src: 'resources/images/footer-title-panel.png',
                flex: 1
            }
        ]);

        this.callParent(arguments);
    }
});