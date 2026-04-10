-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-04-2026 a las 07:56:02
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `texticode`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comprobantes`
--

CREATE TABLE `comprobantes` (
  `Id_Comprobante` int(11) NOT NULL COMMENT 'Identificador único del comprobante.',
  `Id_Usuario` int(11) NOT NULL COMMENT 'Persona que crea el comprobante',
  `Id_Orden` int(11) NOT NULL COMMENT 'Numero de orden',
  `Estado` enum('Entregado','Pendiente') NOT NULL DEFAULT 'Pendiente' COMMENT 'Estado del comprobante',
  `Fecha_Limite` date DEFAULT current_timestamp() COMMENT 'Fecha de generación del comprobante. No debe ser pasada.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que gestiona los comprobantes generados en el sistema.';

--
-- Volcado de datos para la tabla `comprobantes`
--

INSERT INTO `comprobantes` (`Id_Comprobante`, `Id_Usuario`, `Id_Orden`, `Estado`, `Fecha_Limite`) VALUES
(1, 26, 10, 'Pendiente', '2026-04-15'),
(2, 26, 11, 'Pendiente', '2026-04-23'),
(3, 26, 12, 'Pendiente', '2026-04-17'),
(4, 26, 13, 'Pendiente', '2026-04-13'),
(5, 26, 14, 'Pendiente', '2026-04-14'),
(6, 26, 15, 'Pendiente', '2026-04-30'),
(7, 26, 16, 'Pendiente', '2026-05-14'),
(8, 26, 17, 'Pendiente', '2026-04-22'),
(9, 26, 18, 'Pendiente', '2026-04-15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `material`
--

CREATE TABLE `material` (
  `Id_Material` int(11) NOT NULL COMMENT 'Identificador único del producto',
  `Nombre_Material` varchar(100) NOT NULL COMMENT 'Nombre del producto',
  `Categoria` varchar(80) NOT NULL COMMENT 'Categoría del producto',
  `Stock_Actual` int(11) NOT NULL DEFAULT 0 COMMENT 'Cantidad actual disponible en inventario',
  `Unidad` varchar(30) NOT NULL COMMENT 'Unidad de medida del producto (metros, unidades, etc.)',
  `Stock_Minimo` int(11) NOT NULL DEFAULT 0 COMMENT 'No puede ser menor a 0',
  `Stock_Maximo` int(11) NOT NULL DEFAULT 0 COMMENT 'Cantidad máxima permitida en inventario',
  `Fecha` datetime DEFAULT current_timestamp() COMMENT 'Fecha de generación del comprobante. Debe ser actual.' CHECK (`Stock_Minimo` >= 0),
  `Id_Cliente` int(11) DEFAULT NULL COMMENT 'Cliente asociado al material'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena los productos registrados en el sistema';

--
-- Volcado de datos para la tabla `material`
--

INSERT INTO `material` (`Id_Material`, `Nombre_Material`, `Categoria`, `Stock_Actual`, `Unidad`, `Stock_Minimo`, `Stock_Maximo`, `Fecha`, `Id_Cliente`) VALUES
(9, 'Tela de Algodon ', 'Telas', 50, 'Metros', 10, 200, '2026-04-10 00:23:44', 33),
(10, 'Botones', 'Accesorios', 100, 'Unidades', 10, 100, '2026-04-10 00:34:04', 33),
(11, 'Agujas ', 'Accesorios', 0, 'Unidades', 10, 1000, '2026-04-10 00:34:52', 33),
(12, 'Fusionado', 'Telas', 30, 'Metros', 5, 100, '2026-04-10 00:35:46', 33),
(13, 'Tela de Poliester', 'Telas', 100, 'Metros', 10, 100, '2026-04-10 00:36:21', 33),
(14, 'Hilos de todos los colores', 'Hilos', 1000, 'Rollos', 10, 10000, '2026-04-10 00:37:02', 33),
(15, 'Tela deportiva', 'Telas', 200, 'Metros', 7, 6000, '2026-04-10 00:38:15', 34),
(16, 'Caucho', 'Accesorios', 200, 'Metros', 0, 300, '2026-04-10 00:39:04', 34),
(17, 'Hilos Negros ', 'Hilos', 20, 'Unidades', 1, 25, '2026-04-10 00:39:37', 34),
(18, 'Tela piel de durazno', 'Telas', 100, 'Metros', 10, 150, '2026-04-10 00:40:07', 35),
(20, 'Pies de maquinas', 'Accesorios', 20, 'Unidades', 10, 50, '2026-04-10 00:41:30', 35);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_material`
--

