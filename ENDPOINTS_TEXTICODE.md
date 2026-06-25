# 📡 Endpoints — Texticode API

> **Base URL local:** `http://localhost:3001`  
> **Auth APIs internas:** Header `x-api-key: texticode-2026`  
> **Auth Google Calendar:** Header `Authorization: Bearer <JWT>`  
> **Content-Type:** `application/json`

---

## 🚀 Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd texticode-vue
```

### 2. Instalar dependencias

**Backend:**
```bash
cd texticode-api
npm install
```

**Frontend:**
```bash
cd ../texticode-vue
npm install
```

### 3. Variables de entorno

Crear `texticode-api/.env`:
```env
PORT=3001
DATABASE_URL=postgresql://...
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3001/api/google/callback
GOOGLE_CALENDAR_TIMEZONE=America/Bogota
API_KEY_EFICIENCIA=texticode-2026
GOOGLE_ALLOW_DIFFERENT_EMAILS=true
FRONTEND_URL=https://localhost:5173
```

Crear `texticode-vue/.env`:
```env
VITE_API_URL=http://localhost:3001/api
VITE_API_KEY=texticode-2026
```

### 4. Certificados SSL (solo para el frontend)

Desde **Git Bash**, dentro de la carpeta `texticode-vue/`:
```bash
mkdir certs
MSYS_NO_PATHCONV=1 openssl req -x509 -newkey rsa:2048 -keyout certs/localhost.key -out certs/localhost.crt -days 365 -nodes -subj "/CN=localhost"
```

### 5. Correr el proyecto

```bash
# Terminal 1 — Backend
cd texticode-api
npm run dev

# Terminal 2 — Frontend
cd texticode-vue
npm run dev
```

---

## 🗄️ Base de datos

El backend se conecta a **Supabase PostgreSQL** mediante la variable `DATABASE_URL`. No requiere configuración adicional fuera del `.env`.

---

## 🌐 APIs Externas

---

### 🔵 Google Calendar OAuth

> Ruta base: `/api/google`  
> Autenticación: JWT en header `Authorization: Bearer <token>` (excepto `/auth-url` y `/callback`)

---

#### `GET /api/google/auth-url`

Genera la URL de autorización de Google OAuth2.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `action` | `string` | `login` o `link` (default: `link`) |

**Headers (solo si action = link):**
```
Authorization: Bearer <JWT>
```

**Respuesta exitosa:**
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "scopes": ["openid", "email", "profile", "https://www.googleapis.com/auth/calendar"]
}
```

---

#### `GET /api/google/callback`

Callback de Google OAuth2. Google redirige aquí con el código de autorización.

**Query params (los envía Google automáticamente):**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `code` | `string` | Código de autorización |
| `state` | `string` | JWT firmado con la acción |
| `error` | `string` | Presente si el usuario rechazó |

**Redirige al frontend** en `/google-auth/callback` con `status=login` o `status=linked`.

---

#### `GET /api/google/status`

Consulta si el usuario autenticado tiene Google Calendar vinculado.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Respuesta exitosa:**
```json
{
  "connected": true,
  "profile": {
    "email": "usuario@gmail.com",
    "calendarId": "primary",
    "syncEnabled": true,
    "lastLoginGoogle": "2026-06-01T10:00:00Z",
    "lastSyncAt": "2026-06-10T08:00:00Z",
    "updatedAt": "2026-06-10T08:00:00Z",
    "scopes": ["openid", "email", "profile"]
  }
}
```

---

#### `DELETE /api/google/unlink`

Desvincula la cuenta de Google del usuario autenticado.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Respuesta exitosa:**
```json
{
  "mensaje": "Cuenta de Google desvinculada correctamente."
}
```

---

#### `PATCH /api/google/settings`

Actualiza preferencias de sincronización con Google Calendar.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Body:**
```json
{
  "syncEnabled": true,
  "calendarId": "primary"
}
```

**Respuesta exitosa:**
```json
{
  "mensaje": "Preferencias de Google Calendar actualizadas."
}
```

---

#### `POST /api/google/sync/delivery-events`

Sincroniza las órdenes de producción del usuario como eventos en Google Calendar.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Body:** ninguno

**Respuesta exitosa:**
```json
{
  "mensaje": "Entregas sincronizadas con Google Calendar.",
  "total": 3,
  "results": [
    {
      "id": "abc123",
      "htmlLink": "https://calendar.google.com/...",
      "status": "created",
      "orderId": 42
    }
  ]
}
```

---

#### `GET /api/google/events/upcoming`

Consulta los próximos eventos de Texticode en el calendario del usuario.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `limit` | `number` | Máximo de eventos (default: 10) |

