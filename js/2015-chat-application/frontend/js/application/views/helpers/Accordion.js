define([
    'underscore'
], function(_) {
    "use strict";

    /**
     * @typedef AccordionOptions
     * @type {object}
     * @property {string} headerClass
     * @property {string} headerActiveClass
     * @property {string} contentClass
     * @property {string} contentHiddenClass
     */
    var AccordionOptions;

    /**
     *
     * @param {jQuery} $itemList
     * @param {AccordionOptions} [options]
     * @class
     * @classdesc Accordion UI helper
     *
     * @throws {Error}
     */
    var Accordion = function($itemList, options) {
        options || (options = {});

        if(!$itemList || !$itemList.length) {
            throw new Error('$itemList should be defined');
        }

        this.$itemList = $itemList;

        options.headerClass && (this.headerClass = options.headerClass);
        options.headerActiveClass && (this.headerActiveClass = options.headerActiveClass);

        options.contentClass && (this.contentClass = options.contentClass);
        options.contentHiddenClass && (this.contentHiddenClass = options.contentHiddenClass);

        //ToDo: move out to function
        this.headerActiveClass.indexOf('.') === 0 && (this.headerActiveClass = this.headerActiveClass.replace(/^\./, ''));
        this.contentHiddenClass.indexOf('.') === 0 && (this.contentHiddenClass = this.contentHiddenClass.replace(/^\./, ''));

        //ToDo: move out to function
        this.headerClass.indexOf('.') !== 0 && (this.headerClass = '.' + this.headerClass);
        this.contentClass.indexOf('.') !== 0 && (this.contentClass =  '.' +  this.contentClass);
    };

    _.extend(Accordion.prototype,
        /** @lends Accordion.prototype */
        {
        /**
         * @type {?jQuery}
         */
        $itemList: null,

        /**
         * @type {string}
         */
        headerClass: 'header',
        /**
         * @type {string}
         */
        headerActiveClass: 'header-active',

        /**
         * @type {string}
         */
        contentClass: 'content',
        /**
         * @type {string}
         */
        contentHiddenClass: 'content-hidden',

        /**
         * Hides all content rows
         */
        initialize: function() {
            this.$itemList.find(this.contentClass).addClass(this.contentHiddenClass);
        },

        /**
         * Toggles row header UI and content visibility
         *
         * @param {jQuery} $row
         */
        toggleRow: function($row) {
            $row.find(this.headerClass).toggleClass(this.headerActiveClass);
            $row.find(this.contentClass).toggleClass(this.contentHiddenClass);
        }
    });

    return Accordion;
});
