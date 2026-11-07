# Cliente móvil TypeScript

`app-ts/` es el cliente Expo en TypeScript. `app/` sigue siendo el cliente JavaScript original y se conserva para comparar los flujos durante la migración.
El cliente consume el paquete compartido local `com-ts/` para validaciones, utilidades y errores.

## Desarrollo

1. Instala las dependencias desde `app-ts/` con `npm install`.
2. Crea `app-ts/.env` a partir de `.env.example` y configura `EXPO_PUBLIC_API_URL` con la URL accesible de `api-ts/`.
3. Inicia Expo desde `app-ts/` con `npm start`; usa `npm run android`, `npm run ios` o `npm run web` para las plataformas correspondientes.
4. Comprueba los tipos con `npm run typecheck`.

Los estilos de pantallas, componentes y navegación están centralizados en `src/styles/`, en módulos por pantalla/componente. Las fábricas de estilos reciben la paleta activa para conservar la compatibilidad con los temas; los estilos de autenticación compartidos se definen en `Auth.styles.ts`.

El cliente consume las rutas de `api-ts/` para registro, autenticación, productos y comentarios. Las pruebas automatizadas de interfaz aún no están configuradas.

El registro público crea usuarios con el rol `regular`; no permite elegir ni asignar `admin`. Las cuentas `admin` deben aprovisionarse por un mecanismo de confianza del servidor. Tanto `regular` como `admin` pueden acceder a la creación de productos. La aplicación solo acepta los roles `regular` y `admin`.

## Apariencia e idioma

En el perfil se puede desplegar la preferencia de idioma (español o inglés) y elegir entre los temas Claro, Oscuro y Fallera. Las preferencias se guardan en el dispositivo. Fallera tiene una paleta propia de tonos cálidos, rosa/burdeos y terracota, diferenciada de Claro y con una muestra visible en el selector. Las paletas mantienen contraste legible y se aplican también a navegación, formularios y estados de catálogo. El idioma se cambia únicamente desde el perfil.
