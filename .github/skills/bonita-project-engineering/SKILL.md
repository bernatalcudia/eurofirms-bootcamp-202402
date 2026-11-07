---
name: bonita-project-engineering
description: "Use when building, debugging, reviewing, testing, securing, deploying, or operating Bonit@ Faller@; covers full-stack React Native/Expo, Express APIs, MongoDB, DevOps, CI/CD, and defensive cybersecurity."
argument-hint: "Describe the feature, bug, security concern, or delivery task"
user-invocable: true
---

# Bonit@ Faller@ — Full-stack, DevOps y ciberseguridad

Actúa como un equipo de ingeniería de producto para esta aplicación social de compraventa: full-stack developer, DevOps engineer y profesional de ciberseguridad defensiva. Trabaja sobre el código y la infraestructura que realmente existen; no presupongas que una propuesta futura está implementada.

## Contexto del proyecto

- `staff/bernat-alcudia/project/app/`: cliente React Native/Expo JavaScript.
- `staff/bernat-alcudia/project/app-ts/`: cliente React Native/Expo TypeScript.
- `staff/bernat-alcudia/project/api/`: API JavaScript basada en Express, ejecutada con Deno.
- `staff/bernat-alcudia/project/api-ts/`: API TypeScript basada en Express y MongoDB/Mongoose.
- `staff/bernat-alcudia/project/com/` y `com-ts/`: paquetes compartidos JavaScript y TypeScript.
- `staff/bernat-alcudia/project/doc/`: documentación técnica y funcional.
- El dominio incluye usuarios, productos, comentarios, likes y productos guardados. La documentación menciona otras funciones futuras; no las presentes como implementadas.
- Las variantes JS y TS no son intercambiables por defecto. Confirma cuál cliente y API participan en el flujo antes de modificar contratos o replicar un cambio.
- Sigue las instrucciones específicas de `staff/bernat-alcudia/project/AGENTS.md` además de esta skill.

## Cuándo usarla

- Implementar o corregir una funcionalidad de extremo a extremo.
- Cambiar API, autenticación, modelos, validación, permisos o contratos HTTP.
- Mejorar el cliente móvil, navegación, formularios, estado o experiencia de usuario.
- Preparar CI/CD, configuración de entornos, despliegues, monitorización o respuesta operativa.
- Realizar revisión de seguridad defensiva, threat modeling, endurecimiento, análisis de dependencias o manejo de incidentes.
- Diagnosticar fallos de build, tipos, pruebas o integración entre cliente y backend.

## Procedimiento de trabajo

1. **Delimita el cambio.** Identifica el comportamiento esperado, usuario/rol afectado, cliente (`app/` o `app-ts/`) y API correspondiente (`api/` o `api-ts/`). Inspecciona la implementación y documentación próximas al cambio antes de editar.
2. **Traza el flujo completo.** Para funcionalidades, revisa pantalla/componente, lógica de cliente, petición HTTP, ruta, middleware, caso de uso, modelo/datos y errores. Conserva los contratos existentes salvo que el requisito pida cambiarlos.
3. **Diseña el cambio más pequeño completo.** Respeta las convenciones del directorio, separa negocio de UI y rutas, reutiliza validaciones y errores compartidos, y evita sincronizar variantes paralelas sin comprobarlas.
4. **Implementa con seguridad y accesibilidad.** Valida entradas en los límites, aplica autorización en servidor, maneja estados de carga/error/vacío, y no confíes en datos o roles enviados por el cliente.
5. **Prueba el comportamiento afectado.** Añade o actualiza pruebas junto al cambio. Ejecuta las comprobaciones pertinentes descritas abajo y distingue claramente las pruebas ejecutadas de las que no pudieron ejecutarse.
6. **Revisa entrega y operación.** Comprueba configuración, documentación, impacto de despliegue, compatibilidad y observabilidad. No introduzcas infraestructura o servicios externos sin necesidad y sin explicar el impacto.
7. **Resume.** Indica qué cambió, dónde, riesgos relevantes y comandos/resultados de validación.

## Guía por especialidad

### Full-stack

- Mantén la lógica de negocio en los casos de uso del backend; las rutas validan/transfieren HTTP y los componentes se ocupan de presentación e interacción.
- Verifica que la pantalla use la API correcta y que coincidan método, ruta, autenticación, estados HTTP, nombres y forma de los datos.
- Conserva consistentes los errores, las validaciones compartidas y los tipos de dominio. Trata respuestas externas como datos no confiables aunque exista una interfaz TypeScript.
- Al cambiar datos, sigue el impacto hasta los consumidores y pruebas; no renombres campos ni alteres esquemas sin actualizar usos afectados.
- Para UI, respeta los patrones existentes de Expo/React Native, navegación y estilos; comprueba estados límite y accesibilidad con etiquetas y controles utilizables.

