(function (module, metro) {
    "use strict";

    module.default = {
        id: "dvvxi-spoofer",
        name: "DvvXI Spoofer",
        description: "Spoof CustomProfile ID",
        authors: [{ name: "DvvXI", id: "1248518999923228722" }],
        version: "1.0.0",

        onLoad() {
            const CPStore = metro.findByProps("getProfileDataFor", "accountData", "saveAccount");
            const Commands = metro.findByProps("registerCommand");
            const Dialogs = metro.findByProps("prompt", "choose", "showText");
            
            if (!CPStore || !CPStore.myId) return;

            const origMyId = CPStore.myId;
            let targetId = null;

            CPStore.myId = function () {
                if (targetId) return targetId;
                return origMyId.apply(this, arguments);
            };

            const registerCommand = Commands?.registerCommand || Commands?.default?.registerCommand;

            if (registerCommand) {
                registerCommand({
                    name: "setid",
                    description: "Set target ID for CustomProfile",
                    execute: () => {
                        if (Dialogs && Dialogs.prompt) {
                            Dialogs.prompt({
                                title: "DvvXI Spoofer",
                                description: "Enter Target User ID",
                                placeholder: "e.g. 758142443937333249",
                                confirm: "Save ID",
                                onSubmit: (value) => {
                                    if (value && !isNaN(value)) {
                                        targetId = value;
                                        console.log("[DvvXI] Target set to: " + targetId);
                                    }
                                }
                            });
                        } else {
                            console.log("[DvvXI] Dialogs module not found.");
                        }
                    }
                });
            }
        },

        onUnload() {
            console.log("[DvvXI] Unloaded");
        }
    };
})({}, vendetta.metro);
