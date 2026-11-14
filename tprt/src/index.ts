import { registerCommand } from "@vendetta/commands";
import { findByProps } from "@vendetta/metro";

export default {
    onLoad() {
        console.log("[TEST-TS] Plugin loaded with ES6 import!");
        
        try {
            if (typeof registerCommand !== "function") {
                console.log("[TEST-TS] registerCommand is not a function!");
                return;
            }

            registerCommand({
                name: "testcmdts",
                description: "Test command from ES6 import",
                displayName: "Test Cmd TS",
                displayDescription: "Test command from ES6 import",
                options: [],
                applicationId: "-1",
                id: "testcmdts_123",
                inputType: 1,
                type: 1,
                execute: (args: any, ctx: any) => {
                    try {
                        const Messages = findByProps("sendMessage", "receiveMessage");
                        if (Messages && Messages.sendMessage) {
                            Messages.sendMessage(ctx.channel.id, { content: "Halo dari TypeScript Import!" });
                        } else {
                            console.log("[TEST-TS] Messages module not found.");
                        }
                    } catch (e: any) {
                        console.log("[TEST-TS] Send error: " + e.message);
                    }
                    return { content: "Command executed!" };
                }
            });
            console.log("[TEST-TS] Command 'testcmdts' registered!");
        } catch (e: any) {
            console.log("[TEST-TS] Error: " + e.message);
        }
    },
    onUnload() {
        console.log("[TEST-TS] Plugin unloaded");
    }
};
