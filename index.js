var unregisterCommand = null;

var plugin = {
    start() {
        const register = bunny?.api?.commands?.registerCommand;

        if (typeof register !== "function") {
            throw new Error("bunny.api.commands.registerCommand is unavailable");
        }

        unregisterCommand = register({
            name: "testcmd",
            description: "Test custom command - prompt lalu balikin teks",
            options: [],
            execute: async (args, ctx) => {
                return new Promise((resolve) => {
                    try {
                        const { prompt } = bunny.api?.ui?.dialogs || {};
                        if (typeof prompt === "function") {
                            prompt({
                                title: "Test Command",
                                description: "Masukin teks yang mau ditampilin di chat",
                                placeholder: "Tulis sesuatu...",
                                confirm: "Kirim",
                                onSubmit: (value) => {
                                    resolve({ content: "**[TestCmd]** " + value });
                                }
                            });
                            return;
                        }
                    } catch (err) {
                        console.error("[TestCmd] prompt failed:", err);
                    }

                    const value = window.prompt("Masukin teks:", "");
                    if (value !== null && value.trim() !== "") {
                        resolve({ content: "**[TestCmd]** " + value });
                    } else {
                        resolve({ content: "**[TestCmd]** (dibatalkan)" });
                    }
                });
            }
        });
    },

    stop() {
        if (typeof unregisterCommand === "function") {
            unregisterCommand();
            unregisterCommand = null;
        }
    }
};