**Respuesta exitosa:**
```json
{
  "events": [
    {
      "id": "abc123",
      "summary": "Texticode: entrega orden #42 — Camisa",
      "start": { "date": "2026-06-20" },
      "end": { "date": "2026-06-21" },
      "htmlLink": "https://calendar.google.com/..."
    }
  ]
}
```

---

#### `GET /api/google/connected-users`

Lista todos los usuarios con Google Calendar conectado. Solo administradores.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Respuesta exitosa:**
```json
{
  "users": [
    {
      "Id_Usuario": 1,
      "Nombre_Completo": "Admin Texticode",
      "Correo": "admin@texticode.com",
      "Rol": "administrador",
      "Google_Email": "admin@gmail.com",
      "Sync_Enabled": true,
      "Last_Sync_At": "2026-06-10T08:00:00Z"
    }
  ]
}
```

---

### 📧 SendGrid — Notificaciones por Email

> Ruta base: `/api/notificaciones`

---

#### `POST /api/notificaciones/estado`

Notifica al cliente por email cuando cambia el estado de su orden.

**Body:**
```json
{
  "ordenId": 42,
  "clienteEmail": "cliente@correo.com",
  "clienteNombre": "Juan Pérez",
  "estado": "En Proceso",
  "productos": [
    { "nombre": "Camisa", "cantidad": 5 }
  ],
  "observaciones": "Tela azul marino"
}
```

**Respuesta exitosa:**
```json
{
  "success": true
}
```

---

#### `POST /api/notificaciones/comprobante`

Envía el comprobante de entrega en PDF al cliente cuando la orden se marca como entregada.

**Body:**
```json
{
  "ordenId": 42,
  "clienteEmail": "cliente@correo.com",
  "clienteNombre": "Juan Pérez",
  "productos": [
    { "nombre": "Camisa", "cantidad": 5 }
  ],
  "pdfBase64": "<string base64 del PDF>",
  "fechaEntrega": "2026-06-15"
}
```

**Respuesta exitosa:**
```json
{
  "success": true
}
```

---

#### `POST /api/notificaciones/tarea`

Notifica a un operario cuando se le asigna una nueva tarea.

**Body:**
```json
{
  "operarioEmail": "operario@texticode.com",
  "operarioNombre": "Carlos López",
  "tarea": "Confección de camisas talla M",
  "ordenId": 42,
  "prioridad": "Alta",
  "fechaLimite": "2026-06-20"
}
```

**Respuesta exitosa:**
```json
{
  "success": true
}
```

---

#### `GET /api/notificaciones/estadisticas`

Consulta estadísticas de emails enviados por SendGrid.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `fecha` | `string` | Opcional. Formato `YYYY-MM-DD` |

**Ejemplo:**
```
GET /api/notificaciones/estadisticas?fecha=2026-06-15
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "estadisticas": {}
}
```

---

## 🏭 APIs Internas

> Autenticación: Header `x-api-key: texticode-2026`

---

### ⚖️ Carga de Trabajo

> Ruta base: `/api/carga-trabajo`

---

#### `GET /api/carga-trabajo`

Lista todos los operarios activos con su carga de trabajo actual.

**Query params:**

| Parámetro | Tipo | Valores válidos |
|-----------|------|-----------------|
| `estado` | `string` | `sobrecargado`, `normal`, `disponible` |

**Headers:**
```
x-api-key: texticode-2026
```

**Ejemplo:**
```
GET /api/carga-trabajo?estado=sobrecargado
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "filtro_aplicado": "sobrecargado",
  "resumen": {
    "total_operarios": 5,
    "sobrecargados": 2,
    "normales": 2,
    "disponibles": 1
  },
  "data": [
    {
      "Id_Usuario": 3,
      "Nombre_Completo": "Carlos López",
      "ordenes_activas": 7,
      "ordenes_vencidas": 1,
      "ordenes_alta_prioridad": 2,
      "estado_carga": "sobrecargado"
    }
  ]
}
```

---

#### `GET /api/carga-trabajo/sugerencias`

Genera sugerencias de reasignación de órdenes para aliviar operarios sobrecargados.

**Headers:**
```
x-api-key: texticode-2026
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "total_sugerencias": 2,
  "sugerencias": [
    {
      "operario_sobrecargado": { "id": 3, "nombre": "Carlos López", "ordenes_activas": 7 },
      "exceso_ordenes": 2,
      "movimientos": [
        {
          "Id_Orden": 15,
          "Producto": "Camisa",
          "Prioridad": "Media",
          "vencida": false,
          "Fecha_Limite": "2026-06-25",
          "desde_operario": { "id": 3, "nombre": "Carlos López" },
          "hacia_operario": { "id": 5, "nombre": "Ana Torres" }
        }
      ]
    }
  ]
}
```

---

#### `GET /api/carga-trabajo/operarios/:id`

