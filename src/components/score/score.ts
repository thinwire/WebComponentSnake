/**
 * Score counter webcomponent
 */

/// <reference path="../lib/polymer.d.ts" />

(function() {

    Polymer({
        is: 'x-score',

        properties: {
            value: {
                type: Number,
                readOnly: false,
                value: 0,
                reflectToAttribute: true,
                observer: '_updatescore'
            }
        },
        
        _updatescore: function(newValue: number) {
            this.$.content.innerText = "Score: " + newValue;
        }

    });

})();
