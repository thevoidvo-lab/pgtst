(function (module, metro) {
    "use strict";

    let targetId = null;
    let unpatches = [];
    const { findByProps } = metro;

    function onLoad() {
        const Messages = findByProps("sendMessage", "receiveMessage");
        
        if (Messages && Messages.sendMessage) {
            const originalSend = Messages.sendMessage;
            
            Messages.sendMessage = function(channelId, message, ...args) {
                if (message && message.content) {
                    const content = message.content.trim();

                    if (content.startsWith("/setid ")) {
                        const id = content.split(" ")[1];
                        if (id && !isNaN(id)) {
                            targetId = id;
                            Messages.receiveMessage(channelId, {
                                id: String(Date.now()),
                                channel_id: channelId,
                                author: { id: "0", username: "DvvXI", avatar: null },
                                content: `Target ID set to: ${targetId}\nOpen Custom Profile now!`,
                                timestamp: new Date().toISOString(),
                                type: 0
                            });
                        }
                        return;
                    }

                    if (content === "/clearid") {
                        targetId = null;
                        Messages.receiveMessage(channelId, {
                            id: String(Date.now()),
                            channel_id: channelId,
                            author: { id: "0", username: "DvvXI", avatar: null },
                            content: `Target ID cleared. Back to normal.`,
                            timestamp: new Date().toISOString(),
                            type: 0
                        });
                        return;
                    }
                }
                return originalSend.apply(this, arguments);
            };
            unpatches.push(() => { Messages.sendMessage = originalSend; });
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
