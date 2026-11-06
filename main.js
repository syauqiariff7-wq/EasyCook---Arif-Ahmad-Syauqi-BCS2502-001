const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

//Create window
function createWindow() {
    const window = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    window.loadFile("renderer/index.html");
}

//Get the location of mealplans.json
function getMealPlansFile() {
    return path.join(__dirname, "data", "mealplans.json");
}

//Read meal plans from JSON file
ipcMain.handle("load-meal-plans", function() {
    const filePath = getMealPlansFile();

    const data = fs.readFileSync(filePath, "utf8");

    return JSON.parse(data);
});

//Save meal plans to JSON file
ipcMain.handle("save-meal-plans", function(event, mealPlans) {
    const filePath = getMealPlansFile();

    fs.writeFileSync(filePath, JSON.stringify(mealPlans, null, 4));

    return true;
});

app.whenReady().then(createWindow);