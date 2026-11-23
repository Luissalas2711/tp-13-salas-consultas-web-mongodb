# Trabajo práctico 13 - Consultas de reservas

## 1. Punto de partida

Nombre de la entrega: tp-13-salas-consultas-web-mongodb
Punto de partida: copia del TP 12 terminado. Se conservan el sitio web, la API, la conexion con mongoDB y las funciones de gestion de reservas. Este trabajo agrega busqueda por nombre de estudiante, filtro por sala, ordenamiento y paginacion. Estas consultas estan disponibles en la web y en GET /api/reservas/consulta.

## 2. Herramientas y base de datos

- Node.js: v24.19.0
- Express: v5.2.1
- Mongoose: v9.11.2
- Base de datos: MongoDB Atlas Free (M0), `reservas_salas_u13`
- Colección: `reservas`

## 3. Preparación y ejecución

1. Instalar las dependencias con `npm ci`.
2. Preparar una base gratuita en MongoDB Atlas con un usuario que tenga permiso para leer y guardar reservas.
3. Copiar `.env.example` como `.env` y colocar allí la dirección privada de conexión a la base.
4. Si la colección está vacía, crear desde el formulario las reservas de ejemplo indicadas en la consigna:
   - Ana Ejemplo: `ana@example.com`, Sala Norte, 2026-11-11, Mañana, 2 personas.
   - Bruno Ejemplo: `bruno@example.com`, Sala Sur, 2026-11-11, Tarde, 3 personas.
5. Iniciar el sitio con `npm start` y abrir `http://localhost:3000`.

Las fechas son ilustrativas. No se cargan reservas automáticamente ni se deben volver a crear si ya existen.

## 4. Conexión y comandos

La aplicación se conecta a MongoDB Atlas al iniciarse. En este proyecto se configuraron servidores DNS públicos para resolver la dirección de Atlas.

- Comprobar la conexión: `node --env-file .env scripts/comprobar-conexion.js`
- Revisar formato y errores de código: `npm run check`
- Iniciar la aplicación: `npm start`

## 5. Qué hace la aplicación

La aplicación permite crear, consultar y editar reservas desde el sitio web, además de cambiar el estado y eliminar reservas. En el listado se puede buscar por nombre de estudiante, filtrar por sala, elegir el orden y recorrer los resultados paginados. La API ofrece la misma consulta en GET /api/reservas/consulta; la web y la API utilizan las reservas guardadas en MongoDB.

Cada reserva tiene estudiante, email, sala, fecha, turno, cantidad de personas y estado. El estado puede ser `pendiente` o `confirmada`; una reserva nueva comienza como `pendiente`.

Para editar desde la web, se abre el detalle de una reserva y se presiona **Editar reserva**. El formulario muestra los datos actuales. Al guardar, se reemplaza la reserva completa y se vuelve al listado.

## 6. Reglas de las operaciones

El formulario y la API verifican que los datos estén completos y sean válidos: email con `@`, sala y turno permitidos, personas entre 1 y 6, y estado `pendiente` o `confirmada`.

La API requiere los siete campos para un reemplazo completo con PUT. Si falta un campo o algún valor no es válido, responde con error y no modifica la reserva. Si un formulario web tiene errores, vuelve a mostrarse con los valores ingresados para poder corregirlos.

Un ID mal formado responde 400. Un ID con formato válido que no corresponde a una reserva existente responde 404. La fecha es ilustrativa: no se comprueba que sea futura. Tampoco se controla la disponibilidad de salas.

El formulario web para cambiar el estado solo admite `pendiente` o `confirmada` y modifica únicamente ese campo. La eliminación web requiere que la persona confirme con `confirmar=si`; se rechazan confirmaciones vacías, incorrectas o con campos extra. Después de una acción correcta, la web redirige al listado.

Para consultar reservas, q busca un fragmento del nombre del estudiante sin distinguir mayúsculas y trata los caracteres especiales como texto literal; admite hasta 60 caracteres. sala filtra por coincidencia exacta y admite hasta 80 caracteres. orden acepta estudiante, personas-asc o personas-desc; si se omite, usa estudiante. pagina va de 1 a 1000 y, si se omite, vale 1. limite va de 1 a 20 y, si se omite, vale 2. Se rechazan parámetros desconocidos, repetidos o inválidos con estado 400.

## 7. Pruebas realizadas

| Prueba | Resultado |
|---|---|
| Búsqueda de `[` y `.*` en la web | No hubo coincidencias; se trataron como texto literal |
| Búsqueda de `A%2BB` en la web | Se encontró Carla (A+B) |
| Filtro web `q=ana`, `sala=Sala Norte`, `limite=2` | Mostró dos resultados y permitió avanzar a la segunda página conservando los filtros |
| Consulta API `q=ana`, `sala=Sala Norte`, `pagina=1`, `limite=2` | Respondió con `total: 3` y `paginas: 2` |
| Paginación API con `pagina=1` y `limite=2` | Respondió con datos y metadatos de paginación |
| `pagina=0` en la web y la API | Se rechazó con estado 400 |
| `npm run check` | Formato y ESLint sin errores |

## 8. Cambios realizados en este trabajo

Se agregó búsqueda por fragmento del nombre del estudiante, sin distinguir mayúsculas y tratando los caracteres especiales como texto literal. También se agregó filtro exacto por sala y ordenamiento por estudiante o cantidad de personas.

La web y la ruta `GET /api/reservas/consulta` comparten la validación y la búsqueda. Ambas admiten paginación; la web incluye enlaces para avanzar y retroceder conservando los filtros, y la API devuelve los resultados junto con los metadatos de paginación. Se mantienen las funciones de gestión de reservas del TP 12.

## 9. Protección de datos

El archivo `.env` contiene la dirección privada de la base y no debe publicarse. `.env.example` sirve como plantilla y no debe incluir contraseñas ni datos privados. Las reservas usadas para las pruebas son ficticias.

## 10. Direcciones para probar

Con el servidor iniciado en `http://localhost:3000`:

| Uso | Dirección o método |
|---|---|
| Listado web y búsqueda | `GET /reservas?q=ana&sala=Sala%20Norte&orden=estudiante&pagina=1&limite=2` |
| Consulta paginada desde la API | `GET /api/reservas/consulta?q=ana&sala=Sala%20Norte&orden=estudiante&pagina=1&limite=2` |
| Ver las reservas desde la API | `GET /api/reservas` |
| Ver el detalle de una reserva | `GET /reservas/:id` |
| Consultar una reserva desde la API | `GET /api/reservas/:id` |
| Abrir el formulario de edición | `GET /reservas/:id/editar` |
| Guardar la edición | `POST /reservas/:id/editar` |
| Abrir el formulario para cambiar el estado | `GET /reservas/:id/estado` |
| Guardar el cambio de estado | `POST /reservas/:id/estado` |
| Abrir la confirmación de eliminación | `GET /reservas/:id/eliminar` |
| Confirmar la eliminación | `POST /reservas/:id/eliminar`, con `confirmar=si` |
| Reemplazar una reserva completa desde la API | `PUT /api/reservas/:id` |
| Actualizar campos permitidos desde la API | `PATCH /api/reservas/:id` |
| Eliminar una reserva desde la API | `DELETE /api/reservas/:id` |

En las consultas, `q` busca por nombre; `sala` filtra por coincidencia exacta; `orden` acepta `estudiante`, `personas-asc` o `personas-desc`; y `pagina` y `limite` controlan la paginación.
