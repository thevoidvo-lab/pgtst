(function (module, metro) {
    "use strict";

    let targetId = null;
    let unpatches = [];
    const { instead } = vendetta.patcher;
    const { findByProps } = metro;

    function onLoad() {
        const Messages = findByProps("sendMessage", "receiveMessage");

        if (Messages && Messages.sendMessage) {
            unpatches.push(
                instead("sendMessage", Messages, (args, original) => {
                    const [channelId, message] = args;
                    if (message && typeof message.content === "string") {
                        const content = message.content.trim();

                        if (content.startsWith("/setid ")) {
                            const id = content.split(" ")[1];
                            if (id && !isNaN(id)) {
                                targetId = id;
                                Messages.sendBotMessage(channelId, `Target ID Spoofed to: ${targetId}\nNow open Custom Profile!`);
                                return; 
                            }
                        }

                        if (content === "/clearid") {
                            targetId = null;
                            Messages.sendBotMessage(channelId, `Spoof cleared. Back to normal.`);
                            return;
                        }
                    }
                    return original.apply(this, args);
                })
            );
        }

        const CPStore = metro.findByProps("getProfileDataFor", "accountData", "saveAccount");
        if (CPStore && CPStore.myId) {
            const origMyId = CPStore.myId;
            CPStore.myId = function() {
                if (targetId) return targetId;
                return origMyId.apply(this, arguments);
            };
            unpatches.push(() => { CPStore.myId = origMyId; });
        }
    }

    function onUnload() {
        unpatches.forEach(fn => fn());
        unpatches = [];
    }

    module.onLoad = onLoad;
    module.onUnload = onUnload;
})({}, vendetta.metro);
