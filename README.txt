ROCK BURGER RASTREO V1
1. Crea un proyecto en Supabase.
2. Ejecuta supabase.sql en SQL Editor.
3. Copia Project URL y Publishable/anon key en config.js. NUNCA uses service_role en el navegador.
4. Confirma el pin exacto de Rock Burger y reemplaza lat/lng provisionales en config.js.
5. Publica la carpeta mediante HTTPS (GitHub Pages sirve).
6. Repartidor abre driver.html, permite GPS y pulsa Iniciar turno.
7. Administrador abre admin.html.
Esta V1 valida GPS/realtime con un repartidor. La distancia es línea recta. Después añadiremos seguridad con Auth, ETA por calles y, si hace falta, app Android para ubicación fiable en segundo plano.
