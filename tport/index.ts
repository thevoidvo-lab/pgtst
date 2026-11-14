import { findByProps } from "@vendetta/metro";

export default {
    onLoad() {
        console.log("[TEST] Halo dari TS!");
        const Store = findByProps("getGuild");
        console.log("[TEST] GuildStore: " + !!Store);
    },
    onUnload() {}
};
