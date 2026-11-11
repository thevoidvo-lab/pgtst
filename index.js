(function (module, vendetta) {
    "use strict";

    module.default = {
        id: "dvvxi-spoofer",
        name: "DvvXI Spoofer",
        description: "Spoof CustomProfile ID",
        authors: [{ name: "DvvXI", id: "1248518999923228722" }],
        version: "1.0.0",

        onLoad() {
            const CPStore = vendetta.metro.findByProps("getProfileDataFor", "accountData", "saveAccount");
            let targetId = null;

            if (CPStore && CPStore.myId) {
                const origMyId = CPStore.myId;
                CPStore.myId = function () {
                    if (targetId) return targetId;
                    return origMyId.apply(this, arguments);
                };
            }

            this.unregisterCmd = vendetta.commands.registerCommand({
                name: "setid",
                displayName: "setid",
                description: "Set custom ID for profile",
                applicationId: "-1",
                inputType: 1,
                type: 1,
                execute: () => {
                    if (vendetta.ui && vendetta.ui.alerts && vendetta.ui.alerts.showInputAlert) {
                        vendetta.ui.alerts.showInputAlert({
                            title: "DvvXI Spoofer",
                            placeholder: "Enter Target User ID",
                            confirmText: "Save",
                            onConfirm: (value) => {
                                if (value && !isNaN(value)) {
                                    targetId = value;
                                    console.log("[DvvXI] Target set to: " + targetId);
                                }
                            }
                        });
                    } else {
                        console.log("[DvvXI] showInputAlert not found");
                    }
                    return null;
                }
            });
        },

        onUnload() {
            if (this.unregisterCmd) this.unregisterCmd();
            console.log("[DvvXI] Unloaded");
        }
    };
})({}, vendetta);
