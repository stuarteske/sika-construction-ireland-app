Ext.define('app.view.info.InfoPageDetailContainerPanelView', {
        extend: "Ext.Panel",
        xtype: "xtypeInfoPageDetailContainerPanelView",

        config: {
            width: '50%',
            margin: '5px 5px 5px 5px',
            baseCls: 'project-panel',
            scrollable: true,
            fullscreen: false,
            tpl: new Ext.XTemplate(
                '<div class="pDetailsTitle">{Title}</div>',
                '<div class="text">{copy}</div>'
            )
        }
    }
);