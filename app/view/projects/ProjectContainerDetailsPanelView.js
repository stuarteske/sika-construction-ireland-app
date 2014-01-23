Ext.define('app.view.projects.ProjectContainerDetailsPanelView', {
        extend: "Ext.Panel",
        xtype: "xtypeProjectContainerDetailsPanelView",

        config: {
            width: '50%',
            margin: '5px 5px 5px 5px',
            baseCls: 'project-panel',
            scrollable: true,
            fullscreen: false,
            tpl: new Ext.XTemplate(
                '<div class="pDetailsTitle">{Title}</div>',
                '<div class="text"><label>Architect/Engineer</label>{Architect}</div>',
                '<div class="text"><label>Contractor</label>{Contractor}</div>',
                '<div class="text"><label>System</label>{system}</div><br />',
                '<div class="text">{Copy}</div>'
            )
        }
    }
);