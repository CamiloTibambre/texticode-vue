-- ══════════════════════════════════════════════════════════════════
--  TEXTICODE — Datos de prueba para módulo de Eficiencia
--  Propósito : poblar orden_produccion con órdenes en distintos
--              períodos para evidenciar tendencias reales.
--  IMPORTANTE: NO modifica usuarios ni estructura de tablas.
--              Solo hace INSERT en orden_produccion y orden_material.
--
--  Lógica de prendas/día ponderadas:
--    Alta × 3 | Media × 2 | Baja × 1
--    Para llegar a "Alto" (>= 10 prendas/día):
--    Ejemplo: 1 orden Alta, 30 unidades, 7 días → (30×3)/7 = 12.8 ✅
-- ══════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────
--  OPERARIOS
--  27 → David Hernández  (Davincho)
--  28 → Erika Parada     (Erika22)
--  30 → Sandra Rincón    (Sandrita)
--  31 → Julian Hurtado   (Juli)
--  32 → Elsa Cárdenas    (Elsita)
--  36 → sengrid
-- ──────────────────────────────────────────────────────────────────


-- ══════════════════════════════════════════════════════════════════
--  TRIMESTRE ANTERIOR  (hace 60-90 días → 2026-01-15 a 2026-02-14)
-- ══════════════════════════════════════════════════════════════════

-- David → ALTO  (30 unid Alta × 3 = 90 pts ÷ 7 días = 12.8/día) ✅
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(33, 9,  'Camisas Básicas T1',      30, 'Alta',  '2026-01-22', 'Camisas algodón talla M',        'Completada',  30, 27,  30, '2026-01-15 08:00:00'),
(33, 13, 'Pantalones Drill T1',     30, 'Alta',  '2026-01-29', 'Pantalón drill kaki talla M/L',  'Completada',  30, 27,  30, '2026-01-22 08:00:00'),
(34, 15, 'Shorts Premium T1',       30, 'Alta',  '2026-02-05', 'Shorts deportivos colores',      'Completada',  30, 27,  30, '2026-01-29 08:00:00'),
(33, 12, 'Chaquetas T1',            30, 'Alta',  '2026-02-12', 'Chaqueta rompevientos negra',    'Completada',  30, 27,  30, '2026-02-05 08:00:00');

-- Julian → ALTO
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(33, 12, 'Chaquetas Fusionadas T1', 30, 'Alta',  '2026-01-23', 'Chaquetas para clima frío',      'Completada',  30, 31,  30, '2026-01-16 08:00:00'),
(34, 15, 'Uniformes Empresa T1',    30, 'Alta',  '2026-01-30', 'Uniforme azul corporativo',      'Completada',  30, 31,  30, '2026-01-23 08:00:00'),
(33, 13, 'Joggers Premium T1',      30, 'Alta',  '2026-02-06', 'Jogger slim fit negro',          'Completada',  30, 31,  30, '2026-01-30 08:00:00'),
(34, 15, 'Shorts Deportivos T1',    30, 'Alta',  '2026-02-13', 'Shorts talla única',             'Completada',  30, 31,  30, '2026-02-06 08:00:00');

-- Erika → MEDIO  (~5 prendas/día)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(34, 16, 'Uniformes Escolares T1',  12, 'Media', '2026-01-25', 'Uniformes talla 10-14',          'Completada',  12, 28,  12, '2026-01-18 08:00:00'),
(34, 17, 'Camisetas Lisas T1',      12, 'Media', '2026-02-01', 'Camisetas negras sin estampado', 'Completada',  12, 28,  12, '2026-01-25 08:00:00'),
(33, 9,  'Blusas Casuales T1',      12, 'Media', '2026-02-08', 'Blusas de algodón S/M',          'Completada',  12, 28,  12, '2026-02-01 08:00:00');

-- Sandra → BAJO  (pocas unidades, dificultad baja)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(35, 18, 'Ropa Interior T1',         5, 'Baja',  '2026-01-28', 'Conjunto interior talla S/M',    'Completada',   5, 30,   5, '2026-01-21 08:00:00'),
(35, 20, 'Medias Deportivas T1',     5, 'Baja',  '2026-02-05', 'Medias largas blancas',          'Completada',   5, 30,   5, '2026-01-29 08:00:00');

-- Elsa → MEDIO
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(35, 18, 'Pijamas Niño T1',         10, 'Media', '2026-01-26', 'Pijamas estampados talla 4-8',   'Completada',  10, 32,  10, '2026-01-19 08:00:00'),
(33, 9,  'Camisas Lino T1',         10, 'Media', '2026-02-03', 'Camisas manga larga blancas',    'Completada',  10, 32,  10, '2026-01-27 08:00:00'),
(34, 16, 'Gorras Tela T1',          10, 'Media', '2026-02-10', 'Gorras ajustables negras',       'Completada',  10, 32,  10, '2026-02-03 08:00:00');


-- ══════════════════════════════════════════════════════════════════
--  MES ANTERIOR  (hace 30-60 días → 2026-03-17 a 2026-04-16)
-- ══════════════════════════════════════════════════════════════════

