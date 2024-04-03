import { app } from './app.js';
import { CONFIG } from './config/index.js';
(async () => {
    try {
        app.listen(CONFIG.PORT, () => {
            console.log(`Server listening on ${CONFIG.PORT}!`);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