Detalle de carga de trabajo de un operario específico con sus órdenes activas.

**Headers:**
```
x-api-key: texticode-2026
```

**Ejemplo:**
```
GET /api/carga-trabajo/operarios/3
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "data": {
    "Id_Usuario": 3,
    "Nombre_Completo": "Carlos López",
    "ordenes_activas": 7,
    "ordenes_vencidas": 1,
    "ordenes_alta_prioridad": 2,
    "estado_carga": "sobrecargado",
    "ordenes_activas_detalle": [
      {
        "Id_Orden": 15,
        "Producto": "Camisa",
        "Estado": "En Proceso",
        "Prioridad": "Alta",
        "Fecha_Limite": "2026-06-20",
        "vencida": false
      }
    ]
  }
}
```

---

#### `POST /api/carga-trabajo/reasignar`

Reasigna una orden activa a otro operario.

**Headers:**
```
x-api-key: texticode-2026
```

**Body:**
```json
{
  "Id_Orden": 15,
  "Id_Operario_Destino": 5
}
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "mensaje": "Orden #15 reasignada correctamente a Ana Torres",
  "data": {
    "Id_Orden": 15,
    "Producto": "Camisa",
    "operario_anterior": 3,
    "operario_nuevo": { "id": 5, "nombre": "Ana Torres" }
  }
}
```

---

#### `POST /api/carga-trabajo/reasignar-multiple`

Reasigna múltiples órdenes en una sola petición.

**Headers:**
```
x-api-key: texticode-2026
```

**Body:**
```json
{
  "movimientos": [
    { "Id_Orden": 15, "Id_Operario_Destino": 5 },
    { "Id_Orden": 16, "Id_Operario_Destino": 6 }
  ]
}
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "total_procesados": 2,
  "total_errores": 0,
  "resultados": [
    { "Id_Orden": 15, "Producto": "Camisa", "Id_Operario_Destino": 5, "ok": true }
  ],
  "errores": []
}
```

---

#### `POST /api/carga-trabajo/aplicar-sugerencias`

Aplica automáticamente todas las sugerencias de reasignación generadas por el sistema.

**Headers:**
```
x-api-key: texticode-2026
```

**Body:** ninguno

**Respuesta exitosa:**
```json
{
  "ok": true,
  "mensaje": "Se aplicaron 2 reasignaciones",
  "aplicados": 2,
  "movimientos": [
    {
      "Id_Orden": 15,
      "Producto": "Camisa",
      "desde_operario": "Carlos López",
      "hacia_operario": "Ana Torres"
    }
  ]
}
```

---

#### `PATCH /api/carga-trabajo/umbrales`

Actualiza los umbrales que definen cuándo un operario está sobrecargado o disponible.

**Headers:**
```
x-api-key: texticode-2026
```

**Body:**
```json
{
  "limite_sobrecarga": 5,
  "limite_disponible": 2
}
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "mensaje": "Umbrales actualizados",
  "umbrales": {
    "limite_sobrecarga": 5,
    "limite_disponible": 2
  }
}
```

---

#### `PATCH /api/carga-trabajo/ordenes/:id/operario`

Reasigna una orden específica a otro operario.

**Headers:**
```
x-api-key: texticode-2026
```

**Body:**
```json
{
  "Id_Operario_Destino": 5
}
```

**Ejemplo:**
```
PATCH /api/carga-trabajo/ordenes/15/operario
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "mensaje": "Orden #15 reasignada a Ana Torres",
  "data": {
    "Id_Orden": 15,
    "Producto": "Camisa",
    "operario_anterior": 3,
    "operario_nuevo": { "id": 5, "nombre": "Ana Torres" }
  }
}
```

---

#### `PATCH /api/carga-trabajo/operarios/:id/estado`

Activa o desactiva un operario.

**Headers:**
```
x-api-key: texticode-2026
```

**Body:**
```json
{
  "Estado": "activo"
}
```

**Valores válidos para `Estado`:** `activo`, `inactivo`

**Ejemplo:**
```
PATCH /api/carga-trabajo/operarios/3/estado
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "mensaje": "Operario Carlos López actualizado a estado \"activo\"",
  "data": {
    "Id_Usuario": 3,
    "Nombre_Completo": "Carlos López",
    "Estado": "activo"
  }
}
```

---

### 📊 Eficiencia de Operarios

> Ruta base: `/api/eficiencia`

---

#### `GET /api/eficiencia/operarios`

Lista todos los operarios activos con sus métricas de eficiencia.

**Headers:**
```
x-api-key: texticode-2026
```

**Query params:**

| Parámetro | Tipo | Valores válidos |
|-----------|------|-----------------|
| `rendimiento` | `string` | `Alto`, `Medio`, `Bajo` |
| `estado` | `string` | `Completada`, `En Proceso`, `Pausado` |
| `limite` | `number` | Número positivo |

