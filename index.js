var plugin = {
    start: function() {
        var logMsg = "DVVXI: ";

        try {
            if (typeof bunny !== "undefined") {
                logMsg += "bunny ada. ";
            } else {
                logMsg += "bunny gaib. ";
            }

            if (typeof bunny !== "undefined" && bunny.api) {
                logMsg += "api ada. ";
                
                if (bunny.api.commands) {
                    logMsg += "commands ada. ";
                } else {
                    logMsg += "commands gaib. ";
                }

                if (bunny.api.patcher) {
                    logMsg += "patcher ada. ";
                } else {
                    logMsg += "patcher gaib. ";
                }
            } else {
                logMsg += "api gaib. ";
            }

            if (typeof vendetta !== "undefined") {
                logMsg += "vendetta ada. ";
            } else {
                logMsg += "vendetta gaib. ";
            }

            if (typeof bunny !== "undefined" && bunny.plugin && bunny.plugin.logger) {
                bunny.plugin.logger.info(logMsg);
            } else {
                console.log(logMsg);
            }
        } catch (e) {
            if (typeof bunny !== "undefined" && bunny.plugin && bunny.plugin.logger) {
                bunny.plugin.logger.error("DVVXI Error: " + e.message);
            }
        }
    },
    stop: function() {}
};

return plugin;
