# Instrucciones del proyecto Bonit@ Faller@

Estas indicaciones se aplican solo a `staff/bernat-alcudia/project/`.

## Contexto y arquitectura

- Es una aplicación de compraventa social de productos. El dominio incluye usuarios buyer/seller, productos, comentarios, likes y productos guardados.
- `app/` es el cliente React Native con Expo en JavaScript; `app-ts/` es su cliente TypeScript independiente. En ambos, las pantallas, componentes y lógica están en sus directorios correspondientes.
- `api-ts/` es una API Express con TypeScript y MongoDB/Mongoose. Las rutas están en `routes/`, los casos de uso en `logic/`, los modelos en `data/` y el middleware en `middlewares/`.
- `api/` contiene la API JavaScript y `api-ts/` su implementación TypeScript; sus contratos HTTP no son idénticos. `com/` y `com-ts/` son las variantes JavaScript y TypeScript del paquete compartido.
- Los clientes `app/` y `app-ts/` usan actualmente los endpoints de `api/`. Comprueba qué backend consume el flujo antes de cambiar rutas o cuerpos de petición.
- Antes de implementar una funcionalidad, confirma qué API y paquete compartido usa el flujo que vas a modificar. No asumas que las implementaciones paralelas están sincronizadas ni propagues cambios automáticamente a ambas.
- `doc/README.md` describe el producto y sus casos de uso; distingue lo que ya está implementado de lo que allí figura como versión futura.

## Cambios y convenciones

- Sigue los patrones existentes en el directorio afectado y conserva la separación entre rutas, lógica, modelos y middleware en las APIs.
- Mantén la lógica de negocio fuera de las rutas y de los componentes. Reutiliza las validaciones y los errores de `com/` o `com-ts/` que use esa parte del proyecto.
- Al cambiar un caso de uso de la API, revisa sus pruebas y el consumidor correspondiente en `app/logic/` o `app-ts/src/logic/`, según el cliente afectado. Conserva los contratos actuales de rutas, estados HTTP y cuerpos de respuesta, salvo que el cambio solicite explícitamente modificarlos.
- Para cambios en modelos o datos, comprueba los usos en los casos de uso, rutas y app; evita cambiar el esquema o los nombres de campos sin actualizar los consumidores afectados.
- Añade o actualiza pruebas para cambios de comportamiento. No introduzcas dependencias, abstracciones o refactorizaciones amplias si una modificación localizada resuelve el problema.
- No guardes secretos ni valores de `.env` en el código, las pruebas, los logs o la documentación. No muestres esos valores al inspeccionar configuración.

## TypeScript

- En `api-ts/`, `com-ts/` y `app-ts/`, conserva la comprobación estricta configurada por cada proyecto. Usa `.tsx` para módulos con JSX y `.ts` para lógica, tipos y utilidades sin JSX.
- Declara tipos explícitos en contratos de funciones y módulos: modelos de dominio, parámetros y respuestas HTTP, errores, propiedades de componentes, navegación y estado React. Usa uniones discriminadas para valores finitos como roles y estados de producto.
- Evita `any`, aserciones de tipo injustificadas y tipos amplios que oculten errores. Trata entradas externas como `unknown`, valida su forma en los límites y estrecha el tipo antes de usarlas. En bloques `catch`, comprueba el error antes de leer propiedades.
- Usa `import type` para dependencias que solo aportan tipos. Respeta las convenciones del resolvedor local: `api-ts/` puede requerir extensiones `.js` en imports relativos para el runtime ESM; los imports locales de `app-ts/` deben seguir siendo resolubles por Metro.
- No consideres un cambio de TypeScript válido solo por compilar: ejecuta el typecheck del paquete afectado y sus pruebas pertinentes. Para `app-ts/`, usa los tipos definidos en `src/types/` y no des por válida una respuesta de API solo por una aserción de tipo.
- No compartas tipos de servidor con el cliente mediante imports que acoplen Metro a dependencias Node.js. Si un contrato debe compartirse, colócalo en un paquete compatible con ambos entornos.

## Commits

- Usa Conventional Commits: `<tipo>(<ámbito opcional>): <resumen>`, por ejemplo `feat(api): add product search` o `docs: document project conventions`.
- Elige un tipo coherente con el cambio: `feat` (funcionalidad), `fix` (corrección), `docs` (documentación), `test` (pruebas), `refactor` (refactorización), `chore` (mantenimiento), `build` (build/dependencias), `ci` (integración continua), `perf` (rendimiento) o `revert` (reversión).
- Escribe el resumen en imperativo, breve y sin punto final. Usa el ámbito para identificar el área afectada (`app`, `app-ts`, `api`, `api-ts`, `com`, `com-ts` o `docs`) cuando aporte claridad.
- Para cambios incompatibles, añade `!` al tipo o ámbito y explica el cambio en el cuerpo o con un pie `BREAKING CHANGE:`.
- No incluyas cambios ajenos al trabajo en el commit; añade únicamente los archivos relacionados.

## Validación

- API TypeScript: desde `api-ts/`, usa `npm run compile` para comprobar tipos. `npm test` ejecuta únicamente `logic/registerUser.test.ts`; ejecuta o actualiza las pruebas específicas afectadas cuando sea posible.
- API JavaScript: no uses `npm test` como validación; su script actual es un marcador que termina con error (`Error: no test specified`). Ejecuta las pruebas existentes de la lógica que hayas cambiado con el método compatible con ese módulo.
- Apps Expo: en `app-ts/`, ejecuta `npm run typecheck` y, si el cambio afecta al bundle o a la resolución de módulos, `npx expo export --platform web` y la plataforma correspondiente. `app/` no define un script de pruebas. No inventes un comando de test; explica cualquier verificación manual pendiente.
- Los scripts `test-mocha` de `api-ts/` invocan `bash`; ten en cuenta la disponibilidad de ese shell en el entorno antes de usarlos.
- Si una comprobación depende de MongoDB o de variables de entorno, verifica que el entorno de prueba esté configurado y no sustituyas esos requisitos por resultados simulados presentados como éxito.

## Evolución y documentación

- Mantén `doc/README.md` actualizado cuando cambien los casos de uso, el modelo de datos o la arquitectura.
- Si una tarea afecta a ambas implementaciones de API, documenta y valida las diferencias entre ellas; no presupongas paridad funcional.
- En la respuesta final, resume los archivos y el comportamiento modificados, las comprobaciones ejecutadas y las limitaciones conocidas.