-- David → ALTO
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(33, 9,  'Camisas Oxford M1',       30, 'Alta',  '2026-03-24', 'Camisa formal manga larga',      'Completada',  30, 27,  30, '2026-03-17 08:00:00'),
(33, 13, 'Pantalones Ejecutivos M1',30, 'Alta',  '2026-03-31', 'Pantalón de paño gris',          'Completada',  30, 27,  30, '2026-03-24 08:00:00'),
(34, 15, 'Shorts Running M1',       30, 'Alta',  '2026-04-07', 'Shorts con bolsillo trasero',    'Completada',  30, 27,  30, '2026-03-31 08:00:00'),
(33, 12, 'Overoles M1',             30, 'Alta',  '2026-04-14', 'Overoles grises talla L/XL',     'Completada',  30, 27,  30, '2026-04-07 08:00:00');

-- Sandra → ALTO  (su mejor mes, sube fuerte desde BAJO)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(35, 18, 'Leggings Deportivos M1',  30, 'Alta',  '2026-03-24', 'Leggings negros S/M/L/XL',       'Completada',  30, 30,  30, '2026-03-17 08:00:00'),
(35, 20, 'Tops Deportivos M1',      30, 'Alta',  '2026-03-31', 'Top sin mangas varios colores',   'Completada',  30, 30,  30, '2026-03-24 08:00:00'),
(33, 9,  'Sets Gym M1',             30, 'Alta',  '2026-04-07', 'Set top + legging varios colores','Completada',  30, 30,  30, '2026-03-31 08:00:00');

-- Julian → MEDIO  (baja respecto al trimestre)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(34, 15, 'Uniformes Deporte M1',    12, 'Media', '2026-03-25', 'Uniforme completo talla M',      'Completada',  12, 31,  12, '2026-03-18 08:00:00'),
(33, 12, 'Chaquetas Lluvia M1',     12, 'Media', '2026-04-02', 'Chaqueta impermeable negra',     'Completada',  12, 31,  12, '2026-03-26 08:00:00'),
(34, 15, 'Vestidos Casuales M1',    12, 'Media', '2026-04-09', 'Vestido talla S/M/L colores',    'Completada',  12, 31,  12, '2026-04-02 08:00:00');

-- Erika → BAJO
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(34, 16, 'Pantalonetas Niño M1',     4, 'Baja',  '2026-03-26', 'Pantaloneta talla 6-10',         'Completada',   4, 28,   4, '2026-03-19 08:00:00'),
(33, 9,  'Blusas Verano M1',         4, 'Baja',  '2026-04-03', 'Blusa manga sisa colores',        'Completada',   4, 28,   4, '2026-03-27 08:00:00');

-- Elsa → ALTO  (su mejor mes)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(35, 18, 'Vestidos Niña M1',        30, 'Alta',  '2026-03-25', 'Vestido talla 4-6-8 colores',    'Completada',  30, 32,  30, '2026-03-18 08:00:00'),
(33, 9,  'Blusas Estampadas M1',    30, 'Alta',  '2026-04-02', 'Blusa estampado floral S/M/L',   'Completada',  30, 32,  30, '2026-03-26 08:00:00'),
(34, 16, 'Conjuntos Bebé M1',       30, 'Alta',  '2026-04-10', 'Conjunto body + pantalón',       'Completada',  30, 32,  30, '2026-04-03 08:00:00');

-- sengrid → BAJO  (recién empieza)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(33, 11, 'Camisetas Básicas M1',     4, 'Baja',  '2026-04-01', 'Camiseta cuello redondo negra',  'Completada',   4, 36,   4, '2026-03-25 08:00:00');


-- ══════════════════════════════════════════════════════════════════
--  SEMANA PASADA  (hace 7-14 días → 2026-05-02 a 2026-05-09)
-- ══════════════════════════════════════════════════════════════════

-- David → ALTO
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(33, 9,  'Camisas Semana Pasada',   30, 'Alta',  '2026-05-09', 'Camisa verano talla S/M/L',      'Completada',  30, 27,  30, '2026-05-02 08:00:00'),
(34, 15, 'Shorts SP',               30, 'Alta',  '2026-05-09', 'Shorts premium colores',         'Completada',  30, 27,  30, '2026-05-05 08:00:00');

-- Sandra → ALTO
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(35, 18, 'Sets Deportivos SP',      30, 'Alta',  '2026-05-09', 'Set top + legging varios',       'Completada',  30, 30,  30, '2026-05-02 08:00:00'),
(35, 20, 'Shorts Mujer SP',         30, 'Alta',  '2026-05-09', 'Short tiro alto S/M/L',          'Completada',  30, 30,  30, '2026-05-05 08:00:00');

-- Julian → MEDIO
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(33, 12, 'Chaquetas SP',            10, 'Media', '2026-05-09', 'Chaqueta rompevientos S/M',      'Completada',  10, 31,  10, '2026-05-03 08:00:00'),
(34, 15, 'Shorts Niño SP',          10, 'Media', '2026-05-09', 'Short talla 4-6-8-10',           'Completada',  10, 31,  10, '2026-05-06 08:00:00');

