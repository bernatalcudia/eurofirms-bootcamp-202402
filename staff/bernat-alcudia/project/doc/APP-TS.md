# Cliente móvil TypeScript

`app-ts/` es el cliente Expo en TypeScript. `app/` sigue siendo el cliente JavaScript original y se conserva para comparar los flujos durante la migración.
El cliente consume el paquete compartido local `com-ts/` para validaciones, utilidades y errores.

## Desarrollo

1. Instala las dependencias desde `app-ts/` con `npm install`.
2. Crea `app-ts/.env` a partir de `.env.example` y configura `EXPO_PUBLIC_API_URL` con la URL accesible de `api-ts/`.
3. Inicia Expo desde `app-ts/` con `npm start`; usa `npm run android`, `npm run ios` o `npm run web` para las plataformas correspondientes.
4. Comprueba los tipos con `npm run typecheck`.

Los estilos de pantallas, componentes y navegación están centralizados en `src/styles/`, en módulos por pantalla/componente. Las fábricas de estilos reciben la paleta activa para conservar la compatibilidad con los temas; los estilos de autenticación compartidos se definen en `Auth.styles.ts`.

El cliente consume las rutas de `api-ts/` para registro, autenticación, productos y comentarios. La foto de perfil se selecciona desde la biblioteca, se reduce y guarda con el perfil; también se puede eliminar. Al añadir el módulo nativo de procesamiento de imágenes es necesario reconstruir los clientes de desarrollo instalados.

El catálogo utiliza una cuadrícula adaptable de una a tres columnas y limita la altura de las imágenes. Los productos guardados permiten abrir la ficha.

## Pruebas de navegador

Instala también las dependencias de `api-ts/`. Desde `app-ts/`, ejecuta `npm run test:e2e`. La prueba inicia Expo web, una API y una réplica temporal aislada de MongoDB en los puertos 19081 y 19010; no usa los datos ni el `.env` existentes. La primera ejecución puede descargar el binario de MongoDB. Necesita Chrome instalado en su ubicación habitual en Windows, un navegador Chromium instalado con `npx playwright install chromium`, o la ruta del ejecutable en `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. La prueba cubre flujos web; no sustituye pruebas en dispositivos Android o iOS.

## Auditoría de dependencias

La auditoría del 8 de noviembre de 2026 sigue señalando vulnerabilidades en el árbol de `app-ts/`, incluida una crítica en `tar` utilizada por herramientas de Expo, y avisos en navegación. Se ha actualizado la validación compartida y se ha fijado una versión corregida de PostCSS para Metro; el override debe revisarse al migrar Expo. La resolución completa requiere actualizar Expo/React Native y navegación, y validar las aplicaciones nativas; no se debe asumir que la aplicación está libre de avisos. `api-ts/` conserva tres avisos moderados en dependencias de desarrollo de Mocha.

El registro público crea usuarios con el rol `regular`; no permite elegir ni asignar `admin`. Las cuentas `admin` deben aprovisionarse por un mecanismo de confianza del servidor. Tanto `regular` como `admin` pueden acceder a la creación de productos. La aplicación solo acepta los roles `regular` y `admin`.

## Apariencia e idioma

En el perfil se puede desplegar la preferencia de idioma (español o inglés) y elegir entre los temas Claro, Oscuro y Fallera. Las preferencias se guardan en el dispositivo. Fallera tiene una paleta propia de tonos cálidos, rosa/burdeos y terracota, diferenciada de Claro y con una muestra visible en el selector. Las paletas mantienen contraste legible y se aplican también a navegación, formularios y estados de catálogo. El idioma se cambia únicamente desde el perfil.
