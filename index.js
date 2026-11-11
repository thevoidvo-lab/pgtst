var plugin = {
    start() {
        try {
            var metro = vendetta.metro;
            var SelectedChannelStore = metro.findByStoreName("SelectedChannelStore");
            var Messages = metro.findByProps("sendMessage", "receiveMessage");

            var channelId = null;
            if (SelectedChannelStore && SelectedChannelStore.getChannelId) {
                channelId = SelectedChannelStore.getChannelId();
            }

            if (channelId && Messages && Messages.sendMessage) {
                Messages.sendMessage(channelId, {
                    content: "✅ [DVVXI] PLUGIN BERHASIL JALAN DI ENDCORD!"
                });
            }
        } catch (e) {}
    },
    stop() {}
};
