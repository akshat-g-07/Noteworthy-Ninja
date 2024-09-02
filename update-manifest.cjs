const fs = require("fs");
const path = require("path");
require("dotenv").config();

const manifestPath = path.join(__dirname, "public", "manifest.json");

let manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

manifest.oauth2.client_id = process.env.VITE_CLIENT_ID;

let hostPermissionsVal = process.env.VITE_PAYMENT_SERVICE + "/*";
manifest.host_permissions = [hostPermissionsVal];

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
