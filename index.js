(function (module, vendetta) {
    "use strict";

    const { metro, patcher, ui } = vendetta;
    const Messages = metro.findByProps("sendMessage", "receiveMessage");
    
    module.default = {
        id: "dvvxi-spoofer",
        name: "DvvXI Spoofer",
        description: "Spoof CustomProfile ID via chat command",
        authors: [{ name: "DvvXI", id: "1248518999923228722" }],
        version: "1.0.0",

        onLoad() {
            const CPStore = metro.findByProps("getProfileDataFor", "accountData", "saveAccount");
            let targetId = null;

            if (CPStore && CPStore.myId) {
                const origMyId = CPStore.myId;
                CPStore.myId = function () {
                    if (targetId) return targetId;
                    return origMyId.apply(this, arguments);
                };
            }

            if (Messages && Messages.sendMessage && patcher) {
                this.unpatch = patcher.instead("sendMessage", Messages, (args, original) => {
                    const [channelId, message] = args;
                    
                    if (message && typeof message.content === "string") {
                        const content = message.content.trim();
                        
                        if (content.startsWith(".setid")) {
                            const id = content.split(" ")[1];
                            
                            if (id && !isNaN(id)) {
                                targetId = id;
                                Messages.sendBotMessage(channelId, `Target ID diubah ke: ${targetId}. Buka Custom Profile sekarang!`);
                            } else {
                                const Dialogs = metro.findByProps("prompt", "choose", "showText");
                                if (Dialogs && Dialogs.prompt) {
                                    Dialogs.prompt({
                                        title: "DvvXI Spoofer",
                                        description: "Enter Target User ID",
                                        placeholder: "e.g. 758142443937333249",
                                        confirm: "Save",
                                        onSubmit: (value) => {
                                            if (value && !isNaN(value)) {
                                                targetId = value;
                                                Messages.sendBotMessage(channelId, `Target ID diubah ke: ${targetId}`);
                                            }
                                        }
                                    });
                                }
                            }
                            return; 
                        }
                    }
                    
                    return original.apply(this, args);
                });
            }
        },

        onUnload() {
            if (this.unpatch) this.unpatch();
        }
    };
})({}, vendetta);
