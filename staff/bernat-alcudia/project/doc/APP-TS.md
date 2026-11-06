# Cliente móvil TypeScript

`app-ts/` es el cliente Expo en TypeScript. `app/` sigue siendo el cliente JavaScript original y se conserva para comparar los flujos durante la migración.

## Desarrollo

1. Instala las dependencias desde `app-ts/` con `npm install`.
2. Crea `app-ts/.env` a partir de `.env.example` y configura `EXPO_PUBLIC_API_URL` con la URL accesible de la API JavaScript de `api/`.
3. Inicia Expo desde `app-ts/` con `npm start`; usa `npm run android`, `npm run ios` o `npm run web` para las plataformas correspondientes.
4. Comprueba los tipos con `npm run typecheck`.

El cliente mantiene los endpoints de `api/` (`/users/auth`, `/users/buyers`, `/products` y `/comments`). La API TypeScript de `api-ts/` usa rutas distintas actualmente; no es intercambiable sin adaptar el contrato. Las pruebas automatizadas de interfaz aún no están configuradas.
