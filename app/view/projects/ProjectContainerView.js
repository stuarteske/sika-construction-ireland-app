Ext.define('app.view.projects.ProjectContainerView', {
    extend: 'Ext.Container',

    xtype: 'xtypeProjectContainerView',

    requires: [
        'Ext.Img',
        'Ext.MessageBox',
        'app.view.projects.ProjectContainerDetailsPanelView',
        'app.view.projects.ProjectContainerCarouselContainerView',
        'app.view.projects.ProjectContainerBackContainerView'
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
                                console.log('Swipe right');
                                this.fireEvent('swipeRight', this);
                                break;
                            case 'left':
                                this.fireEvent('swipeLeft', this);
                                break;
                            default:
                                //console.log('Unknown Swipe');
                                break;
                        }
                    },
                    comp
                );
            }
        }
    },

    initialize: function() {
        console.log('app.view.projects.ProjectContainerView');

        this.setItems([
            {
                xtype: 'xtypeProjectContainerBackContainerView',
                flex: 1
            },
            {
                xtype: 'xtypeProjectContainerDetailsPanelView',
                flex: 3,
                record: this.getRecord()
            },
            {
                xtype: 'xtypeProjectContainerCarouselContainerView',
                baseCls: 'project-carousel-panel',
                flex: 3,
                record: this.getRecord()
            }
        ]);

        this.callParent(arguments);
    }
});