import { registerCommand } from "@vendetta/commands";
import { findByProps } from "@vendetta/metro";

export default {
    onLoad() {
        console.log("[TEST] Plugin loaded with ES6 import!");
        
        try {
            if (typeof registerCommand !== "function") {
                console.log("[TEST] registerCommand is not a function!");
                return;
            }

            registerCommand({
                name: "testcmd",
                description: "Test command from ES6 import",
                displayName: "Test Command",
                displayDescription: "Test command from ES6 import",
                options: [],
                applicationId: "-1",
                id: "testcmd_123",
                inputType: 1,
                type: 1,
                execute: (args: any, ctx: any) => {
                    try {
                        const Messages = findByProps("sendMessage", "receiveMessage");
                        if (Messages && Messages.sendMessage) {
                            Messages.sendMessage(ctx.channel.id, { content: "Halo dari ES6 Import! Ini beneran jalan." });
                        } else {
                            console.log("[TEST] Messages module not found.");
                        }
                    } catch (e: any) {
                        console.log("[TEST] Send error: " + e.message);
                    }
                    return { content: "Command executed!" };
                }
            });
            console.log("[TEST] Command 'testcmd' registered!");
        } catch (e: any) {
            console.log("[TEST] Error: " + e.message);
        }
    },
    onUnload() {
        console.log("[TEST] Plugin unloaded");
    }
};
