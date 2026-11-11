(function (module, metro) {
    "use strict";

    module.default = {
        id: "dvvxi-spoofer",
        name: "DvvXI Spoofer",
        description: "Spoof CustomProfile ID",
        authors: [{ name: "DvvXI", id: "1248518999923228722" }],
        version: "1.0.0",
        
        settings: {
            targetId: {
                type: "string",
                label: "Target User ID",
                description: "Enter target ID here",
                default: ""
            }
        },

        onLoad() {
            const CPStore = metro.findByProps("getProfileDataFor", "accountData", "saveAccount");
            if (!CPStore || !CPStore.myId) return;

            const origMyId = CPStore.myId;
            
            CPStore.myId = function () {
                if (module.default.settings && module.default.settings.targetId) {
                    return module.default.settings.targetId;
                }
                return origMyId.apply(this, arguments);
            };
        },

        onUnload() {
            console.log("[DvvXI] Unloaded");
        }
    };
})({}, vendetta.metro);
