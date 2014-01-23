Ext.define('app.controller.Base', {
    extend: 'Ext.app.Controller',

    config: {
        debugMode: true
    },

    log: function(printObject) {
        if (app.app.debugMode && this.getDebugMode()) {
            console.log(printObject);
        }
    }
});