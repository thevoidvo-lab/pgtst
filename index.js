(function (module, metro) {
    "use strict";

    const { commands } = vendetta;
    const { findByProps } = metro;
    let targetId = null;
    let unpatches = [];

    function onLoad() {
        if (commands && commands.registerCommand) {
            const patchSetId = commands.registerCommand({
                name: "setid",
                description: "Spoof CustomProfile to target User ID",
                inputType: 1,
                type: 1,
                applicationId: "-1",
                options: [
                    {
                        type: 3,
                        required: true,
                        name: "id",
                        description: "Target User ID"
                    }
                ],
                execute: (args) => {
                    const idArg = args.find(a => a.name === "id");
                    if (idArg && idArg.value) {
                        targetId = idArg.value;
                        const Messages = findByProps("sendMessage", "receiveMessage");
                        if (Messages) {
                            Messages.sendMessage("currentChannel", {
                                content: `Target ID set to: ${targetId}. Open Custom Profile now!`,
                                _command_output: true
                            });
                        }
                    }
                }
            });
            if (typeof patchSetId === 'function') unpatches.push(patchSetId);
        }

        if (commands && commands.registerCommand) {
            const patchClearId = commands.registerCommand({
                name: "clearid",
                description: "Clear the spoofed User ID",
                inputType: 1,
                type: 1,
                applicationId: "-1",
                execute: () => {
                    targetId = null;
                    const Messages = findByProps("sendMessage", "receiveMessage");
                    if (Messages) {
                        Messages.sendMessage("currentChannel", {
                            content: `Target ID cleared. Back to your account.`,
                            _command_output: true
                        });
                    }
                }
            });
            if (typeof patchClearId === 'function') unpatches.push(patchClearId);
        }

        const CPStore = metro.findByProps("getProfileDataFor", "accountData", "saveAccount");
        if (CPStore && CPStore.myId) {
            const origMyId = CPStore.myId;
            CPStore.myId = function() {
                if (targetId) return targetId;
                return origMyId.apply(this, arguments);
            };
            unpatches.push(() => { CPStore.myId = origMyId; });
        }
    }

    function onUnload() {
        unpatches.forEach(fn => fn());
        unpatches = [];
    }

    module.onLoad = onLoad;
    module.onUnload = onUnload;
})({}, vendetta.metro);