CREATE TABLE `orden_material` (
  `Id_Orden` int(11) NOT NULL COMMENT 'Id de la Orden',
  `Id_Producto` int(11) NOT NULL COMMENT 'Id del producto',
  `Cantidad_Usada` int(11) NOT NULL COMMENT 'Cantidad usada en la orden'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla puente';

--
-- Volcado de datos para la tabla `orden_material`
--

INSERT INTO `orden_material` (`Id_Orden`, `Id_Producto`, `Cantidad_Usada`) VALUES
(10, 9, 1),
(10, 10, 1),
(11, 12, 1),
(11, 13, 1),
(11, 14, 1),
(12, 9, 1),
(12, 13, 1),
(12, 14, 1),
(13, 16, 1),
(13, 17, 1),
(14, 15, 1),
(14, 17, 1),
(15, 16, 1),
(15, 17, 1),
(16, 18, 1),
(16, 20, 1),
(17, 20, 1),
(18, 18, 1),
(18, 20, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_produccion`
--

CREATE TABLE `orden_produccion` (
  `Id_Orden` int(11) NOT NULL COMMENT 'Identificador único de la orden de producción',
  `Id_Cliente` int(11) NOT NULL COMMENT 'Cliente que solicita la orden',
  `Id_Material` int(11) NOT NULL COMMENT 'Producto a fabricar',
  `Producto` varchar(100) DEFAULT NULL COMMENT 'Producto de la orden',
  `Cantidad` int(11) NOT NULL COMMENT 'Cantidad a producir',
  `Prioridad` enum('Baja','Media','Alta') NOT NULL DEFAULT 'Media' COMMENT 'Nivel de prioridad',
  `Fecha_Limite` date NOT NULL COMMENT 'La fecha no puede ser anterior al dia vigente',
  `Descripcion` varchar(150) NOT NULL COMMENT 'Descripcion del producto',
  `Estado` enum('En Proceso','Completada','Pausado') NOT NULL DEFAULT 'En Proceso' COMMENT 'Estado de la orden',
  `Unidades_Realizadas` int(225) DEFAULT NULL COMMENT 'Unidades realizadas por el operario',
  `Id_Operario` int(11) DEFAULT NULL COMMENT 'Operario asignado a la orden',
  `Unidades` int(225) DEFAULT NULL COMMENT 'Unidades a realizar por el operario',
  `Fecha_Creacion` datetime DEFAULT current_timestamp() COMMENT 'Fecha en que se creó la orden'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena las órdenes de producción';

--
-- Volcado de datos para la tabla `orden_produccion`
--

INSERT INTO `orden_produccion` (`Id_Orden`, `Id_Cliente`, `Id_Material`, `Producto`, `Cantidad`, `Prioridad`, `Fecha_Limite`, `Descripcion`, `Estado`, `Unidades_Realizadas`, `Id_Operario`, `Unidades`, `Fecha_Creacion`) VALUES
(10, 33, 10, 'Camisas', 100, 'Media', '2026-04-15', 'Camisas para tierra fría ', 'En Proceso', 15, 27, 100, '2026-04-10 00:43:01'),
(11, 33, 13, 'Pijamas ', 50, 'Baja', '2026-04-23', 'Pijamas de alta calidad ', 'En Proceso', 40, 27, 50, '2026-04-10 00:43:55'),
(12, 33, 14, 'Pantalones', 2000, 'Media', '2026-04-17', 'Pantalones casuales', 'En Proceso', 125, 27, 2000, '2026-04-10 00:44:54'),
(13, 34, 16, 'Pantalonetas', 22, 'Alta', '2026-04-13', 'Pantalonetas del PSG', 'En Proceso', NULL, 28, NULL, '2026-04-10 00:45:47'),
(14, 34, 17, 'Uniformes', 50, 'Alta', '2026-04-14', 'Uniformes para niño', 'En Proceso', NULL, 28, NULL, '2026-04-10 00:46:29'),
(15, 34, 16, 'Pantalones ', 33, 'Baja', '2026-04-30', 'Pantalones tipo sudadera ', 'En Proceso', NULL, 28, NULL, '2026-04-10 00:47:25'),
(16, 35, 20, 'Camisas', 10, 'Baja', '2026-05-14', 'Camisas para mujer y niña', 'En Proceso', NULL, 30, NULL, '2026-04-10 00:49:04'),
(17, 35, 20, 'Medias', 40, 'Media', '2026-04-22', 'Medias termicas', 'En Proceso', NULL, 30, NULL, '2026-04-10 00:49:53'),
(18, 35, 18, 'Boxer', 500, 'Alta', '2026-04-15', 'Ropa interior para niño', 'En Proceso', NULL, 30, NULL, '2026-04-10 00:50:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `Id_Rol` int(11) NOT NULL COMMENT 'Identificador único del rol',
  `Nombre_Rol` varchar(50) NOT NULL COMMENT 'Nombre del rol asignado al usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`Id_Rol`, `Nombre_Rol`) VALUES
(1, 'administrador'),
(3, 'cliente'),
(2, 'operario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Id_Usuario` int(11) NOT NULL COMMENT 'Identificador único del usuario',
  `Id_Rol` int(11) NOT NULL COMMENT 'Rol asignado al usuario (clave foránea)',
  `Nombre_Completo` varchar(100) NOT NULL COMMENT 'Nombre completo del usuario',
  `Nombre_Usuario` varchar(50) NOT NULL COMMENT 'Nombre de usuario para iniciar sesión',
  `Correo` varchar(120) NOT NULL COMMENT 'Correo electrónico del usuario',
  `Telefono` varchar(20) DEFAULT NULL COMMENT 'Número de teléfono del usuario',
  `Estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo' COMMENT 'Usuarios dispobibles',
  `Contrasena` varchar(255) NOT NULL COMMENT 'Contraseña del usuario (almacenada encriptada)',
  `Fecha_Registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena los usuarios del sistema y su rol asociado';

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`Id_Usuario`, `Id_Rol`, `Nombre_Completo`, `Nombre_Usuario`, `Correo`, `Telefono`, `Estado`, `Contrasena`, `Fecha_Registro`) VALUES
(26, 1, 'Diana Gomez', 'Dianita', 'diana@gmail.com', '+57 311 4500925', 'activo', '$2b$10$KqtEIabyifIOJgVwkXmYSeHyw5FNVeNlVUXDfRmC5dmrSrzfDfsTK', '2026-04-09 22:44:57'),
(27, 2, 'David Hernadez', 'Davincho', 'david@gmail.com', '+57 3102856574', 'activo', '$2b$10$fHz6b1LOpVi9Bs0HGihWPePCvz8PlROHnr5fdIriHSqyZghtSrJCK', '2026-04-09 22:46:49'),
(28, 2, 'Erika Parada', 'Erika22', 'erika@gmail.com', '+57 3205442212', 'activo', '$2b$10$G7zgIIpWv/Rdfty1eQ4lh.7cW42kf44n.jrCd6Fe6uE8EGkrGHihm', '2026-04-09 22:48:36'),
(29, 1, 'Luis Quintero', 'Lucho', 'luis@gmail.com', '+573143268696', 'activo', '$2b$10$stzmgitvHK4UfAQQcFEJHOq8qszBC6exdJaX2P2ZbfxYexzkqs1rG', '2026-04-09 22:50:00'),
(30, 2, 'Sandra Rincon', 'Sandrita', 'sandra@gmail.com', '+57 3134567501', 'activo', '$2b$10$XLJpxEP1ees6luleoxF3S.NsuX5PWmhl4oxPmdM1y186AI/tkZWCy', '2026-04-09 22:57:34'),
(31, 2, 'Julian Hurtado', 'Juli', 'julian@gmail.com', '+57 3253866559', 'activo', '$2b$10$6Wi1cWmLh7UmhrdcGLNiUewjPJRHrHx6CuB74bcEEYTsMtJG5BkDC', '2026-04-09 22:58:51'),
(32, 2, 'Elsa Cardenas', 'Elsita', 'elsa@gmai.com', '+57 3143312223', 'activo', '$2b$10$mXjnok5cg6BHqyk3I02ew.sEOgjKFsr4tBbW3rClyBl2/RjpfBqZG', '2026-04-09 23:00:08'),
(33, 3, 'Patprimo S.A.S.', 'Patprimo', 'patprimo@gmail.com', '+57 3206233245', 'activo', '$2b$10$94wWUL8pzuSRihlid2Mtfe4eFEScPhF21wUQSmZB2Jv6BT4yULHX.', '2026-04-09 23:00:55'),
(34, 3, 'Paola Castro', 'Paolita', 'paola@gmail.com', '+57 3201558565', 'activo', '$2b$10$VhpRy5OTfEh6lLMjAh/lzuicVR2bN4K8/NluNv6VOXN9z19L33lb.', '2026-04-10 00:19:55'),
(35, 3, 'Andres Fuquene', 'Andresito', 'andres@gmail.com', '+57 3228547462', 'activo', '$2b$10$I9vlBcUnK2utAb/49e54seXF3mrFd0NnMaljmTAAXGth1uKqIw7OG', '2026-04-10 00:20:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_orden`
--

CREATE TABLE `usuario_orden` (
  `Id_Usuario` int(11) NOT NULL COMMENT 'Id del Usuario',
  `Id_Orden` int(11) NOT NULL COMMENT 'Id de la Orden',
  `Funcion` varchar(50) DEFAULT NULL COMMENT 'Funcionalidad de la orden'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comprobantes`
--
ALTER TABLE `comprobantes`
  ADD PRIMARY KEY (`Id_Comprobante`),
  ADD KEY `Id_Usuario` (`Id_Usuario`),
  ADD KEY `Id_Orden` (`Id_Orden`);

--
-- Indices de la tabla `material`
--
ALTER TABLE `material`
  ADD PRIMARY KEY (`Id_Material`),
  ADD UNIQUE KEY `Nombre_Producto` (`Nombre_Material`),
  ADD KEY `fk_material_cliente` (`Id_Cliente`);

--
-- Indices de la tabla `orden_material`
--
ALTER TABLE `orden_material`
  ADD PRIMARY KEY (`Id_Orden`,`Id_Producto`),
  ADD KEY `Id_Producto` (`Id_Producto`);

--
-- Indices de la tabla `orden_produccion`
--
ALTER TABLE `orden_produccion`
  ADD PRIMARY KEY (`Id_Orden`),
  ADD KEY `Id_Cliente` (`Id_Cliente`),
  ADD KEY `Id_Producto` (`Id_Material`),
  ADD KEY `orden_produccion_ibfk_3` (`Id_Operario`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`Id_Rol`),
  ADD UNIQUE KEY `Nombre_Rol` (`Nombre_Rol`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Id_Usuario`),
  ADD UNIQUE KEY `Nombre_Usuario` (`Nombre_Usuario`),
  ADD UNIQUE KEY `Correo` (`Correo`),
  ADD KEY `Id_Rol` (`Id_Rol`);

--
-- Indices de la tabla `usuario_orden`
--
ALTER TABLE `usuario_orden`
  ADD PRIMARY KEY (`Id_Usuario`,`Id_Orden`),
  ADD KEY `Id_Orden` (`Id_Orden`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comprobantes`
--
ALTER TABLE `comprobantes`
  MODIFY `Id_Comprobante` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del comprobante.', AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `material`
--
ALTER TABLE `material`
  MODIFY `Id_Material` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del producto', AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `orden_produccion`
--
ALTER TABLE `orden_produccion`
  MODIFY `Id_Orden` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la orden de producción', AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `Id_Rol` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del rol', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `Id_Usuario` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del usuario', AUTO_INCREMENT=36;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comprobantes`
--
ALTER TABLE `comprobantes`
  ADD CONSTRAINT `comprobantes_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comprobantes_ibfk_2` FOREIGN KEY (`Id_Orden`) REFERENCES `orden_produccion` (`Id_Orden`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `material`
--
ALTER TABLE `material`
  ADD CONSTRAINT `fk_material_cliente` FOREIGN KEY (`Id_Cliente`) REFERENCES `usuario` (`Id_Usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `orden_material`
--
ALTER TABLE `orden_material`
  ADD CONSTRAINT `orden_material_ibfk_1` FOREIGN KEY (`Id_Orden`) REFERENCES `orden_produccion` (`Id_Orden`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orden_material_ibfk_2` FOREIGN KEY (`Id_Producto`) REFERENCES `material` (`Id_Material`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `orden_produccion`
--
ALTER TABLE `orden_produccion`
  ADD CONSTRAINT `orden_produccion_ibfk_1` FOREIGN KEY (`Id_Cliente`) REFERENCES `usuario` (`Id_Usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orden_produccion_ibfk_2` FOREIGN KEY (`Id_Material`) REFERENCES `material` (`Id_Material`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orden_produccion_ibfk_3` FOREIGN KEY (`Id_Operario`) REFERENCES `usuario` (`Id_Usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`Id_Rol`) REFERENCES `rol` (`Id_Rol`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario_orden`
--
ALTER TABLE `usuario_orden`
  ADD CONSTRAINT `usuario_orden_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_orden_ibfk_2` FOREIGN KEY (`Id_Orden`) REFERENCES `orden_produccion` (`Id_Orden`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
