const readline = require("readline");
const { storePassword, retrievePassword, deletePassword, createUser, authUser } = require("./database");

// Setup readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let loggedInUser = null;

// Prompt user for input
const askQuestion = (question) => {
    return new Promise((resolve) => rl.question(question, resolve));
};

// User Login
async function login() {
    console.log("\n🔐 Welcome to Password Vault!");
    while (!loggedInUser) {
        const username = await askQuestion("👤 Enter username: ");
        const password = await askQuestion("🔑 Enter password: ");

        if (authUser(username, password)) {
            loggedInUser = username;
            console.log(`✅ Successfully logged in as ${username}`);
        } else {
            console.log("❌ Incorrect username or password. Try again.");
        }
    }
}

// Main Menu
async function mainMenu() {
    while (true) {
        console.log("\n📌 Menu:");
        console.log("1️⃣ Store a password");
        console.log("2️⃣ Retrieve a password");
        console.log("3️⃣ Delete a password");
        console.log("4️⃣ Logout & Exit");

        const choice = await askQuestion("👉 Choose an option: ");

        switch (choice) {
            case "1":
                const service = await askQuestion("🔹 Enter service name: ");
                const username = await askQuestion("🔹 Enter username: ");
                const password = await askQuestion("🔹 Enter password (leave empty to generate): ");
                await storePassword(service, username, password || null, loggedInUser);
                break;
            case "2":
                const retrieveService = await askQuestion("🔹 Enter service name: ");
                const retrieveUsername = await askQuestion("🔹 Enter username: ");
                await retrievePassword(retrieveService, retrieveUsername, loggedInUser);
                break;
            case "3":
                const deleteService = await askQuestion("🔹 Enter service name: ");
                const deleteUsername = await askQuestion("🔹 Enter username: ");
                await deletePassword(deleteService, deleteUsername, loggedInUser);
                break;
            case "4":
                console.log("👋 Logging out...");
                rl.close();
                process.exit(0);
            default:
                console.log("❌ Invalid choice. Try again.");
        }
    }
}

// Start application
async function startApp() {
    const firstTimeSetup = await askQuestion("🆕 Do you want to register a new user? (yes/no): ");
    if (firstTimeSetup.toLowerCase() === "yes") {
        const newUsername = await askQuestion("👤 Enter new username: ");
        const newPassword = await askQuestion("🔑 Enter new password: ");

        if (createUser(newUsername, newPassword)) {
            console.log(`✅ User '${newUsername}' created successfully!`);
        } else {
            console.log("❌ User already exists.");
        }
    }

    await login();
    await mainMenu();
}

// Run the application
startApp();