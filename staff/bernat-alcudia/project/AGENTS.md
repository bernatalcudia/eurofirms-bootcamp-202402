# Instrucciones del proyecto Bonit@ Faller@

Estas indicaciones se aplican solo a `staff/bernat-alcudia/project/`.

## Contexto y arquitectura

- Es una aplicación de compraventa social de productos. El dominio incluye usuarios buyer/seller, productos, comentarios, likes y productos guardados.
- `app/` es el cliente React Native con Expo. Las pantallas están en `pages/`, los componentes reutilizables en `components/` y las llamadas a la API en `logic/`.
- `api-ts/` es una API Express con TypeScript y MongoDB/Mongoose. Las rutas están en `routes/`, los casos de uso en `logic/`, los modelos en `data/` y el middleware en `middlewares/`.
- `api/` contiene una implementación anterior de la API en JavaScript. `com/` y `com-ts/` son paquetes compartidos correspondientes a las variantes JavaScript y TypeScript.
- Antes de implementar una funcionalidad, confirma qué API y paquete compartido usa el flujo que vas a modificar. No asumas que las implementaciones paralelas están sincronizadas ni propagues cambios automáticamente a ambas.
- `doc/README.md` describe el producto y sus casos de uso; distingue lo que ya está implementado de lo que allí figura como versión futura.

## Cambios y convenciones

- Sigue los patrones existentes en el directorio afectado. En `api-ts/`, conserva TypeScript estricto, imports con extensión `.js` cuando corresponda al patrón local y la separación entre rutas, lógica, modelos y middleware.
- Mantén la lógica de negocio fuera de las rutas y de los componentes. Reutiliza las validaciones y los errores de `com/` o `com-ts/` que use esa parte del proyecto.
- Al cambiar un caso de uso de la API, revisa sus pruebas y el consumidor correspondiente en `app/logic/`. Conserva los contratos actuales de rutas, estados HTTP y cuerpos de respuesta, salvo que el cambio solicite explícitamente modificarlos.
- Para cambios en modelos o datos, comprueba los usos en los casos de uso, rutas y app; evita cambiar el esquema o los nombres de campos sin actualizar los consumidores afectados.
- Añade o actualiza pruebas para cambios de comportamiento. No introduzcas dependencias, abstracciones o migraciones amplias si una modificación localizada resuelve el problema.
- No guardes secretos ni valores de `.env` en el código, las pruebas, los logs o la documentación. No muestres esos valores al inspeccionar configuración.

## Commits

- Usa Conventional Commits: `<tipo>(<ámbito opcional>): <resumen>`, por ejemplo `feat(api): add product search` o `docs: document project conventions`.
- Elige un tipo coherente con el cambio: `feat` (funcionalidad), `fix` (corrección), `docs` (documentación), `test` (pruebas), `refactor` (refactorización), `chore` (mantenimiento), `build` (build/dependencias), `ci` (integración continua), `perf` (rendimiento) o `revert` (reversión).
- Escribe el resumen en imperativo, breve y sin punto final. Usa el ámbito para identificar el área afectada (`app`, `api`, `api-ts`, `com`, `com-ts` o `docs`) cuando aporte claridad.
- Para cambios incompatibles, añade `!` al tipo o ámbito y explica el cambio en el cuerpo o con un pie `BREAKING CHANGE:`.
- No incluyas cambios ajenos al trabajo en el commit; añade únicamente los archivos relacionados.

## Validación

- API TypeScript: desde `api-ts/`, usa `npm run compile` para comprobar tipos. `npm test` ejecuta únicamente `logic/registerUser.test.ts`; ejecuta o actualiza las pruebas específicas afectadas cuando sea posible.
- API JavaScript: no uses `npm test` como validación; su script actual es un marcador que termina con error (`Error: no test specified`). Ejecuta las pruebas existentes de la lógica que hayas cambiado con el método compatible con ese módulo.
- App Expo: `app/` no define un script de pruebas. No inventes un comando de test; valida los cambios con las comprobaciones disponibles y explica cualquier verificación manual pendiente.
- Los scripts `test-mocha` de `api-ts/` invocan `bash`; ten en cuenta la disponibilidad de ese shell en el entorno antes de usarlos.
- Si una comprobación depende de MongoDB o de variables de entorno, verifica que el entorno de prueba esté configurado y no sustituyas esos requisitos por resultados simulados presentados como éxito.

## Evolución y documentación

- Mantén `doc/README.md` actualizado cuando cambien los casos de uso, el modelo de datos o la arquitectura.
- Si una tarea afecta a ambas implementaciones de API, documenta y valida las diferencias entre ellas; no presupongas paridad funcional.
- En la respuesta final, resume los archivos y el comportamiento modificados, las comprobaciones ejecutadas y las limitaciones conocidas.
