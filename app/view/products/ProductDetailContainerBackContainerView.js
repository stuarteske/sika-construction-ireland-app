Ext.define('app.view.products.ProductDetailContainerBackContainerView', {
        extend: "Ext.Container",

        xtype: "xtypeProductDetailContainerBackContainerView",

        config: {
            baseCls: 'project-nav-panel',
            layout: 'vbox',
            items: [
                {
                    xtype: 'img',
                    src: 'resources/images/back-arrow.png',
                    flex: 1
                }
            ]
        },

        initialize: function () {
            this.element.on('tap', this.onTap, this);
        },

        onTap: function () {
            this.fireEvent("tap", this);
        }
    }
);