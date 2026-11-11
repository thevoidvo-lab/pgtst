(function (module, metro) {
    "use strict";

    function onLoad() {
        try {
            if (typeof bunny !== "undefined" && bunny.api && bunny.api.commands && bunny.api.commands.registerCommand) {
                bunny.api.commands.registerCommand({
                    name: "testcmd",
                    description: "Test command",
                    options: [],
                    execute: function() {
                        return { content: "SUCCESS: bunny command works!" };
                    }
                });
            }
        } catch (e) {}

        try {
            if (typeof vendetta !== "undefined" && vendetta.commands && vendetta.commands.registerCommand) {
                vendetta.commands.registerCommand({
                    name: "testcmd",
                    description: "Test command",
                    options: [],
                    execute: function() {
                        return { content: "SUCCESS: vendetta command works!" };
                    }
                });
            }
        } catch (e) {}
    }

    function onUnload() {
    }

    module.onLoad = onLoad;
    module.onUnload = onUnload;

})({}, vendetta.metro);
