Ext.define('app.view.info.InfoPageDetailContainerCarouselContainerCarouselView', {
    extend: 'Ext.Carousel',

    xtype: 'xtypeInfoPageDetailContainerCarouselContainerCarouselView',

    config: {
        fullscreen: false
    },

    initialize: function() {
        console.log('app.view.info.InfoPageDetailContainerCarouselContainerCarouselView');

        // get the image data form the json  encoded string
        var jsonImagesString = this.getRecord().get('Image');
        var imagesArray = Ext.JSON.decode(jsonImagesString);

        var imageDataStore = Ext.getStore('ImageData');

        Ext.Array.each(imagesArray, function(item) {
            this.add({
                xtype: 'img',
                src: imageDataStore.getImage(item.ImageId)
                //src: item.Image
            })
        }, this);

        this.callParent(arguments);
    },

    onDragStart: function(e) {
        e.stopPropagation();

        this.callParent(arguments);
    },

    onDrag: function(e) {
        e.stopPropagation();

        this.callParent(arguments);
    },

    onDragEnd: function(e) {
        e.stopPropagation();

        this.callParent(arguments);
    }

});