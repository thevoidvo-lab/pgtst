(function (module, metro, common, plugin, ui, storage) {
    "use strict";

    function onLoad() {
        console.log("=== DVVXI PLUGIN LOADED ===");
        
        try {
            const { Alert } = metro.common.ReactNative;
            if (Alert) {
                Alert.alert("DvvXI Plugin", "Plugin is working!");
            } else {
                console.log("Alert module not found.");
            }
        } catch (e) {
            console.log("Failed to show alert:", e);
        }
    }

    function onUnload() {
        console.log("=== DVVXI PLUGIN UNLOADED ===");
    }

    module.onLoad = onLoad;
    module.onUnload = onUnload;
})({}, vendetta.metro, vendetta.metro.common, vendetta.plugin, vendetta.ui, vendetta.storage);
