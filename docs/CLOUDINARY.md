# Cloudinary — imágenes de productos

Mailo usa **Cloudinary** para subir y servir imágenes del pet shop.

## Configuración en Cloudinary

1. Crea cuenta en [cloudinary.com](https://cloudinary.com)
2. En el **Dashboard** copia tu **Cloud name**
3. Ve a **Settings → Upload → Upload presets**
4. Crea un preset:
   - **Name:** `mailo_products`
   - **Signing mode:** **Unsigned** (necesario para el widget en el admin)
   - **Folder:** `mailo/productos` (opcional)
   - Guarda

## Variables en `.env`

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=mailo_products
```

Opcional (operaciones desde servidor):

```env
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Uso en el admin

En `/admin/tienda`, al crear o editar un producto:

1. Pulsa **Subir imagen con Cloudinary**
2. Elige archivo(s) desde tu computador
3. Las URLs se guardan en `products.imageUrls` en Neon
4. Se muestran en `/tienda` y el carrito

## Vercel

Agrega las mismas variables `NEXT_PUBLIC_*` en el proyecto de Vercel.

## Carpeta en Cloudinary

Las imágenes se suben a `mailo/productos/` para mantener el catálogo organizado.
