define([
    'underscore'
], function(_) {
    "use strict";

    /**
     *
     * @param {string} templateData
     * @param {object} options
     * @class
     * @classdesc Render based on underscore method "template".
     * Features:
     *  1 caching of _.template calls
     *  2 template is split to named blocks by "<script <type> id=<name>> <template> </script>"
     *  3 template "inheritance" - on template may inherit blocks from parent template and override any of them
     */
    var Renderer = function(templateData, options) {
        options || (options = {});

        this.initialize(templateData, options);
    };

    _.extend(Renderer.prototype,
        /**
         * @lends Renderer.prototype
         */
        {
        /**
         * Cached _.template calls
         *
         * @type {Object.<string, Function>}
         */
        cache: null,

        /**
         * Sub templates store as named blocks
         *
         * @type {Object.<string, string>}
          */
        templateBlocks: null,

        /**
         * Pattern to split template by blocks
         *
         * @type {RegExp}
         */
        templateBlockPattern: new RegExp('<script type="[^"]+" id="([^"]+)">([\\w\\W]*?)<\/script>', 'gm'),

        /**
         * @param {string} templateData
         * @param {object} [options]
         * @constructs
         */
        initialize: function(templateData, options) {
            this.dropCache();

            this.templateBlocks = this._extractBlocks(templateData);
        },

        dropCache: function() {
            this.cache = {};
        },

        /**
         * Updates currently stored blocks with new templates. New ones may totally replace existing blocks or
         * just override blocks with the same id
         *
         * @param {string} templateData
         * @param {bool} [reset]
         */
        updateTemplate: function(templateData, reset) {
            this.dropCache();

            if(reset) {
                this.templateBlocks = this._extractBlocks(templateData);

                return;
            }

            this.templateBlocks = this._extractBlocks(templateData, this.templateBlocks);
        },

        /**
         * Renders string template using data from arguments
         *
         * @param {string} templateId
         * @param {object} [data]
         * @returns {string}
         */
        render: function(templateId, data) {
            if(this.cache[templateId]) {
                return this.cache[templateId](data);
            }

            var template = this._getSubTemplateById(templateId);
            if(!template) {
                return '#error:' + templateId;
            }

            template = _.template(template);
            this.cache[templateId] = template;

            return template(data);
        },

        /**
         * Splits new template to named blocks
         *
         * @param {string} templateData
         * @param {Object.<string, string>} [blocks]
         * @returns {Object.<string, string>}
         * @private
         */
        _extractBlocks: function(templateData, blocks) {
            blocks || (blocks = {});

            var match;
            while (match = this.templateBlockPattern.exec(templateData)) {
                blocks[match[1]] = match[2];
            }

            return blocks;
        },

        /**
         * @param {string} templateId
         * @returns {string}
         * @private
         */
        _getSubTemplateById: function(templateId) {
            var template = this.templateBlocks[templateId];

            return template
                ? template
                : '';
        }
    });

    return Renderer;
});
