import db from './db.js';

async function run() {
    try {
        console.log("Alterando url_media...");
        await db.query('ALTER TABLE publicaciones MODIFY COLUMN url_media TEXT');
        console.log("Alterando enlace_externo...");
        await db.query('ALTER TABLE publicaciones MODIFY COLUMN enlace_externo TEXT');
        console.log("Alterando archivo...");
        await db.query('ALTER TABLE publicaciones MODIFY COLUMN archivo TEXT');
        console.log("TABLAS ALTERADAS CORRECTAMENTE.");
    } catch (e) {
        console.error("Error alterando tablas:", e.message);
    }
    process.exit();
}

run();
