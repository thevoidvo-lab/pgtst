const plugin = {
    start() {
        const register = bunny?.api?.commands?.registerCommand;

        if (typeof register !== "function") {
            throw new Error("[TestCmd] bunny.api.commands.registerCommand tidak ditemukan");
        }

        this._unregister = register({
            name: "testcmd",
            description: "Test command - harusnya muncul di autocomplete",
            options: [],
            execute: async () => {
                return {
                    content: "SUCCESS: External command is working!"
                };
            }
        });
    },

    stop() {
        if (typeof this._unregister === "function") {
            this._unregister();
            this._unregister = null;
        }
    }
};

plugin;
