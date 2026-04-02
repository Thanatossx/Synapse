/**
 * Vercel: Express uygulamasını doğrudan export etmek resmi önerilen kalıp.
 * (async wrapper + app(req,res) bazı ortamlarda 500 / yarım yanıta yol açabiliyor.)
 */
import { app } from "../server/app.js";

export default app;
