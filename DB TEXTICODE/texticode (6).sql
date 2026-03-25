-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-03-2026 a las 13:38:51
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

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
(1, 'agujas', 'Accesorios', 3, 'unidades', 5, 70, '2026-03-12 06:27:31', 24),
(2, 'tela roja', 'Telas', 50, 'metros', 8, 90, '2026-03-12 06:28:06', 24),
(3, 'Algodon', 'Accesorios', 32, 'metros', 15, 100, '2026-03-12 06:30:23', 14),
(4, 'Botones', 'Accesorios', 2122, '658', 113, 1, '2026-03-12 09:33:15', 24),
(5, 'tela negra', 'Telas', 19, 'metros', 20, 50, '2026-03-18 15:05:49', 24),
(6, 'hilo rojo', 'Hilos', 31, 'metros', 30, 1000, '2026-03-18 16:27:45', 24),
(7, 'Tela de dragon', 'Telas', 50, 'Metros', 2, 50, '2026-03-24 20:11:06', 24),
(8, 'asasas', 'Telas', 99, 'Metros', 66, 25, '2026-03-24 20:29:18', 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_material`
--

CREATE TABLE `orden_material` (
  `Id_Orden` int(11) NOT NULL COMMENT 'Id de la Orden',
  `Id_Producto` int(11) NOT NULL COMMENT 'Id del producto',
  `Cantidad_Usada` int(11) NOT NULL COMMENT 'Cantidad usada en la orden'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla puente';

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
  `Unidades` int(225) DEFAULT NULL COMMENT 'Unidades a realizar por el operario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena las órdenes de producción';

--
-- Volcado de datos para la tabla `orden_produccion`
--

INSERT INTO `orden_produccion` (`Id_Orden`, `Id_Cliente`, `Id_Material`, `Producto`, `Cantidad`, `Prioridad`, `Fecha_Limite`, `Descripcion`, `Estado`, `Unidades_Realizadas`, `Id_Operario`, `Unidades`) VALUES
(4, 14, 5, 'Pantalones de lino', 500, 'Baja', '2026-04-04', 'Pantalones de vestir tipo lino', 'En Proceso', NULL, NULL, NULL),
(5, 24, 2, 'Camisas de vestir', 300, 'Alta', '2026-03-26', 'Camisas para la boda con Manuela', 'En Proceso', NULL, NULL, NULL),
(6, 24, 6, 'xDE', 100, 'Baja', '2026-03-20', 'la grasa ', 'En Proceso', 83, 23, 100),
(7, 24, 4, 'Chaquetas hornets', 100, 'Media', '2026-03-27', 'Chaquetas para vender en el centro', 'Completada', 100, 23, 100),
(8, 24, 4, 'Botoones', 254, 'Baja', '2026-04-11', 'Botones 4 huecos', 'Completada', 254, 23, 254),
(9, 24, 6, 'sdsdsdsd', 100, 'Alta', '2026-03-28', 'SDSDSD', 'En Proceso', NULL, 23, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `Id_Rol` int(11) NOT NULL,
  `Nombre_Rol` varchar(50) NOT NULL
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
(8, 1, 'Andres Lancheros', 'Andres Lancheros ', 'AndresLancheros@gmail.com', '+57 311 265 8375', 'inactivo', '$2b$10$gV/bqXxthVbxkOTrEszygeQCok4h6paooXmYcCzz3DIVWC1MAgbL.', '2026-03-18 09:29:13'),
(9, 1, 'Camilo Tibambre', 'Camilo T.', 'CamiloTibambre@gmail.com', '+57 320 359 0156', 'activo', '$2b$10$eiteNcL4VsJkMrWY89Ia/ebmdA.bawQikAkcwHuZHo9EYWHnRSOnG', '2026-03-18 09:34:55'),
(14, 3, 'Daniel Camargo', 'Daniel Camargo', 'DanielCamargo@gmail.com', '+57 311 258 8848', 'activo', '$2b$10$tpZAouXrzdbgctcudM9P1e9roR3wjeXSAgfeM8dUz5KlV9Y3Yc0vm', '2026-03-18 16:25:16'),
(15, 1, 'Julian Pulido', 'Julian Pulido', 'JulianPulido@gmail.com', '+57 300 000 0000', 'activo', '$2b$10$o9O5y73vV7cGmIL9nVXIAunA4uk7fPOR/3gSV0eCLscWokqotyBjm', '2026-03-18 21:36:32'),
(18, 1, 'kevin', 'kevin', 'kevin@gmail.com', '+57 300 000 0000', 'activo', '$2b$10$Xs4jsRXB3tkyKxdszn2jiOaRrpRgh4c8Z2Tu/w7enmtoxd/ysm/vK', '2026-03-18 21:54:45'),
(21, 1, 'Andres Lancheros', 'Lancheros', 'lancheros@texticode.com', '+573112658375', 'activo', '$2b$10$jnp/I3GhG93f/8gUBrKfV.h7rMyEWrNUm197FhOaP.YWen/uMSgjm', '2026-03-18 22:03:53'),
(22, 1, 'Cristiano Ronaldo', 'CristianoR7', 'admin@texticode.com', '+573105226978', 'activo', '$2b$10$b7wEHwC9Pn88OECq96OIBOyQPmY0/XdGt.Se030J0SiX4QgeHcafu', '2026-03-18 22:53:27'),
(23, 2, 'Lionel Messi', 'Messi10', 'operario@texticode.com', '+573145571434', 'activo', '$2b$10$YkEqi2mbER6ZsyURdrNumOUtlyRkyoEgABeedVppAeP/iz6vT2QIu', '2026-03-18 22:54:22'),
(24, 3, 'Stiven Mesa', 'Blessd', 'cliente@texticode.com', '+57 3226408792', 'activo', '$2b$10$BC5EhJlMCg6QmuG60GAOVuZCq1CIY12eY9zw5WkNBbc.PiKaey/Pa', '2026-03-18 22:55:34');

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
  MODIFY `Id_Comprobante` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del comprobante.';

--
-- AUTO_INCREMENT de la tabla `material`
--
ALTER TABLE `material`
  MODIFY `Id_Material` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del producto', AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `orden_produccion`
--
ALTER TABLE `orden_produccion`
  MODIFY `Id_Orden` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la orden de producción', AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `Id_Rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `Id_Usuario` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del usuario', AUTO_INCREMENT=25;

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
