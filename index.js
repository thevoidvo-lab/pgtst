var plugin = {
    start: function () {
        var self = this;

        try {
            var register = bunny && bunny.api && bunny.api.commands && bunny.api.commands.registerCommand;
            var logger = bunny && bunny.plugin && bunny.plugin.logger;

            if (typeof register === "function") {
                self._unreg = register({
                    name: "testcmd",
                    description: "Test command - munculin teks",
                    options: [],
                    execute: function (args, ctx) {
                        return {
                            content: "SUCCESS: External command is working!"
                        };
                    }
                });
                if (logger) logger.info("[TestCmd] Registered via bunny.api.commands.registerCommand");
            } else {
                if (logger) logger.warn("[TestCmd] bunny.api.commands.registerCommand tidak tersedia");
            }
        } catch (e) {
            if (bunny && bunny.plugin && bunny.plugin.logger) {
                bunny.plugin.logger.error("[TestCmd] Gagal register command: " + e.message);
            }
        }

        try {
            var messageUtil = bunny.metro.findByProps("sendMessage");
            if (messageUtil && bunny.api.patcher && bunny.api.patcher.instead) {
                self._unpatchSend = bunny.api.patcher.instead("sendMessage", messageUtil, function (args, orig) {
                    var content = args[1] && args[1].content && args[1].content.trim();

                    if (content === ".testcmd" || content === "/testcmd") {
                        messageUtil.sendMessage(args[0], {
                            content: "SUCCESS: Fallback .testcmd works!"
                        });
                        return Promise.resolve();
                    }

                    return orig.apply(this, args);
                });
                if (bunny.plugin && bunny.plugin.logger) {
                    bunny.plugin.logger.info("[TestCmd] Fallback .testcmd aktif");
                }
            }
        } catch (e) {
            if (bunny && bunny.plugin && bunny.plugin.logger) {
                bunny.plugin.logger.error("[TestCmd] Gagal pasang fallback: " + e.message);
            }
        }
    },

    stop: function () {
        if (typeof this._unreg === "function") {
            this._unreg();
            this._unreg = null;
        }
        if (typeof this._unpatchSend === "function") {
            this._unpatchSend();
            this._unpatchSend = null;
        }
    }
};

return plugin;
