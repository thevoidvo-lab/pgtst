var unregister = null;
var unpatch = null;

var plugin = {
    start() {
        if (unregister) unregister();
        if (unpatch) unpatch();
        unregister = null;
        unpatch = null;

        try {
            unregister = bunny.api.commands.registerCommand({
                name: "testcmd",
                description: "Run the test command",
                options: [],
                execute: function() {
                    return { content: "testcmd ran successfully!" };
                }
            });
        } catch (e) {
            console.error("Command registration failed; installing sendMessage fallback", e);

            var messageUtil = vendetta.metro.findByProps("sendMessage");
            if (!messageUtil || typeof messageUtil.sendMessage !== "function") {
                console.error("Could not find sendMessage for the testcmd fallback");
                return;
            }

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
                            { content: "Fallback: testcmd ran successfully!" }
                        ]);
                    }

                    return original.apply(this, args);
                }
            );
        }
    },

    stop() {
        if (unregister) unregister();
        if (unpatch) unpatch();
        unregister = null;
        unpatch = null;
    }
};
