(function (module, metro) {
    "use strict";

    var pluginObj = {
        start: function () {
            try {
                if (typeof bunny !== "undefined" && bunny.plugin && bunny.plugin.logger) {
                    bunny.plugin.logger.info("BUNNY KEYS: " + Object.keys(bunny).join(", "));
                    if (bunny.api) {
                        bunny.plugin.logger.info("BUNNY.API KEYS: " + Object.keys(bunny.api).join(", "));
                        if (bunny.api.commands) {
                            bunny.plugin.logger.info("BUNNY.API.COMMANDS KEYS: " + Object.keys(bunny.api.commands).join(", "));
                        } else {
                            bunny.plugin.logger.info("BUNNY.API.COMMANDS IS UNDEFINED");
                        }
                    } else {
                        bunny.plugin.logger.info("BUNNY.API IS UNDEFINED");
                    }
                }
            } catch (e) {}
        },
        stop: function () {}
    };

    module.exports = pluginObj;
    module.default = pluginObj;

})({}, vendetta.metro);
