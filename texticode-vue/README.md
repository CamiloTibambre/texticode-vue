# 🧵 Texticode — Sistema de Inventario en Vue.js

## ✅ Estructura del proyecto

```
texticode-vue/
├── src/
│   ├── views/
│   │   ├── LoginView.vue               ← Login con 3 roles
│   │   ├── admin/
│   │   │   ├── GestionUsuarios.vue     ← CRUD usuarios
│   │   │   ├── GestionClientes.vue     ← Clientes + comprobantes
│   │   │   ├── GestionInventario.vue   ← CRUD inventario
│   │   │   ├── Reportes.vue            ← Gráficos + reportes
│   │   │   └── GestionProduccion.vue   ← Órdenes de producción
│   │   ├── operario/
│   │   │   ├── CuentaPersonal.vue
│   │   │   ├── TareasAsignadas.vue
│   │   │   └── ReportarAvances.vue
│   │   └── cliente/
│   │       ├── CuentaPersonal.vue
│   │       ├── PedidosEntregas.vue
│   │       └── CentroSoporte.vue
│   ├── components/
│   │   └── AppSidebar.vue              ← Sidebar compartido (3 paneles)
│   ├── router/
│   │   └── index.js                    ← Rutas protegidas por rol
│   ├── stores/
│   │   └── auth.js                     ← Estado del usuario (Pinia)
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```

## 🚀 Cómo correr el proyecto

```bash
# 1. Entrar a la carpeta
cd texticode-vue

# 2. Instalar dependencias
npm install

# 3. Correr en desarrollo
npm run dev
```

Luego abre http://localhost:5173 en tu navegador.

## 🔐 Acceso de prueba (botones demo en el login)

| Rol      | Panel que ve                                        |
|----------|-----------------------------------------------------|
| Admin    | Usuarios, Clientes, Inventario, Reportes, Producción|
| Operario | Cuenta Personal, Tareas Asignadas, Reportar Avances |
| Cliente  | Cuenta Personal, Pedidos y Entregas, Centro Soporte  |

## 🗃️ Agregar imágenes del logo

Crea una carpeta `public/img/` y coloca:
- `LogoTexticode.png` — logo principal
- `LogoTexticodeMini.png` — favicon

## 🔌 Conectar con Supabase (próximo paso)

```bash
npm install @supabase/supabase-js
```

Crea `src/lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'TU_SUPABASE_URL',
  'TU_SUPABASE_ANON_KEY'
)
```

Luego en `src/stores/auth.js` reemplaza la función `login()` con:
```javascript
import { supabase } from '../lib/supabase'

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  usuario.value = data.user
}
```