-- Erika → BAJO
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(34, 16, 'Uniformes SP',             3, 'Baja',  '2026-05-09', 'Uniforme dama talla M/L',        'Completada',   3, 28,   3, '2026-05-03 08:00:00');

-- Elsa → ALTO  (semana pasada excelente)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(33, 9,  'Blusas SP',               30, 'Alta',  '2026-05-09', 'Blusa manga sisa colores',       'Completada',  30, 32,  30, '2026-05-02 08:00:00'),
(34, 16, 'Camisas Trabajo SP',      30, 'Alta',  '2026-05-09', 'Camisa work talla M/L/XL',       'Completada',  30, 32,  30, '2026-05-05 08:00:00');

-- sengrid → MEDIO
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(33, 11, 'Polos SP',                10, 'Media', '2026-05-09', 'Polo manga corta negro/blanco',  'Completada',  10, 36,  10, '2026-05-03 08:00:00');


-- ══════════════════════════════════════════════════════════════════
--  ESTA SEMANA  (últimos 7 días → 2026-05-10 a 2026-05-16)
-- ══════════════════════════════════════════════════════════════════

-- David → ALTO  (estable → tendencia ESTABLE)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(33, 9,  'Camisas Temporada',       30, 'Alta',  '2026-05-20', 'Camisa verano talla S/M/L',      'Completada',  30, 27,  30, '2026-05-10 08:00:00'),
(34, 15, 'Pantalonetas Premium',    30, 'Alta',  '2026-05-22', 'Pantaloneta premium colores',    'Completada',  30, 27,  30, '2026-05-13 08:00:00');

-- Sandra → ALTO y más (sube → tendencia SUBIENDO)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(35, 18, 'Sets Deportivos',         35, 'Alta',  '2026-05-21', 'Set top + legging varios colores','Completada', 35, 30,  35, '2026-05-10 08:00:00'),
(35, 20, 'Shorts Mujer',            35, 'Alta',  '2026-05-23', 'Short tiro alto S/M/L',          'Completada',  35, 30,  35, '2026-05-13 08:00:00');

-- Julian → MEDIO  (estable)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(33, 12, 'Chaquetas Ligeras',       10, 'Media', '2026-05-20', 'Chaqueta rompevientos S/M',      'Completada',  10, 31,  10, '2026-05-11 08:00:00'),
(34, 15, 'Shorts Niño',             10, 'Media', '2026-05-24', 'Short talla 4-6-8-10',           'En Proceso',   6, 31,  10, '2026-05-14 08:00:00');

-- Erika → BAJO  (sigue cayendo → tendencia BAJANDO)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(34, 16, 'Uniformes Empresa',        2, 'Baja',  '2026-05-18', 'Uniforme dama talla M/L',        'En Proceso',   1, 28,   2, '2026-05-10 08:00:00');

-- Elsa → MEDIO  (baja vs semana pasada que fue ALTO → tendencia BAJANDO)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(33, 9,  'Blusas Verano',           10, 'Media', '2026-05-19', 'Blusa manga sisa colores',       'En Proceso',   6, 32,  10, '2026-05-11 08:00:00');

-- sengrid → ALTO  (da el salto → tendencia SUBIENDO)
INSERT INTO `orden_produccion` (`Id_Cliente`,`Id_Material`,`Producto`,`Cantidad`,`Prioridad`,`Fecha_Limite`,`Descripcion`,`Estado`,`Unidades_Realizadas`,`Id_Operario`,`Unidades`,`Fecha_Creacion`) VALUES
(33, 11, 'Camisetas Polo',          30, 'Alta',  '2026-05-21', 'Polo manga corta negro/blanco',  'Completada',  30, 36,  30, '2026-05-12 08:00:00'),
(34, 16, 'Camisas Trabajo',         30, 'Alta',  '2026-05-22', 'Camisa work talla M/L/XL',       'En Proceso',  15, 36,  30, '2026-05-14 08:00:00');


-- ══════════════════════════════════════════════════════════════════
--  RESUMEN ESPERADO EN EL FRONTEND
-- ══════════════════════════════════════════════════════════════════
--
--  Operario     │ Esta semana      │ Semana pasada │ Trimestre
--  ─────────────┼──────────────────┼───────────────┼──────────────
--  David   (27) │ ALTO  / Estable  │ ALTO          │ ALTO
--  Sandra  (30) │ ALTO  / Subiendo │ ALTO          │ BAJO → ALTO
--  Julian  (31) │ MEDIO / Estable  │ MEDIO         │ ALTO → MEDIO
--  Elsa    (32) │ MEDIO / Bajando  │ ALTO          │ MEDIO
--  sengrid (36) │ ALTO  / Subiendo │ MEDIO         │ —
--  Erika   (28) │ BAJO  / Bajando  │ BAJO          │ MEDIO → BAJO
--
-- ══════════════════════════════════════════════════════════════════
