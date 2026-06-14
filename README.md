# Pagina personal con gestor

Esta carpeta contiene una pagina web estatica para mostrar informacion personal, gustos y fotografias, ademas de un gestor para crear, editar y eliminar contenido.

Archivos principales:

- `index.html`: pagina publica.
- `admin.html`: gestor de contenido.
- `styles.css`: estilos visuales.
- `app.js`: logica de la pagina publica.
- `admin.js`: logica del gestor.
- `supabase-config.js`: configuracion de Supabase.
- `supabase-schema.sql`: estructura recomendada para la base de datos.

## Como usarla

Abre `index.html` para ver la pagina publica y `admin.html` para gestionar la informacion.

Por defecto funciona en modo local usando el navegador. Para conectar Supabase:

1. Crea un proyecto en Supabase.
2. Ejecuta el contenido de `supabase-schema.sql` en el SQL Editor.
3. Crea un bucket publico llamado `gallery` en Storage.
4. Crea un usuario en Authentication para poder entrar al gestor.
5. Copia tu Project URL y anon public key en `supabase-config.js`.
