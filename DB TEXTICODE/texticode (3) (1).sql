-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2026 at 03:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `texticode`
--

-- --------------------------------------------------------

--
-- Table structure for table `comprobantes`
--

CREATE TABLE `comprobantes` (
  `Id_Comprobante` int(11) NOT NULL COMMENT 'Identificador único del comprobante.',
  `Id_Usuario` int(11) NOT NULL COMMENT 'Persona que crea el comprobante',
  `Id_Orden` int(11) NOT NULL COMMENT 'Numero de orden',
  `Estado` enum('Entregado','Pendiente') NOT NULL DEFAULT 'Pendiente' COMMENT 'Estado del comprobante',
  `Fecha_Limite` date DEFAULT current_timestamp() COMMENT 'Fecha de generación del comprobante. No debe ser pasada.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que gestiona los comprobantes generados en el sistema.';

--
-- Dumping data for table `comprobantes`
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
(9, 26, 18, 'Pendiente', '2026-04-15'),
(10, 26, 19, 'Pendiente', '2026-03-07'),
(11, 26, 20, 'Pendiente', '2026-08-05'),
(12, 26, 21, 'Pendiente', '2026-07-05'),
(13, 26, 22, 'Pendiente', '2026-07-05'),
(14, 26, 23, 'Pendiente', '2026-07-05');

-- --------------------------------------------------------

--
-- Table structure for table `material`
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
-- Dumping data for table `material`
--

INSERT INTO `material` (`Id_Material`, `Nombre_Material`, `Categoria`, `Stock_Actual`, `Unidad`, `Stock_Minimo`, `Stock_Maximo`, `Fecha`, `Id_Cliente`) VALUES
(9, 'Tela de Algodon ', 'Telas', 50, 'Metros', 10, 200, '2026-04-10 00:23:44', 33),
(10, 'Botones', 'Accesorios', 9, 'Unidades', 10, 100, '2026-04-10 00:34:04', 33),
(11, 'Agujas ', 'Accesorios', 755, 'Unidades', 10, 1000, '2026-04-10 00:34:52', 33),
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
-- Table structure for table `orden_material`
--

CREATE TABLE `orden_material` (
  `Id_Orden` int(11) NOT NULL COMMENT 'Id de la Orden',
  `Id_Producto` int(11) NOT NULL COMMENT 'Id del producto',
  `Cantidad_Usada` int(11) NOT NULL COMMENT 'Cantidad usada en la orden'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla puente';

--
-- Dumping data for table `orden_material`
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
(18, 20, 1),
(19, 14, 1),
(20, 9, 1),
(20, 11, 1),
(20, 12, 1),
(20, 13, 1),
(20, 14, 1),
(21, 9, 1),
(21, 10, 1),
(21, 11, 1),
(21, 12, 1),
(21, 13, 1),
(21, 14, 1),
(22, 11, 1),
(23, 11, 1);

-- --------------------------------------------------------

--
-- Table structure for table `orden_produccion`
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
-- Dumping data for table `orden_produccion`
--

INSERT INTO `orden_produccion` (`Id_Orden`, `Id_Cliente`, `Id_Material`, `Producto`, `Cantidad`, `Prioridad`, `Fecha_Limite`, `Descripcion`, `Estado`, `Unidades_Realizadas`, `Id_Operario`, `Unidades`, `Fecha_Creacion`) VALUES
(10, 33, 10, 'Camisas', 100, 'Media', '2026-04-15', 'Camisas para tierra fría ', 'Completada', 100, 27, 100, '2026-04-10 00:43:01'),
(11, 33, 13, 'Pijamas ', 50, 'Baja', '2026-04-23', 'Pijamas de alta calidad ', 'Completada', 50, 27, 50, '2026-04-10 00:43:55'),
(12, 33, 14, 'Pantalones', 2000, 'Media', '2026-04-17', 'Pantalones casuales', 'Completada', 2000, 27, 2000, '2026-04-10 00:44:54'),
(13, 34, 16, 'Pantalonetas', 22, 'Alta', '2026-04-13', 'Pantalonetas del PSG', 'En Proceso', NULL, 28, NULL, '2026-04-10 00:45:47'),
(14, 34, 17, 'Uniformes', 50, 'Alta', '2026-04-14', 'Uniformes para niño', 'En Proceso', NULL, 28, NULL, '2026-04-10 00:46:29'),
(15, 34, 16, 'Pantalones ', 33, 'Baja', '2026-04-30', 'Pantalones tipo sudadera ', 'En Proceso', NULL, 28, NULL, '2026-04-10 00:47:25'),
(16, 35, 20, 'Camisas', 10, 'Baja', '2026-05-14', 'Camisas para mujer y niña', 'Completada', 10, 30, 10, '2026-04-10 00:49:04'),
(17, 35, 20, 'Medias', 40, 'Media', '2026-04-22', 'Medias termicas', 'Completada', 40, 30, 40, '2026-04-10 00:49:53'),
(18, 35, 18, 'Boxer', 500, 'Alta', '2026-04-15', 'Ropa interior para niño', 'Completada', 500, 30, 500, '2026-04-10 00:50:25'),
(19, 33, 14, 'camisas overside', 200, 'Alta', '2026-03-07', 'talla m s y xl', 'En Proceso', NULL, 36, NULL, '2026-05-06 14:21:22'),
(20, 33, 9, 'SUDADERAS HURLINTONG ', 200, 'Alta', '2026-08-05', 'TALLAS S, M, L Y XL NEGRAS', 'En Proceso', NULL, 28, NULL, '2026-05-06 15:27:58'),
(21, 33, 10, 'HODDIES HURLINTONG', 15000, 'Alta', '2026-07-05', 'NEGRAS CON BORDADOS LLAMATIVOS ', 'En Proceso', NULL, 28, NULL, '2026-05-06 15:32:34'),
(22, 33, 11, 'CHAQUETAS THE NORTH FACE ', 80, 'Alta', '2026-07-05', 'NEGRA, CON BORDADOS', 'Completada', 80, 28, 80, '2026-05-06 18:52:19'),
(23, 33, 11, 'camisas sena', 50, 'Media', '2026-07-05', 'camisas negras sena', 'Completada', 50, 28, 50, '2026-05-07 12:33:19');

-- --------------------------------------------------------

--
-- Table structure for table `rol`
--

CREATE TABLE `rol` (
  `Id_Rol` int(11) NOT NULL COMMENT 'Identificador único del rol',
  `Nombre_Rol` varchar(50) NOT NULL COMMENT 'Nombre del rol asignado al usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rol`
--

INSERT INTO `rol` (`Id_Rol`, `Nombre_Rol`) VALUES
(1, 'administrador'),
(3, 'cliente'),
(2, 'operario');

-- --------------------------------------------------------

--
-- Table structure for table `tokens_recuperacion`
--

CREATE TABLE `tokens_recuperacion` (
  `id` int(11) NOT NULL,
  `Id_Usuario` int(11) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expiracion` datetime NOT NULL,
  `usado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens_recuperacion`
--

INSERT INTO `tokens_recuperacion` (`id`, `Id_Usuario`, `token`, `expiracion`, `usado`) VALUES
(1, 33, 'e2ce832a0eb70aa5b07588d39274db9c788baebec558db6571a9944875c46242', '2026-05-06 17:05:19', 0),
(2, 33, 'a94c0169ee68a7d7e3991c1821677488e2fea3444b8d8b37fa139de5ff3a45ea', '2026-05-06 19:10:58', 0),
(3, 33, 'a6bc50cc2271bed75d24ddfbb90b9936bfdd85e33e05db951f062222333a2a43', '2026-05-06 19:12:20', 0),
(4, 33, '84bd7db2fa3a452eed02eb3523549f263f9b314366626b77a8995553279860e9', '2026-05-06 19:12:45', 0),
(5, 33, '21794338585be291d1d0cdac557b489874883a6cd5d755846bc66d6fc8a3a733', '2026-05-06 19:13:37', 0),
(6, 33, 'd60ee91ca5bd0036ae4c85736d344e50f8cc0a82f08671cd4e2199d0d3a05f79', '2026-05-06 19:15:27', 0),
(7, 33, '5c161c5d717af2d61ec2d480e2e6e7ff3acf8c82fa029217e860bf15e466c46f', '2026-05-06 19:19:36', 1),
(8, 33, 'c56d005aeb03018ddf104196030732d39cd7c9224fc131488be200f4ebdd4fd0', '2026-05-06 19:28:19', 1),
(9, 33, 'aecf081cf657543e2a363b8e6a3b41778a09a1f9c2cddc68f04c19984976759f', '2026-05-06 19:57:17', 1),
(10, 33, 'fb350a0c8ff47ac5fd9e1a38b2c69e34df023ade553d9c5f6860e39aadd96cba', '2026-05-06 22:48:37', 0),
(11, 33, 'cf6ebba364edf5f63fc5aa8f5b028737bdf6efd870f792671b5e7bb63fd3aaf9', '2026-05-07 13:28:00', 0),
(12, 33, '3bf065b1a8bcecd9e30a2d5f264c25e74ff43155be0e9b1281146d901047c6fe', '2026-05-07 13:29:27', 1),
(13, 33, '71c8cc1e9b4ea622825fe34e8f0649668eabdac8bd1f06780594383a665a8633', '2026-05-07 21:34:23', 0),
(14, 33, '54f8d9d17dce2a19d3f0adb981daf114d5145d6f52c151f2983fae31ff70af02', '2026-05-07 21:42:30', 0),
(15, 33, 'bb82f9ef8aedd56a5e2dca16b3b5a3efe7ccd4f1fa1573f10b25c2c36fca72a2', '2026-05-07 21:44:15', 1);

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
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
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`Id_Usuario`, `Id_Rol`, `Nombre_Completo`, `Nombre_Usuario`, `Correo`, `Telefono`, `Estado`, `Contrasena`, `Fecha_Registro`) VALUES
(26, 1, 'Kevin Wagner', 'Wagner', 'wagner@gmail.com', '+57 311 4500925', 'activo', '$2b$10$KqtEIabyifIOJgVwkXmYSeHyw5FNVeNlVUXDfRmC5dmrSrzfDfsTK', '2026-04-09 22:44:57'),
(27, 2, 'David Hernadez', 'Davincho', 'david@gmail.com', '+57 3102856574', 'activo', '$2b$10$fHz6b1LOpVi9Bs0HGihWPePCvz8PlROHnr5fdIriHSqyZghtSrJCK', '2026-04-09 22:46:49'),
(28, 2, 'Erika Parada', 'Erika22', 'wagnerrkevin@gmail.com', '+57 3205442212', 'activo', '$2b$10$G7zgIIpWv/Rdfty1eQ4lh.7cW42kf44n.jrCd6Fe6uE8EGkrGHihm', '2026-04-09 22:48:36'),
(29, 1, 'Luis Quintero', 'Lucho', 'luis@gmail.com', '+573143268696', 'activo', '$2b$10$stzmgitvHK4UfAQQcFEJHOq8qszBC6exdJaX2P2ZbfxYexzkqs1rG', '2026-04-09 22:50:00'),
(30, 2, 'Sandra Rincon', 'Sandrita', 'stevanwagne@gmail.com', '+57 3134567501', 'activo', '$2b$10$XLJpxEP1ees6luleoxF3S.NsuX5PWmhl4oxPmdM1y186AI/tkZWCy', '2026-04-09 22:57:34'),
(31, 2, 'Julian Hurtado', 'Juli', 'julian@gmail.com', '+57 3253866559', 'activo', '$2b$10$6Wi1cWmLh7UmhrdcGLNiUewjPJRHrHx6CuB74bcEEYTsMtJG5BkDC', '2026-04-09 22:58:51'),
(32, 2, 'Elsa Cardenas', 'Elsita', 'elsa@gmai.com', '+57 3143312223', 'activo', '$2b$10$mXjnok5cg6BHqyk3I02ew.sEOgjKFsr4tBbW3rClyBl2/RjpfBqZG', '2026-04-09 23:00:08'),
(33, 3, 'Patprimo S.A.S.', 'Patprimo', 'stevanwagner99@gmail.com', '+57 3206233245', 'activo', '$2b$10$q0hVKKM7hufNFQpBicB5weO6Sf9BoYKbsyq5Zt3gqA2kd8TXrBXZW', '2026-04-09 23:00:55'),
(34, 3, 'Paola Castro', 'Paolita', 'steva@gmail.com', '+57 3201558565', 'activo', '$2b$10$VhpRy5OTfEh6lLMjAh/lzuicVR2bN4K8/NluNv6VOXN9z19L33lb.', '2026-04-10 00:19:55'),
(35, 3, 'Andres Fuquene', 'Andresito', 'stevaer1@gmail.com', '+57 3228547462', 'activo', '$2b$10$I9vlBcUnK2utAb/49e54seXF3mrFd0NnMaljmTAAXGth1uKqIw7OG', '2026-04-10 00:20:39'),
(36, 2, 'sengrid', 'sengrid', 'camilotibambre@gmail.com', '+57 000 000 0000', 'activo', '$2b$10$XKDk2r6YtORKABf1/4rfCO9jAJUaoqzzIwbs8KjV9L.gKZx9gKL0m', '2026-05-05 21:40:57');

-- --------------------------------------------------------

--
-- Table structure for table `usuario_orden`
--

CREATE TABLE `usuario_orden` (
  `Id_Usuario` int(11) NOT NULL COMMENT 'Id del Usuario',
  `Id_Orden` int(11) NOT NULL COMMENT 'Id de la Orden',
  `Funcion` varchar(50) DEFAULT NULL COMMENT 'Funcionalidad de la orden'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comprobantes`
--
ALTER TABLE `comprobantes`
  ADD PRIMARY KEY (`Id_Comprobante`),
  ADD KEY `Id_Usuario` (`Id_Usuario`),
  ADD KEY `Id_Orden` (`Id_Orden`);

--
-- Indexes for table `material`
--
ALTER TABLE `material`
  ADD PRIMARY KEY (`Id_Material`),
  ADD UNIQUE KEY `Nombre_Producto` (`Nombre_Material`),
  ADD KEY `fk_material_cliente` (`Id_Cliente`);

--
-- Indexes for table `orden_material`
--
ALTER TABLE `orden_material`
  ADD PRIMARY KEY (`Id_Orden`,`Id_Producto`),
  ADD KEY `Id_Producto` (`Id_Producto`);

--
-- Indexes for table `orden_produccion`
--
ALTER TABLE `orden_produccion`
  ADD PRIMARY KEY (`Id_Orden`),
  ADD KEY `Id_Cliente` (`Id_Cliente`),
  ADD KEY `Id_Producto` (`Id_Material`),
  ADD KEY `orden_produccion_ibfk_3` (`Id_Operario`);

--
-- Indexes for table `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`Id_Rol`),
  ADD UNIQUE KEY `Nombre_Rol` (`Nombre_Rol`);

--
-- Indexes for table `tokens_recuperacion`
--
ALTER TABLE `tokens_recuperacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `Id_Usuario` (`Id_Usuario`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Id_Usuario`),
  ADD UNIQUE KEY `Nombre_Usuario` (`Nombre_Usuario`),
  ADD UNIQUE KEY `Correo` (`Correo`),
  ADD KEY `Id_Rol` (`Id_Rol`);

--
-- Indexes for table `usuario_orden`
--
ALTER TABLE `usuario_orden`
  ADD PRIMARY KEY (`Id_Usuario`,`Id_Orden`),
  ADD KEY `Id_Orden` (`Id_Orden`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comprobantes`
--
ALTER TABLE `comprobantes`
  MODIFY `Id_Comprobante` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del comprobante.', AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `material`
--
ALTER TABLE `material`
  MODIFY `Id_Material` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del producto', AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `orden_produccion`
--
ALTER TABLE `orden_produccion`
  MODIFY `Id_Orden` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la orden de producción', AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `rol`
--
ALTER TABLE `rol`
  MODIFY `Id_Rol` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del rol', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tokens_recuperacion`
--
ALTER TABLE `tokens_recuperacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `Id_Usuario` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del usuario', AUTO_INCREMENT=37;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comprobantes`
--
ALTER TABLE `comprobantes`
  ADD CONSTRAINT `comprobantes_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comprobantes_ibfk_2` FOREIGN KEY (`Id_Orden`) REFERENCES `orden_produccion` (`Id_Orden`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `material`
--
ALTER TABLE `material`
  ADD CONSTRAINT `fk_material_cliente` FOREIGN KEY (`Id_Cliente`) REFERENCES `usuario` (`Id_Usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orden_material`
--
ALTER TABLE `orden_material`
  ADD CONSTRAINT `orden_material_ibfk_1` FOREIGN KEY (`Id_Orden`) REFERENCES `orden_produccion` (`Id_Orden`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orden_material_ibfk_2` FOREIGN KEY (`Id_Producto`) REFERENCES `material` (`Id_Material`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orden_produccion`
--
ALTER TABLE `orden_produccion`
  ADD CONSTRAINT `orden_produccion_ibfk_1` FOREIGN KEY (`Id_Cliente`) REFERENCES `usuario` (`Id_Usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orden_produccion_ibfk_2` FOREIGN KEY (`Id_Material`) REFERENCES `material` (`Id_Material`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orden_produccion_ibfk_3` FOREIGN KEY (`Id_Operario`) REFERENCES `usuario` (`Id_Usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `tokens_recuperacion`
--
ALTER TABLE `tokens_recuperacion`
  ADD CONSTRAINT `tokens_recuperacion_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`) ON DELETE CASCADE;

--
-- Constraints for table `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`Id_Rol`) REFERENCES `rol` (`Id_Rol`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usuario_orden`
--
ALTER TABLE `usuario_orden`
  ADD CONSTRAINT `usuario_orden_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_orden_ibfk_2` FOREIGN KEY (`Id_Orden`) REFERENCES `orden_produccion` (`Id_Orden`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
