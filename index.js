(function (module, metro, common, plugin, ui, storage) {
    "use strict";

    function onLoad() {
        console.log("[DvvXI] Test Plugin loaded successfully!");
        
        try {
            if (ui && ui.showToast) {
                ui.showToast("DvvXI Test Plugin is active!");
            }
        } catch (e) {
            console.log("[DvvXI] Failed to show toast:", e);
        }
    }

    function onUnload() {
        console.log("[DvvXI] Test Plugin unloaded.");
    }

    module.onLoad = onLoad;
    module.onUnload = onUnload;
})({}, vendetta.metro, vendetta.metro.common, vendetta.plugin, vendetta.ui, vendetta.storage);

