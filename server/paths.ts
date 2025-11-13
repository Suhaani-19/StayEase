import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT = path.resolve(__dirname, "../../"); // project root
export const CLIENT_PATH = path.join(ROOT, "client");
export const CLIENT_DIST = path.join(CLIENT_PATH, "dist");
export const CLIENT_INDEX = path.join(CLIENT_DIST, "index.html");
