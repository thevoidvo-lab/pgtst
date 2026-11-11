(function (module, metro) {
    "use strict";

    const React = metro.common.React;
    const ReactNative = metro.common.ReactNative;

    let targetId = null;
    let unpatches = [];

    function SettingsUI() {
        const [inputId, setInputId] = React.useState("");

        const applySpoof = () => {
            targetId = inputId;
            if (ReactNative.Alert) {
                ReactNative.Alert.alert("DvvXI", "Target set to: " + targetId);
            }
        };

        const clearSpoof = () => {
            targetId = null;
            if (ReactNative.Alert) {
                ReactNative.Alert.alert("DvvXI", "Spoof Cleared.");
            }
        };

        return React.createElement(ReactNative.View, { style: { padding: 20, backgroundColor: "#1e1e1e", flex: 1 } },
            React.createElement(ReactNative.Text, { style: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 15 } }, "DvvXI Spoofer"),
            
            React.createElement(ReactNative.Text, { style: { color: "#ccc", marginBottom: 5 } }, "Target User ID:"),
            React.createElement(ReactNative.TextInput, {
                style: { backgroundColor: "#333", color: "white", padding: 10, borderRadius: 5, marginBottom: 20 },
                placeholder: "Enter ID here...",
                placeholderTextColor: "#888",
                value: inputId,
                onChangeText: setInputId,
                keyboardType: "numeric"
            }),
            
            React.createElement(ReactNative.Button, {
                title: "1. Apply Spoof",
                color: "#4CAF50",
                onPress: applySpoof
            }),
            React.createElement(ReactNative.View, { style: { marginTop: 15 } }),
            React.createElement(ReactNative.Button, {
                title: "2. Clear Spoof",
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
    }

    function onUnload() {
        unpatches.forEach(fn => fn());
        unpatches = [];
    }

    module.onLoad = onLoad;
    module.onUnload = onUnload;
    module.settings = SettingsUI;

})({}, vendetta.metro);
