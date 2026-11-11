(function (module, vendetta) {
    "use strict";

    const { metro } = vendetta;
    const CommandAPI = metro.findByProps("registerCommand", "registeredCommandCount");

    module.default = {
        id: "dvvxi-spoofer",
        name: "DvvXI Spoofer",
        description: "Spoof CustomProfile ID",
        authors: [{ name: "DvvXI", id: "1248518999923228722" }],
        version: "1.0.0",

        onLoad() {
            const CPStore = metro.findByProps("getProfileDataFor", "accountData", "saveAccount");
            let targetId = null;

            if (CPStore && CPStore.myId) {
                const origMyId = CPStore.myId;
                CPStore.myId = function () {
                    if (targetId) return targetId;
                    return origMyId.apply(this, arguments);
                };
            }

            if (CommandAPI && CommandAPI.registerCommand) {
                this.unregisterCmd = CommandAPI.registerCommand({
                    name: "setid",
                    description: "Set custom ID for profile",
                    options: [],
                    type: 1,
                    inputType: 0,
                    execute: (args, ctx) => {
                        const Dialogs = metro.findByProps("prompt", "choose", "showText");
                        if (Dialogs && Dialogs.prompt) {
                            Dialogs.prompt({
                                title: "DvvXI Spoofer",
                                description: "Enter Target User ID",
                                placeholder: "e.g. 758142443937333249",
                                confirm: "Save",
                                onSubmit: (value) => {
                                    if (value && !isNaN(value)) {
                                        targetId = value;
                                    }
                                }
                            });
                        }
                        return { content: "" };
                    }
                });
            }
        },

        onUnload() {
            if (this.unregisterCmd) this.unregisterCmd();
        }
    };
})({}, vendetta);
