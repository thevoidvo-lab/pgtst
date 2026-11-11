(function (module, metro) {
    "use strict";

    const React = metro.common.React;
    const ReactNative = metro.common.ReactNative;
    const { FormInput, FormRow, FormDivider } = metro.common.components || metro.findByProps("FormInput", "FormRow", "FormDivider");

    let targetId = null;
    let unpatches = [];

    function SettingsUI() {
        const [inputId, setInputId] = React.useState("");

        const applySpoof = () => {
            targetId = inputId;
            if (ReactNative.Alert) {
                ReactNative.Alert.alert("DvvXI", "Target set to: " + targetId + "\nNow open Custom Profile UI!");
            }
        };

        const clearSpoof = () => {
            targetId = null;
            if (ReactNative.Alert) {
                ReactNative.Alert.alert("DvvXI", "Spoof Cleared. You are back to your account.");
            }
        };

        if (!FormInput) return React.createElement(ReactNative.Text, { style: { color: "white", padding: 20 } }, "UI not found.");

        return React.createElement(ReactNative.ScrollView, { style: { padding: 15, backgroundColor: "#1e1e1e" } },
            React.createElement(FormRow, { label: "Target User ID to Edit" }),
            React.createElement(FormInput, {
                placeholder: "Enter Target ID",
                value: inputId,
                onChange: setInputId,
                keyboardType: "numeric"
            }),
            React.createElement(FormDivider, null),
            React.createElement(ReactNative.Button, {
                title: "1. Apply Spoof (To Edit)",
                color: "#4CAF50",
                onPress: applySpoof
            }),
            React.createElement(ReactNative.View, { style: { marginTop: 10 } }),
            React.createElement(ReactNative.Button, {
                title: "2. Clear Spoof (Back to Normal)",
                color: "#f44336",
                onPress: clearSpoof
            })
        );
    }

    function onLoad() {
        const CPStore = metro.findByProps("getProfileDataFor", "accountData", "saveAccount");
        
        if (CPStore) {
            const origMyId = CPStore.myId;
            if (origMyId) {
                CPStore.myId = function() {
                    if (targetId) return targetId;
                    return origMyId.apply(this, arguments);
                };
                unpatches.push(() => { CPStore.myId = origMyId; });
            }
        }

        const UserStore = metro.findByStoreName("UserStore");
        if (UserStore && UserStore.getUser) {
            const origGetUser = UserStore.getUser;
            UserStore.getUser = function(id) {
                const user = origGetUser.apply(this, arguments);
                if (user && CPStore && CPStore.getProfileDataFor) {
                    const pd = CPStore.getProfileDataFor(user.id);
                    if (pd) {
                        const clone = Object.create(Object.getPrototypeOf(user));
                        for (const k in user) clone[k] = user[k];
                        if (pd.globalName) {
                            Object.defineProperty(clone, 'globalName', { value: pd.globalName, enumerable: true });
                            Object.defineProperty(clone, 'displayName', { value: pd.globalName, enumerable: true });
                        }
                        if (pd.username) {
                            Object.defineProperty(clone, 'username', { value: pd.username, enumerable: true });
                        }
                        return clone;
                    }
                }
                return user;
            };
            unpatches.push(() => { UserStore.getUser = origGetUser; });
        }

        const AvatarModule = metro.findByProps("getUserAvatarURL");
        if (AvatarModule && AvatarModule.getUserAvatarURL) {
            const origAvatar = AvatarModule.getUserAvatarURL;
            AvatarModule.getUserAvatarURL = function(user, ...args) {
                if (user && CPStore && CPStore.getProfileDataFor) {
                    const pd = CPStore.getProfileDataFor(user.id);
                    if (pd && pd.avatar) return pd.avatar;
                }
                return origAvatar.apply(this, [user, ...args]);
            };
            unpatches.push(() => { AvatarModule.getUserAvatarURL = origAvatar; });
        }

        console.log("[DvvXI] Final Inception Spoofer Loaded!");
    }

    function onUnload() {
        unpatches.forEach(fn => fn());
        unpatches = [];
        console.log("[DvvXI] Unloaded.");
    }

    module.onLoad = onLoad;
    module.onUnload = onUnload;
    module.settings = SettingsUI;

})({}, vendetta.metro);

