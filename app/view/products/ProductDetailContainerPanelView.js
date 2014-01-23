Ext.define('app.view.products.ProductDetailContainerPanelView', {
        extend: "Ext.Panel",
        xtype: "xtypeProductDetailContainerPanelView",

        config: {
            width: '50%',
            margin: '5px 5px 5px 5px',
            baseCls: 'project-panel',
            scrollable: true,
            fullscreen: false,
            tpl: new Ext.XTemplate(
                '<div class="pDetailsTitle">{Title}</div>',
                '<div class="text" style="margin-bottom:10px;"><label>System</label>{Architect}</div>',
                '<div class="text">{Copy}</div>'
            )
        }
    }
);