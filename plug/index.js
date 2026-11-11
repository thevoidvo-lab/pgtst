module.exports = {
    onLoad() {
        console.log("[DvvXI] Test Plugin loaded successfully!");
        
        try {
            if (window.Vencord && window.Vencord.UI && window.Vencord.UI.showToast) {
                window.Vencord.UI.showToast("DvvXI Test Plugin is active!");
            }
        } catch (e) {
            console.log("[DvvXI] Failed to show toast:", e);
        }
    },
    
    onUnload() {
        console.log("[DvvXI] Test Plugin unloaded.");
    }
};
