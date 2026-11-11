var unregister = null;
var unpatch = null;

var plugin = {
    start() {
        if (unregister) try { unregister(); } catch(e) {}
        if (unpatch) try { unpatch(); } catch(e) {}
        unregister = null;
        unpatch = null;

        var registered = false;

        try {
            if (typeof bunny !== "undefined" && bunny.api && bunny.api.commands && typeof bunny.api.commands.registerCommand === "function") {
                unregister = bunny.api.commands.registerCommand({
                    name: "testcmd",
                    description: "Run the test command",
                    options: [],
                    execute: function() {
                        return { content: "SUCCESS: bunny command works!" };
                    }
                });
                registered = true;
            }
        } catch (e) {}

        try {
            if (typeof vendetta !== "undefined" && vendetta.metro && vendetta.patcher) {
                var messageUtil = vendetta.metro.findByProps("sendMessage");
                if (messageUtil && typeof messageUtil.sendMessage === "function") {
                    unpatch = vendetta.patcher.instead(
                        "sendMessage",
                        messageUtil,
                        function(args, original) {
                            var content = args[1] && typeof args[1].content === "string"
                                ? args[1].content.trim()
                                : "";

                            if (content === "/testcmd" || content === ".testcmd") {
                                return original.apply(this, [
                                    args[0],
                                    { content: "SUCCESS: vendetta fallback works!" }
                                ]);
                            }

                            return original.apply(this, args);
                        }
                    );
                }
            }
        } catch (e) {}
    },

    stop() {
        if (unregister) try { unregister(); } catch(e) {}
        if (unpatch) try { unpatch(); } catch(e) {}
        unregister = null;
        unpatch = null;
    }
};
