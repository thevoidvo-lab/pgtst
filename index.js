(function (module, vendetta) {
    "use strict";

    module.default = {
        id: "dvvxi-debug",
        name: "DvvXI Debug",
        description: "Check API availability",
        authors: [{ name: "DvvXI", id: "1248518999923228722" }],
        version: "1.0.0",

        onLoad() {
            console.log("[DvvXI] --- DEBUG START ---");
            console.log("[DvvXI] typeof vendetta:", typeof vendetta);
            console.log("[DvvXI] typeof vendetta.commands:", typeof vendetta?.commands);
            console.log("[DvvXI] typeof registerCommand:", typeof vendetta?.commands?.registerCommand);
            console.log("[DvvXI] typeof vendetta.metro:", typeof vendetta?.metro);
            console.log("[DvvXI] typeof vendetta.ui:", typeof vendetta?.ui);
            console.log("[DvvXI] --- DEBUG END ---");
        },

        onUnload() {
            console.log("[DvvXI] Unloaded");
        }
    };
})({}, vendetta);
