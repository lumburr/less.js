// TODO: Add tests for browser @plugin
// eslint-disable-next-line no-unused-vars
/* global window */

import AbstractPluginLoader from '../less/environment/abstract-plugin-loader.js';

/**
 * Browser Plugin Loader
 */
const PluginLoader = function(less) {
    this.less = less;
    // Should we shim this.require for browser? Probably not?
};

PluginLoader.prototype = Object.assign(new AbstractPluginLoader(), {
    loadPlugin(filename, basePath, context, environment, fileManager) {
        return new Promise((fulfill, reject) => {
            fileManager.loadFile(filename, basePath, context, environment)
                .then(fulfill).catch(reject);
        });
    }
});

export default PluginLoader;

