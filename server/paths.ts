import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root (top-level StayEase folder)
export const ROOT = path.resolve(__dirname, "../../"); // Adjust relative path to root as needed

// Client folder: sibling to server, not inside it
export const CLIENT_PATH = path.join(ROOT, "client");

// Dev index.html & production build folder remain the same
export const CLIENT_INDEX = path.join(CLIENT_PATH, "index.html");
export const CLIENT_DIST = path.join(CLIENT_PATH, "dist");
