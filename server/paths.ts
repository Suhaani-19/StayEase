import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Correct project root: /Users/suhaanigarg/StayEase
export const ROOT = path.resolve(__dirname, "..");

// ✅ Client paths
export const CLIENT_PATH = path.join(ROOT, "client");

// ✅ Dev index.html (Vite dev server)
export const CLIENT_INDEX = path.join(CLIENT_PATH, "index.html");

// ✅ Production build folder (used only after npm run build)
export const CLIENT_DIST = path.join(CLIENT_PATH, "dist");
