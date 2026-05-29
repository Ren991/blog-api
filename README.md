# blog-api

# Blog API + Frontend — Instructivo de instalación y configuración

## Stack utilizado

### Backend

* Laravel 12
* Sanctum
* SQLite
* Storage público para imágenes

### Frontend

* Next.js 16
* React
* TailwindCSS
* Tiptap Editor

---

# 1. Clonar proyecto

```bash
git clone <repo-url>
```

---

# 2. Backend Laravel

Entrar al backend:

```bash
cd blog-api
```

---

## Instalar dependencias PHP

```bash
composer install
```

---

## Crear archivo .env

Copiar el ejemplo:

```bash
cp .env.example .env
```

---

## Generar APP_KEY

```bash
php artisan key:generate
```

---

# 3. Configuración .env

## Variables importantes

### APP_URL

MUY importante para imágenes y storage.

En Codespaces:

```env
APP_URL=https://TU-PUERTO-8000.app.github.dev
```

Ejemplo:

```env
APP_URL=https://special-telegram-4964xv6xr6v2j9wp-8000.app.github.dev
```

---

## Base de datos SQLite

```env
DB_CONNECTION=sqlite
```

Crear archivo:

```bash
touch database/database.sqlite
```

---

# 4. Migraciones

```bash
php artisan migrate
```

---

# 5. Storage público

Crear symlink para acceso público a imágenes:

```bash
php artisan storage:link
```

Esto crea:

```txt
public/storage
```

apuntando a:

```txt
storage/app/public
```

Sin esto las imágenes NO se muestran.

---

# 6. Limpiar cache Laravel

MUY importante después de cambiar `.env`

```bash
php artisan optimize:clear
```

o:

```bash
php artisan config:clear
```

---

# 7. Levantar backend

```bash
php artisan serve
```

o en Codespaces normalmente:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

---

# 8. Frontend Next.js

Entrar al frontend:

```bash
cd blog-frontend
```

---

## Instalar dependencias

```bash
npm install
```

---

# 9. Dependencias importantes usadas

## Tiptap editor

```bash
npm install @tiptap/react
npm install @tiptap/starter-kit
npm install @tiptap/extension-underline
npm install @tiptap/extension-image
npm install @tiptap/extension-table
npm install @tiptap/extension-table-row
npm install @tiptap/extension-table-header
npm install @tiptap/extension-table-cell
```

---

## Emoji picker

```bash
npm install emoji-picker-react
```

---

## Icons

```bash
npm install lucide-react
```

---

## SweetAlert

```bash
npm install sweetalert2
```

---

# 10. Variables frontend

Crear:

```txt
.env.local
```

Ejemplo:

```env
NEXT_PUBLIC_API_URL=https://TU-BACKEND/api
```

Ejemplo real:

```env
NEXT_PUBLIC_API_URL=https://special-telegram-4964xv6xr6v2j9wp-8000.app.github.dev/api
```

---

# 11. Levantar frontend

```bash
npm run dev
```

Normalmente:

```txt
http://localhost:3000
```

o Codespaces:

```txt
https://TU-PUERTO-3000.app.github.dev
```

---

# 12. Sistema de imágenes

## Backend

UploadController:

```php
public function store(Request $request)
{
    $request->validate([
        'image' => 'required|image|max:4096',
    ]);

    $path = $request->file('image')
        ->store('posts', 'public');

    return response()->json([
        'url' =>
            config('app.url') .
            '/storage/' .
            $path
    ]);
}
```

---

## Route

```php
Route::post('/upload', [UploadController::class, 'store']);
```

---

# 13. Tiptap Image Extension

En `PostEditor.tsx`

```ts
import Image from "@tiptap/extension-image";
```

y registrar:

```ts
Image,
```

en:

```ts
extensions: []
```

---

# 14. Renderizar HTML

El contenido del post se guarda como HTML.

Ejemplo:

```html
<h1>Título</h1>
<p>Contenido</p>
<img src="...">
```

Para mostrarlo:

```tsx
<div
    dangerouslySetInnerHTML={{
        __html: post.content
    }}
/>
```

---

# 15. Render recomendado para posts

```tsx
<div
    className="
        prose
        prose-invert
        max-w-none
    "
    dangerouslySetInnerHTML={{
        __html: post.content
    }}
/>
```

---

# 16. Preview feed recomendado

NO usar line-clamp sobre HTML completo.

Mejor:

```ts
const preview =
    post.content.replace(/<[^>]+>/g, "");
```

y renderizar:

```tsx
<p className="line-clamp-3">
    {preview}
</p>
```

---

# 17. Funcionalidades implementadas

## Posts

* Crear
* Editar
* Eliminar
* Tags
* Likes
* Rich text editor
* Imágenes

## Comentarios

* Crear comentario
* Responder comentarios
* Replies anidados
* Eliminar comentarios
* Rate limiting

## Editor

* H1
* H2
* Bold
* Italic
* Underline
* Bullet list
* Ordered list
* Emojis
* Tablas dinámicas
* Upload de imágenes

---

# 18. Problemas comunes

## setImage is not a function

Falta:

```bash
npm install @tiptap/extension-image
```

o falta registrar extensión.

---

## ERR_CONNECTION_REFUSED localhost:8000

`APP_URL` incorrecto.

NO usar localhost en Codespaces.

---

## Imagen rota

Falta:

```bash
php artisan storage:link
```

---

## asset() devuelve localhost

Usar:

```php
config('app.url')
```

en vez de:

```php
asset()
```

---

# 19. Arquitectura sugerida frontend

```txt
components/
 ├── editor/
 │    ├── PostEditor.tsx
 │    └── Toolbar.tsx
 │
 ├── post/
 │    ├── PostCard.tsx
 │    ├── PostFeed.tsx
 │    └── CommentSection.tsx
```

---

# 20. Próximas features recomendadas

* Sistema follow users
* Notifications
* Markdown export
* Drafts
* Infinite scroll
* Image compression
* Syntax highlight
* Code blocks
* Saved posts
* Realtime comments
* Mention users
* Post bookmarks
* Profile pages
* Trending tags
* Search avanzada
* Dark/light theme