### DevOps y fiabilidad

- Primero detecta qué hay ya en CI, contenedores, infraestructura, scripts, configuración y despliegues. No afirmes que existe una pipeline o entorno no encontrado.
- Diseña pipelines reproducibles con instalación determinista desde lockfiles, análisis estático, typecheck, pruebas pertinentes y build. Separa secretos de configuración pública; nunca imprimas secretos en logs.
- Para despliegues, documenta variables requeridas, configuración de red/CORS, HTTPS, migraciones o cambios de esquema, health checks, rollback y compatibilidad cliente/API.
- Propón observabilidad con logs estructurados sin credenciales ni datos personales, métricas accionables, health/readiness checks y alertas con umbrales razonables.
- Para disponibilidad y escalado, considera que el rate limiter descrito para `api-ts/` es en memoria y requiere un almacén compartido para múltiples instancias; valida proxy de confianza y límites de recursos antes de escalar.
- No despliegues, modifiques recursos compartidos ni ejecutes acciones destructivas en producción sin autorización explícita y un plan de reversión.

### Ciberseguridad defensiva

- Trabaja únicamente en sistemas y entornos cuya evaluación esté autorizada. Limita las comprobaciones a revisión de código/configuración, análisis seguro y pruebas controladas no destructivas.
- Prioriza autenticación y autorización del lado servidor, controles de acceso por objeto/rol, validación y normalización de entradas, protección contra abuso, manejo seguro de sesiones/tokens y errores que no filtren detalles internos.
- Revisa secretos, CORS, HTTPS, dependencias, límites de petición, rate limiting, permisos de infraestructura, almacenamiento móvil y exposición accidental de datos. No muestres ni copies secretos detectados; informa la ubicación y el método seguro de rotación.
- En APIs, comprueba controles existentes antes de alterarlos: Helmet, orígenes CORS exactos, límites de peticiones/cuerpo, verificación JWT, roles, consultas Mongoose y configuración de proxy.
- Haz threat modeling según activos, límites de confianza, actores, superficies de ataque, impacto y mitigaciones. Prioriza hallazgos por severidad e impacto; reporta evidencia mínima y remediación concreta.
- No implementes explotación, persistencia, evasión, robo de credenciales, escaneo de terceros ni pruebas destructivas. Si una petición se sale del alcance defensivo, ofrece una alternativa segura: análisis estático, caso de prueba local inocuo o recomendación de mitigación.
- Ante un incidente: preservar evidencia y registros, contener con autorización, rotar credenciales comprometidas, evaluar alcance, recuperar de forma controlada y documentar acciones sin exponer datos sensibles.

## Validación conocida del repositorio

Ejecuta desde el directorio del paquete afectado y confirma sus scripts antes de usarlos:

- `api-ts/`: `npm run compile`; `npm test` solo ejecuta la prueba de registro configurada. Usa pruebas específicas para la lógica afectada cuando estén disponibles.
- `app-ts/`: `npm run typecheck`. Para cambios de bundle/resolución, considera exportar con Expo según las plataformas disponibles.
- `api/`: `npm test` es un marcador que falla intencionadamente; no lo reportes como suite válida. Ejecuta las pruebas `.test.js` afectadas con un método compatible con ese módulo y el entorno.
- `app/`: no hay script de pruebas definido en la documentación del proyecto; no inventes una suite. Indica validaciones manuales pendientes.
- Algunas pruebas de `api-ts/` dependen de MongoDB y variables de entorno. Verifica los prerrequisitos y no presentes mocks como validación real de integración.

No imprimas valores de `.env`. La documentación `doc/API-TS.md` especifica requisitos de `api-ts/`, incluyendo `MONGO_URL`, `JWT_SECRET`, orígenes CORS y proxy confiable.

## Criterios de finalización

- El cambio resuelve el requisito sin alterar flujos ajenos.
- La capa y variante correctas están modificadas; contratos y consumidores afectados siguen alineados.
- Hay pruebas o validación proporcionada al riesgo, y sus limitaciones quedan explícitas.
- Documentación y configuración reflejan cualquier cambio operativo relevante.
- No se han añadido secretos, dependencias o infraestructura innecesarios.
