# Cliente móvil TypeScript

`app-ts/` es el cliente Expo en TypeScript. `app/` sigue siendo el cliente JavaScript original y se conserva para comparar los flujos durante la migración.
El cliente consume el paquete compartido local `com-ts/` para validaciones, utilidades y errores.

## Desarrollo

1. Utiliza Node.js `^22.13.0`, `^24.3.0`, `^26.0.0` o `>=27.0.0` e instala las dependencias desde `app-ts/` con `npm ci`.
2. Crea localmente `app-ts/.env` y configura `EXPO_PUBLIC_API_URL` con la URL accesible de `api-ts/`. No subas el archivo a Git.
3. Inicia Expo desde `app-ts/` con `npm start`; usa `npm run android`, `npm run ios` o `npm run web` para las plataformas correspondientes.
4. Comprueba los tipos con `npm run typecheck`.

Los estilos de pantallas, componentes y navegación están centralizados en `src/styles/`, en módulos por pantalla/componente. Las fábricas de estilos reciben la paleta activa para conservar la compatibilidad con los temas; los estilos de autenticación compartidos se definen en `Auth.styles.ts`.

El cliente usa Expo SDK 58, React Native 0.88 y React Navigation 7 y consume las rutas de `api-ts/` para registro, autenticación, productos y comentarios. La foto de perfil se selecciona desde la biblioteca, se reduce y guarda con el perfil; también se puede eliminar. Tras actualizar Expo y los módulos nativos hay que reconstruir los clientes de desarrollo instalados; no basta con actualizar JavaScript.

El catálogo utiliza una cuadrícula adaptable de una a tres columnas y limita la altura de las imágenes. Los productos guardados permiten abrir la ficha.

## Android

Requiere el SDK de Android (plataforma 36/37, el Gradle plugin lo descarga si has aceptado las licencias), JDK 17 o superior y un emulador o dispositivo. Los directorios `android/` e `ios/` se generan con `npx expo prebuild` y están ignorados por Git; la app sigue siendo un proyecto Expo gestionado. Inicia `api-ts/` y Expo con `EXPO_PUBLIC_API_URL=http://10.0.2.2:<puerto>` (el emulador accede al equipo anfitrión por `10.0.2.2`), y ejecuta `npm run android`. En Windows, el build C++ de los módulos nativos falla si la ruta del proyecto es larga (límite de 260 caracteres): compila desde una copia en una ruta corta como `C:\b\app-ts`, o activa las rutas largas de Windows. Las versiones de producción exigen una URL de API `https://`; el tráfico HTTP solo se admite en desarrollo. La copia de seguridad automática de Android está desactivada y la app no solicita el permiso de micrófono.

Se ha comprobado un build de depuración (x86_64) en un emulador Pixel 9 con Android 36: inicio de sesión, catálogo, likes, guardados, ficha del producto, chat con el vendedor, perfil y creación de un producto con foto de la galería. No se ha probado en dispositivos físicos ni en versiones de Android distintas. Las fuentes de iconos se cargan desde JavaScript con `expo-font` (`App.tsx`), porque `react-native-vector-icons` no las enlaza solo en un proyecto Expo gestionado. Como Android dibuja de borde a borde, la ventana ya no se redimensiona al abrir el teclado: `KeyboardAvoidingContainer` mide su posición y reserva el espacio que cubre el teclado, y `KeyboardAwareScrollView` desplaza el campo enfocado hasta dejarlo visible (formularios de login, registro, contraseña, perfil y producto) y el chat usa el mismo contenedor. En iOS se usa `KeyboardAvoidingView`, sin probar.

iOS no se ha compilado ni probado: requiere macOS y Xcode. Solo se ha comprobado que el bundle JavaScript de iOS se exporta (`npx expo export --platform ios`).

## Pruebas de navegador

Instala también las dependencias de `api-ts/`. Desde `app-ts/`, ejecuta `npm run test:e2e`. La prueba inicia Expo web, una API y una réplica temporal aislada de MongoDB en los puertos 19081 y 19010; no usa los datos ni el `.env` existentes. La primera ejecución puede descargar el binario de MongoDB. Necesita Chrome instalado en su ubicación habitual en Windows, un navegador Chromium instalado con `npx playwright install chromium`, o la ruta del ejecutable en `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. La prueba cubre flujos web; no sustituye pruebas en dispositivos Android o iOS.

## Auditoría de dependencias

La auditoría del 8 de noviembre de 2026 señala cinco avisos moderados en `app-ts/`, propagados desde `glob` y `minimatch` en las herramientas de Expo, y tres moderados en `api-ts/` a través de Mocha, una dependencia de desarrollo. Las versiones corregidas disponibles no satisfacen los rangos declarados por esos paquetes; no se ha aplicado `npm audit fix --force` porque propone cambios incompatibles. Revisa las auditorías y las actualizaciones de los proveedores antes de cada despliegue. Los bundles web, Android e iOS se pueden comprobar con `npx expo export --platform all`, pero esto no sustituye compilar los proyectos nativos ni probarlos en dispositivos. Android se probó en emulador (véase la sección Android); iOS sigue pendiente de validación en macOS con Xcode.

El registro público crea usuarios con el rol `regular`; no permite elegir ni asignar `admin`. Las cuentas `admin` deben aprovisionarse por un mecanismo de confianza del servidor. Tanto `regular` como `admin` pueden acceder a la creación de productos. La aplicación solo acepta los roles `regular` y `admin`.

## Apariencia e idioma

En el perfil se puede desplegar la preferencia de idioma (español o inglés) y elegir entre los temas Claro, Oscuro y Fallera. Las preferencias se guardan en el dispositivo. Fallera tiene una paleta propia de tonos cálidos, rosa/burdeos y terracota, diferenciada de Claro y con una muestra visible en el selector. Las paletas mantienen contraste legible y se aplican también a navegación, formularios y estados de catálogo. El idioma se cambia únicamente desde el perfil.