**Ejemplo:**
```
GET /api/eficiencia/operarios?rendimiento=Alto&limite=5
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "total": 2,
  "filtros_aplicados": {
    "rendimiento": "Alto",
    "estado": null,
    "limite": "5"
  },
  "data": [
    {
      "Id_Usuario": 3,
      "Nombre_Completo": "Carlos López",
      "prendas_por_dia": 12,
      "total_unidades_producidas": 240,
      "ordenes_en_retraso": 0,
      "ordenes_completadas": 8,
      "ordenes_en_proceso": 3,
      "ordenes_pausadas": 0,
      "ordenes_con_problema": 0,
      "rendimiento": "Alto"
    }
  ]
}
```

---

#### `GET /api/eficiencia/operarios/:id`

Detalle completo de eficiencia de un operario con historial de órdenes y observaciones.

**Headers:**
```
x-api-key: texticode-2026
```

**Ejemplo:**
```
GET /api/eficiencia/operarios/3
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "data": {
    "Id_Usuario": 3,
    "Nombre_Completo": "Carlos López",
    "prendas_por_dia": 12,
    "total_unidades_producidas": 240,
    "ordenes_en_retraso": 0,
    "ordenes_completadas": 8,
    "rendimiento": "Alto",
    "ordenes_detalle": [
      {
        "Id_Orden": 15,
        "Producto": "Camisa",
        "Estado": "En Proceso",
        "Prioridad": "Alta",
        "Dificultad": "Media",
        "Unidades_Realizadas": 20,
        "Unidades": 50,
        "vencida": false,
        "tiene_problema": false,
        "observaciones": []
      }
    ]
  }
}
```

---

#### `GET /api/eficiencia/operarios/:id/historial`

Compara el rendimiento del operario entre el período actual y el anterior.

**Headers:**
```
x-api-key: texticode-2026
```

**Query params:**

| Parámetro | Tipo | Valores válidos | Default |
|-----------|------|-----------------|---------|
| `periodo` | `string` | `semana`, `mes`, `trimestre` | `semana` |

**Ejemplo:**
```
GET /api/eficiencia/operarios/3/historial?periodo=mes
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "data": {
    "operario": { "Id_Usuario": 3, "Nombre_Completo": "Carlos López" },
    "periodo": "mes",
    "dias": 30,
    "actual": {
      "prendas_por_dia": 12,
      "total_unidades": 120,
      "completadas": 5,
      "en_curso": 3,
      "retrasos": 0,
      "rendimiento": "Alto"
    },
    "anterior": {
      "prendas_por_dia": 9,
      "total_unidades": 90,
      "completadas": 4,
      "retrasos": 1,
      "rendimiento": "Medio"
    },
    "tendencia": "subiendo",
    "diferencia_prendas": 3.0
  }
}
```

---

#### `GET /api/eficiencia/observaciones/:id`

Consulta las observaciones registradas sobre un operario, con filtro opcional por orden.

**Headers:**
```
x-api-key: texticode-2026
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `Id_Orden` | `number` | Opcional. Filtra por orden específica |

**Ejemplo:**
```
GET /api/eficiencia/observaciones/3?Id_Orden=15
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "total": 1,
  "data": [
    {
      "Id_Observacion": 7,
      "Id_Orden": 15,
      "Observacion": "Retraso por falta de material",
      "Fecha": "2026-06-10T09:00:00Z",
      "Admin": "Admin Texticode"
    }
  ]
}
```

---

#### `POST /api/eficiencia/observaciones`

Registra una observación sobre el desempeño de un operario en una orden.

**Headers:**
```
x-api-key: texticode-2026
```

**Body:**
```json
{
  "Id_Operario": 3,
  "Id_Admin": 1,
  "Id_Orden": 15,
  "Observacion": "Retraso por falta de material en bodega"
}
```

> ⚠️ `Observacion` máximo 500 caracteres.

**Respuesta exitosa:**
```json
{
  "ok": true,
  "mensaje": "Observación registrada correctamente",
  "data": {
    "Id_Observacion": 7,
    "Id_Operario": 3,
    "Id_Orden": 15,
    "Id_Admin": 1,
    "Observacion": "Retraso por falta de material en bodega"
  }
}
```

---

#### `DELETE /api/eficiencia/observaciones/:id`

Elimina una observación por su ID.

**Headers:**
```
x-api-key: texticode-2026
```

**Ejemplo:**
```
DELETE /api/eficiencia/observaciones/7
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "mensaje": "Observación eliminada correctamente"
}
```

---

*Documentación generada para el proyecto Texticode — Backend Node/Express + Supabase PostgreSQL*