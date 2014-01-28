Ext.define('app.view.info.InfoPageDetailContainerView', {
    extend: 'Ext.Container',

    xtype: 'xtypeInfoPageDetailContainerView',

    requires: [
        'Ext.Img',
        'Ext.MessageBox',
        'app.view.info.InfoPageDetailContainerPanelView',
        'app.view.info.InfoPageDetailContainerCarouselContainerView',
        'app.view.info.InfoPageDetailContainerBackContainerView'
    ],

    config: {
        layout: 'hbox',
        baseCls: 'project-view',
        fullscreen: true,
        listeners: {
            initialize: function(comp , eOpts){
                comp.element.on(
                    'swipe',
                    function(event, node, options, eOpts) {
                        switch (event.direction) {
                            case 'right':
                                this.fireEvent('swipeRight', this);
                                break;
                            case 'left':
                                this.fireEvent('swipeLeft', this);
                                break;
                            default:
                                break;
                        }
                    },
                    comp
                );
            }
        }
    },

    initialize: function() {
        //console.log('app.view.info.InfoPageDetailContainerView');

        this.setItems([
            {
                xtype: 'xtypeInfoPageDetailContainerBackContainerView',
                flex: 1
            },
            {
                xtype: 'xtypeInfoPageDetailContainerPanelView',
                flex: 3,
                record: this.getRecord()
            },
            {
                xtype: 'xtypeInfoPageDetailContainerCarouselContainerView',
                baseCls: 'project-carousel-panel',
                flex: 3,
                record: this.getRecord()
            }
        ]);

        this.callParent(arguments);
    }
});