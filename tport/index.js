import { findByProps } from "@vendetta/metro";
import { patcher } from "@vendetta";

export default {
    onLoad() {
        console.log("[TEST] Import works! Metro available: " + !!findByProps);
    },
    onUnload() {}
}
