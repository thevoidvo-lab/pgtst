(function (module, metro, common, plugin, ui, storage) {
    "use strict";

    const { FormDivider, FormInput, FormRow } = ui.Forms;
    const React = common.React;
    const ReactNative = common.ReactNative;

    function SettingsPage() {
        React.useEffect(() => {
            common.useProxy(storage);
        }, []);

        return React.createElement(ReactNative.ScrollView, { style: { padding: 15 } },
            React.createElement(FormRow, { label: "Target User ID" }),
            React.createElement(FormInput, {
                placeholder: "Enter Target User ID",
                value: storage.targetUserId || "",
                onChange: function (e) { return storage.targetUserId = e; }
            }),
            React.createElement(FormDivider, null),
            
            React.createElement(FormRow, { label: "Fake Display Name" }),
            React.createElement(FormInput, {
                placeholder: "Enter Fake Name",
                value: storage.fakeName || "",
                onChange: function (e) { return storage.fakeName = e; }
            }),
            React.createElement(FormDivider, null),

            React.createElement(FormRow, { label: "Fake Avatar URL" }),
            React.createElement(FormInput, {
                placeholder: "Enter Image URL",
                value: storage.fakeAvatar || "",
                onChange: function (e) { return storage.fakeAvatar = e; }
            }),
            React.createElement(FormDivider, null),

            React.createElement(FormRow, { label: "Fake Bio" }),
            React.createElement(FormInput, {
                placeholder: "Enter Fake Bio",
                value: storage.fakeBio || "",
                onChange: function (e) { return storage.fakeBio = e; }
            }),
            React.createElement(FormDivider, null),

            React.createElement(FormRow, { label: "Fake Banner URL" }),
            React.createElement(FormInput, {
                placeholder: "Enter Banner URL",
                value: storage.fakeBanner || "",
                onChange: function (e) { return storage.fakeBanner = e; }
            })
        );
    }

    let unpatches = [];

    function onLoad() {
        const UserStore = metro.findByStoreName("UserStore");
        const UserProfileStore = metro.findByStoreName("UserProfileStore");
        const AvatarModule = metro.findByProps("getUserAvatarURL");
        const BannerModule = metro.findByProps("getUserBannerURL");

        if (UserStore && UserStore.getUser) {
            const originalGetUser = UserStore.getUser;
            UserStore.getUser = function (id) {
                const user = originalGetUser.apply(this, arguments);
                if (user && storage.targetUserId && user.id === storage.targetUserId) {
                    const clone = Object.create(user);
                    if (storage.fakeName) {
                        clone.globalName = storage.fakeName;
                        clone.username = storage.fakeName.replace(/\s/g, '_');
                    }
                    return clone;
                }
                return user;
            };
            unpatches.push(() => { UserStore.getUser = originalGetUser; });
        }

        if (UserProfileStore && UserProfileStore.getUserProfile) {
            const originalGetProfile = UserProfileStore.getUserProfile;
            UserProfileStore.getUserProfile = function (id) {
                const profile = originalGetProfile.apply(this, arguments);
                if (profile && storage.targetUserId && id === storage.targetUserId) {
                    const clone = Object.create(profile);
                    if (storage.fakeBio) clone.bio = storage.fakeBio;
                    if (storage.fakeBanner) {
                        clone.banner = "SPOOFED_BANNER_MARKER"; 
                        clone.premiumType = 2; 
                    }
                    return clone;
                }
                return profile;
            };
            unpatches.push(() => { UserProfileStore.getUserProfile = originalGetProfile; });
        }

        if (AvatarModule && AvatarModule.getUserAvatarURL) {
            const originalGetAvatar = AvatarModule.getUserAvatarURL;
            AvatarModule.getUserAvatarURL = function (user, ...args) {
                if (user && storage.targetUserId && user.id === storage.targetUserId && storage.fakeAvatar) {
                    return storage.fakeAvatar;
                }
                return originalGetAvatar.apply(this, [user, ...args]);
            };
            unpatches.push(() => { AvatarModule.getUserAvatarURL = originalGetAvatar; });
        }

        if (BannerModule && BannerModule.getUserBannerURL) {
            const originalGetBanner = BannerModule.getUserBannerURL;
            BannerModule.getUserBannerURL = function (user, ...args) {
                if (user && storage.targetUserId && user.id === storage.targetUserId && storage.fakeBanner) {
                    return storage.fakeBanner;
                }
                return originalGetBanner.apply(this, [user, ...args]);
            };
            unpatches.push(() => { BannerModule.getUserBannerURL = originalGetBanner; });
        }

        console.log("[DvvXI] Global Spoof Profile loaded!");
    }

    function onUnload() {
        unpatches.forEach(fn => fn());
        unpatches = [];
        console.log("[DvvXI] Global Spoof Profile unloaded.");
    }

    module.onLoad = onLoad;
    module.onUnload = onUnload;
    module.settings = SettingsPage;

})({}, vendetta.metro, vendetta.metro.common, vendetta.plugin, vendetta.ui, vendetta.storage);

