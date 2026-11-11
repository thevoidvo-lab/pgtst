module.exports = {
    id: "test-plugin-dvv",
    name: "Test Plugin Dvv",
    description: "Plugin for testihg.",
    author: "DvvXI",
    version: "1.0.0",
    start() {
        // hi
        if (window.Vencord && window.Vencord.UI && window.Vencord.UI.showToast) {
            window.Vencord.UI.showToast("Plugin Dvv Run");
        } else {
            console.log("[DvvXI] Plugin Runn (But Toast Not Supported)");
        }
    },
    stop() {
        console.log("[DvvXI] Plugin died");
    }
};
