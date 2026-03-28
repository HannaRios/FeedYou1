import db from './db.js';

await db.query("UPDATE usuarios SET foto_perfil = '/uploads/perfiles/default.png' WHERE foto_perfil IS NULL OR foto_perfil = '' OR foto_perfil = '/avatar-default.png'");
const [res] = await db.query("SELECT COUNT(*) as count FROM usuarios WHERE foto_perfil = '/uploads/perfiles/default.png'");
console.log('Ahora hay', res[0].count, 'usuarios con foto por defecto');
process.exit(0);
