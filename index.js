(function (module, metro) {
    "use strict";

    let targetId = "1248518999923228722"; 
    let fakeName = "DvvXI Hacker";
    let fakeAvatar = "https://cdn.discordapp.com/embed/avatars/0.png";

    function onLoad() {
        const UserStore = metro.findByStoreName("UserStore");
        if (UserStore && UserStore.getUser) {
            const origGetUser = UserStore.getUser;
            UserStore.getUser = function (id) {
                const user = origGetUser.apply(this, arguments);
                if (user && user.id === targetId) {
                    const clone = Object.create(user);
                    clone.globalName = fakeName;
                    clone.username = fakeName.replace(/\s/g, '_');
                    return clone;
                }
                return user;
            };
        }

        const AvatarModule = metro.findByProps("getUserAvatarURL");
        if (AvatarModule && AvatarModule.getUserAvatarURL) {
            const origAvatar = AvatarModule.getUserAvatarURL;
            AvatarModule.getUserAvatarURL = function (user, ...args) {
                if (user && user.id === targetId) {
                    return fakeAvatar;
                }
                return origAvatar.apply(this, [user, ...args]);
            };
        }

        console.log("[DvvXI] Pure Spoof Loaded!");
    }

    function onUnload() {
        console.log("[DvvXI] Unloaded.");
    }

    module.onLoad = onLoad;
    module.onUnload = onUnload;
})({}, vendetta.metro);

