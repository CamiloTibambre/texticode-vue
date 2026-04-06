<template>
  <div class="layout">
    <AppSidebar rol="admin" />
    <main class="content">

      <!-- PARTÍCULAS DE FONDO DECORATIVAS -->
      <div class="bg-orbs" aria-hidden="true">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="bg-grid"></div>
      </div>

      <!-- HERO HEADER -->
      <div class="page-hero" :class="{ 'hero-visible': animVisible }">
        <div class="hero-left">
          <div class="hero-icon-wrap">
            <svg class="hero-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
            </svg>
            <div class="hero-icon-ring ring-1"></div>
            <div class="hero-icon-ring ring-2"></div>
          </div>
          <div class="hero-text">
            <h1 class="hero-title">
              <span v-for="(ch, i) in 'Gestión de Clientes'" :key="i"
                class="title-char"
                :style="{ animationDelay: animVisible ? `${i * 35}ms` : '9999s' }">{{ ch === ' ' ? '\u00A0' : ch }}</span>
            </h1>
            <p class="hero-sub">Directorio y comprobantes de entrega</p>
          </div>
        </div>
        <div class="hero-search-wrap">
          <div class="search-box" :class="{ 'search-focus': searchFocus }">
            <svg class="search-ico" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar clientes..."
              @focus="searchFocus = true"
              @blur="searchFocus = false"
            >
          </div>
        </div>
      </div>

      <!-- STATS CARDS con contadores animados -->
      <div class="cards" :class="{ 'cards-visible': animVisible }">
        <div
          v-for="(s, i) in statCards"
          :key="i"
          class="stat-card"
          :style="{ transitionDelay: animVisible ? `${i * 80}ms` : '0ms' }"
        >
          <div class="stat-accent" :style="{ background: s.accent }"></div>
          <div class="stat-icon-bg" :style="{ color: s.accent }">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" :d="s.icon"/>
            </svg>
          </div>
          <h3>{{ s.label }}</h3>
          <p :style="{ color: s.accent }">{{ s.display }}</p>
        </div>
      </div>

      <!-- LISTA CLIENTES -->
      <section class="table-box" :class="{ 'box-visible': animVisible }" style="transition-delay: 200ms">
        <div class="table-header-bar">
          <div class="table-header-left">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
            </svg>
            Lista de Clientes
            <span class="count-badge">{{ clientesFiltradosOrdenados.length }}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="sortable" @click="sortClientes('nombre')">
                Nombre <span class="sort-icon">{{ sortIcon('clientes', 'nombre') }}</span>
              </th>
              <th class="sortable" @click="sortClientes('email')">
                Email <span class="sort-icon">{{ sortIcon('clientes', 'email') }}</span>
              </th>
              <th>Teléfono</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <TransitionGroup name="row">
              <tr
                v-for="(c, idx) in clientesFiltradosOrdenados"
                :key="c.id"
                class="table-row"
                :style="{ animationDelay: `${idx * 45}ms` }"
              >
                <td class="user-cell">
                  <div class="avatar-wrap">
                    <div class="avatar" :style="{ background: avatarBg(c.iniciales), color: avatarFg(c.iniciales) }">
                      {{ c.iniciales }}
                    </div>
                    <div class="avatar-online"></div>
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ c.nombre }}</span>
                    <span class="user-handle">{{ c.email }}</span>
                  </div>
                </td>
                <td class="email-td">{{ c.email }}</td>
                <td>
                  <div class="phone-cell">
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                    </svg>
                    {{ c.telefono }}
                  </div>
                </td>
                <td><span class="badge success">{{ c.estado }}</span></td>
              </tr>
            </TransitionGroup>
          </tbody>
        </table>

        <div v-if="clientesFiltradosOrdenados.length === 0" class="empty-state">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9ca3af" width="40" height="40">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75s.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>
          </svg>
          <p>No se encontraron clientes</p>
        </div>
      </section>

      <!-- COMPROBANTES -->
      <section class="table-box" :class="{ 'box-visible': animVisible }" style="transition-delay: 320ms">
        <div class="table-header-bar">
          <div class="table-header-left">
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"/>
            </svg>
            Comprobantes de Entrega
            <span class="count-badge">{{ ordenesOrdenadas.length }}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="sortable" @click="sortOrdenes('numero')">
                N.° Orden <span class="sort-icon">{{ sortIcon('ordenes', 'numero') }}</span>
              </th>
              <th class="sortable" @click="sortOrdenes('cliente')">
                Cliente <span class="sort-icon">{{ sortIcon('ordenes', 'cliente') }}</span>
              </th>
              <th class="sortable" @click="sortOrdenes('fecha')">
                Fecha Entrega <span class="sort-icon">{{ sortIcon('ordenes', 'fecha') }}</span>
              </th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(o, idx) in ordenesOrdenadas"
              :key="o.id"
              class="table-row"
              :class="{ 'row-flash': o.flash }"
              :style="{ animationDelay: `${idx * 40}ms` }"
            >
              <td>
                <span class="order-num-pill">#{{ o.numero }}</span>
              </td>
              <td>{{ o.cliente }}</td>
              <td>{{ o.fecha }}</td>
              <td>{{ o.productos }}</td>
              <td><span class="badge" :class="o.estadoClass">{{ o.estado }}</span></td>
              <td class="actions">
                <button class="action-btn view-btn" title="Ver detalle" @click="verDetalle(o)">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" shape-rendering="geometricPrecision" style="display:block">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z"/>
                  </svg>
                </button>
                <button class="action-btn download-btn" title="Descargar" @click="descargar(o)">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" shape-rendering="geometricPrecision" style="display:block">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- MODAL DETALLE COMPROBANTE PROFESIONAL -->
    <Transition name="modal">
      <div v-if="ordenSeleccionada" class="modal" @click.self="ordenSeleccionada = null">
        <div class="cp-wrap">

          <!-- ENCABEZADO EMPRESA -->
          <div class="cp-head">
            <div class="cp-head-left">
              <div class="cp-logo">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAABKl0lEQVR4nO3d65KcuLIG0OoJv/8r9/nhU9u0GiouQpfMtSIm7LFnukBcSvlJiK/v7+8XAAAAENt/vTcAAAAAeJ4AAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkMD/AXbk8TXH98fGAAAAAElFTkSuQmCC" alt="Texticode" style="height:60px;width:60px;object-fit:contain;" />
              </div>
              <div>
                <div class="cp-empresa-nombre">TEXTICODE</div>
                <div class="cp-empresa-datos">Bogotá, Colombia &nbsp;|&nbsp; texticode@correo.com &nbsp;|&nbsp; +57 300 000 0000</div>
              </div>
            </div>
            <div class="cp-head-right">
              <div class="cp-doc-titulo">COMPROBANTE DE ENTREGA</div>
              <div class="cp-doc-numero">N.° {{ ordenSeleccionada.numero }}</div>
            </div>
          </div>

          <div class="cp-linea-doble"></div>

          <!-- BLOQUE CLIENTE + FECHAS -->
          <div class="cp-info-row">
            <div class="cp-info-bloque">
              <div class="cp-label">CLIENTE</div>
              <div class="cp-valor-grande">{{ ordenSeleccionada.cliente }}</div>
              <div class="cp-valor-sub" v-if="ordenSeleccionada.clienteEmail !== '—'">{{ ordenSeleccionada.clienteEmail }}</div>
              <div class="cp-valor-sub" v-if="ordenSeleccionada.clienteTel !== '—'">Tel: {{ ordenSeleccionada.clienteTel }}</div>
            </div>
            <div class="cp-info-bloque cp-info-bloque--center">
              <div class="cp-label">FECHA DE EMISIÓN</div>
              <div class="cp-valor-grande">{{ fechaHoy }}</div>
              <div class="cp-label" style="margin-top:14px">FECHA DE ENTREGA</div>
              <div class="cp-valor-grande">{{ ordenSeleccionada.fecha }}</div>
            </div>
            <div class="cp-info-bloque cp-info-bloque--right">
              <div class="cp-label">ESTADO DEL PEDIDO</div>
              <div class="cp-estado-caja" :class="ordenSeleccionada.estadoClass">
                {{ ordenSeleccionada.estado }}
              </div>
              <div class="cp-label" style="margin-top:14px">ORDEN DE REFERENCIA</div>
              <div class="cp-valor-grande">#{{ ordenSeleccionada.numero }}</div>
            </div>
          </div>

          <div class="cp-linea-simple"></div>

          <!-- TABLA DE PRODUCTOS -->
          <table class="cp-tabla">
            <thead>
              <tr>
                <th class="cp-th cp-th--num">#</th>
                <th class="cp-th">Descripción del producto / servicio</th>
                <th class="cp-th cp-th--centro">Cantidad</th>
                <th class="cp-th cp-th--centro">Unidad</th>
                <th class="cp-th cp-th--right">Estado entrega</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in ordenSeleccionada.productosList" :key="i" class="cp-tr">
                <td class="cp-td cp-td--num">{{ String(i + 1).padStart(2, '0') }}</td>
                <td class="cp-td">
                  <div class="cp-prod-nombre">{{ p }}</div>
                  <div class="cp-prod-desc" v-if="ordenSeleccionada.descripcion && ordenSeleccionada.descripcion !== p">
                    {{ ordenSeleccionada.descripcion }}
                  </div>
                </td>
                <td class="cp-td cp-td--centro">{{ ordenSeleccionada.cantidad }}</td>
                <td class="cp-td cp-td--centro">{{ ordenSeleccionada.unidad }}</td>
                <td class="cp-td cp-td--right">
                  <span class="cp-entrega-badge" :class="ordenSeleccionada.estadoClass">
                    {{ ordenSeleccionada.estado === 'Entregado' ? '✓ Entregado' : '⏳ Pendiente' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="cp-linea-simple"></div>

          <!-- OBSERVACIONES + FIRMAS -->
          <div class="cp-bottom">
            <div class="cp-observaciones">
              <div class="cp-label">OBSERVACIONES</div>
              <div class="cp-obs-caja">
                {{ ordenSeleccionada.observaciones || 'Ninguna observación registrada para este pedido.' }}
              </div>
            </div>
            <div class="cp-firmas">
              <div class="cp-firma-bloque">
                <div class="cp-firma-linea"></div>
                <div class="cp-firma-nombre">Entregado por</div>
                <div class="cp-firma-cargo">TEXTICODE S.A.S.</div>
              </div>
              <div class="cp-firma-bloque">
                <div class="cp-firma-linea"></div>
                <div class="cp-firma-nombre">Recibido por</div>
                <div class="cp-firma-cargo">{{ ordenSeleccionada.cliente }}</div>
              </div>
            </div>
          </div>

          <!-- PIE DE PÁGINA -->
          <div class="cp-pie">
            <span>Este documento es un comprobante oficial de entrega emitido por TEXTICODE.</span>
            <span>Generado el {{ fechaHoy }}</span>
          </div>

          <!-- ACCIONES -->
          <div class="cp-acciones">
            <button class="btn-secondary" @click="ordenSeleccionada = null">Cerrar</button>
            <button class="btn-primary btn-icon-row" @click="descargar(ordenSeleccionada)">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
              Descargar PDF
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- TOAST -->
    <Transition name="toast">
      <div v-if="toastMsg" class="toast">
        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
        </svg>
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
import { getUsuarios, getComprobantes, getOrdenes } from '../../services/api.js'

const busqueda = ref('')
const ordenSeleccionada = ref(null)
const animVisible = ref(false)
const searchFocus = ref(false)
const toastMsg = ref('')
const cargando = ref(true)
const fechaHoy = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })

// ── Contadores animados ──
const displayTotalClientes = ref(0)
const displayActivos = ref(0)
const displayOrdenes = ref(0)

function animateCount(targetRef, target) {
  let val = 0
  const step = Math.max(1, Math.ceil(target / 40))
  const id = setInterval(() => {
    val += step
    if (val >= target) { targetRef.value = target; clearInterval(id) }
    else targetRef.value = val
  }, 20)
}

// ── Stat cards config ──
const statCards = computed(() => [
  {
    label: 'Total Clientes',
    display: displayTotalClientes.value,
    accent: '#1f3a52',
    icon: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
  },
  {
    label: 'Clientes Activos',
    display: displayActivos.value,
    accent: '#16a34a',
    icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  {
    label: 'Órdenes Totales',
    display: displayOrdenes.value,
    accent: '#2563eb',
    icon: 'm9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z',
  },
])

// ── Datos ──
const clientes = ref([])
const ordenes = ref([])

// ── CARGA DESDE LA BD ──
async function cargarDatos() {
  cargando.value = true
  try {
    const [dataUsuarios, dataOrdenes, dataComprobantes] = await Promise.all([
      getUsuarios(),
      getOrdenes(),
      getComprobantes(),
    ])

    clientes.value = dataUsuarios
      .filter(u => (u.Nombre_Rol || u.Rol || '').toLowerCase() === 'cliente' && u.Estado === 'activo')
      .map(u => ({
        id: u.Id_Usuario,
        nombre: u.Nombre_Completo || u.Nombre_Usuario || '',
        email: u.Correo || '',
        telefono: u.Telefono || '—',
        estado: u.Estado === 'activo' ? 'Activo' : 'Inactivo',
        iniciales: (u.Nombre_Completo || u.Nombre_Usuario || '?')
                     .split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase(),
      }))

    const mapaClientes = {}
    clientes.value.forEach(c => { mapaClientes[c.id] = c.nombre })

    const mapaComp = {}
    dataComprobantes.forEach(c => { mapaComp[c.Id_Orden] = c })

    ordenes.value = dataOrdenes
      .filter(o => mapaClientes[o.Id_Cliente])
      .map(o => {
        const comp = mapaComp[o.Id_Orden]
        const estadoComp = comp?.Estado || o.Estado
        const esEntregado= estadoComp === 'Entregado' || o.Estado === 'Completada'
        const clienteInfo = clientes.value.find(c => c.id === o.Id_Cliente) || {}
        return {
          id: o.Id_Orden,
          numero: String(o.Id_Orden).padStart(4, '0'),
          cliente: mapaClientes[o.Id_Cliente] || `Cliente #${o.Id_Cliente}`,
          clienteEmail: clienteInfo.email || '—',
          clienteTel: clienteInfo.telefono || '—',
          fecha: o.Fecha_Limite?.split('T')[0] || o.Fecha_Limite || '—',
          fechaCreacion: o.Fecha_Creacion?.split('T')[0] || o.Fecha_Inicio?.split('T')[0] || '—',
          productos: o.Producto || o.Descripcion || '—',
          descripcion: o.Descripcion || o.Producto || '—',
          cantidad: o.Cantidad || 1,
          unidad: o.Unidad || 'unidad(es)',
          observaciones: o.Observaciones || o.Notas || '',
          estado: esEntregado ? 'Entregado' : 'Pendiente',
          estadoClass: esEntregado ? 'success' : 'danger',
          productosList: [o.Producto || o.Descripcion || '—'],
          flash: false,
        }
      })

  } catch (e) {
    console.error('Error cargando datos de clientes:', e)
    clientes.value = []
    ordenes.value = []
  } finally {
    cargando.value = false
  }
}

// ── Ordenamiento ──
const sortKeyClientes = ref('nombre')
const sortDirClientes = ref(1)
const sortKeyOrdenes = ref('numero')
const sortDirOrdenes = ref(1)

function sortClientes(key) {
  sortKeyClientes.value === key ? sortDirClientes.value *= -1 : (sortKeyClientes.value = key, sortDirClientes.value = 1)
}
function sortOrdenes(key) {
  sortKeyOrdenes.value === key ? sortDirOrdenes.value *= -1 : (sortKeyOrdenes.value = key, sortDirOrdenes.value = 1)
}
function sortIcon(tabla, key) {
  const k = tabla === 'clientes' ? sortKeyClientes.value : sortKeyOrdenes.value
  const d = tabla === 'clientes' ? sortDirClientes.value : sortDirOrdenes.value
  if (k !== key) return '⇅'
  return d === 1 ? '↑' : '↓'
}

// ── Computed ──
const clientesFiltradosOrdenados = computed(() => {
  const q = busqueda.value.toLowerCase()
  const lista = clientes.value.filter(c =>
    c.nombre.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  )
  return [...lista].sort((a, b) => {
    const k = sortKeyClientes.value
    return (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * sortDirClientes.value
  })
})

const ordenesOrdenadas = computed(() =>
  [...ordenes.value].sort((a, b) => {
    const k = sortKeyOrdenes.value
    return (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * sortDirOrdenes.value
  })
)

// ── Colores avatar ──
const avatarBgPalette = ['#dbeafe','#fce7f3','#d1fae5','#fef3c7','#ede9fe','#fee2e2','#e0f2fe']
const avatarFgPalette = ['#1d4ed8','#9d174d','#065f46','#92400e','#5b21b6','#991b1b','#0369a1']
function avatarBg(iniciales) {
  return avatarBgPalette[(iniciales?.charCodeAt(0) || 0) % avatarBgPalette.length]
}
function avatarFg(iniciales) {
  return avatarFgPalette[(iniciales?.charCodeAt(0) || 0) % avatarFgPalette.length]
}

// ── Acciones ──
function verDetalle(orden) { ordenSeleccionada.value = orden }

function descargar(orden) {
  orden.flash = true
  setTimeout(() => { orden.flash = false }, 1200)
  showToast(`Descargando comprobante ${orden.numero}...`)
}

function showToast(msg) {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

// ── onMounted ──
onMounted(async () => {
  await cargarDatos()
  setTimeout(() => {
    animVisible.value = true
    animateCount(displayTotalClientes, clientes.value.length)
    animateCount(displayActivos, clientes.value.filter(c => c.estado === 'Activo').length)
    animateCount(displayOrdenes, ordenes.value.length)
  }, 80)
})
</script>

<style scoped>
/* ── LAYOUT ── */
.layout { display: flex; min-height: 100vh; background: #f1f5f9; position: relative; overflow: hidden; }
.content { flex: 1; padding: 28px 30px; position: relative; z-index: 1; }

/* ── FONDO DECORATIVO ── */
.bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.07;
}
.orb-1 {
  width: 600px; height: 600px;
  background: #1f3a52;
  top: -200px; right: -100px;
  animation: orbDrift1 18s ease-in-out infinite alternate;
}
.orb-2 {
  width: 400px; height: 400px;
  background: #2563eb;
  bottom: -100px; left: 10%;
  animation: orbDrift2 22s ease-in-out infinite alternate;
}
.orb-3 {
  width: 300px; height: 300px;
  background: #16a34a;
  top: 40%; right: 5%;
  animation: orbDrift3 15s ease-in-out infinite alternate;
}

@keyframes orbDrift1 { from { transform: translate(0,0) scale(1); } to { transform: translate(-60px,40px) scale(1.1); } }
@keyframes orbDrift2 { from { transform: translate(0,0) scale(1); } to { transform: translate(40px,-50px) scale(1.15); } }
@keyframes orbDrift3 { from { transform: translate(0,0) scale(1); } to { transform: translate(-30px,30px) scale(0.9); } }

.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(31,58,82,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(31,58,82,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* ── HERO HEADER ── */
.page-hero {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 28px;
  opacity: 0; transform: translateY(-16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.page-hero.hero-visible { opacity: 1; transform: translateY(0); }

.hero-left { display: flex; align-items: center; gap: 16px; }
.hero-text { display: flex; flex-direction: column; }

.hero-icon-wrap {
  position: relative;
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  background: #1f3a52;
  border-radius: 14px;
  flex-shrink: 0;
}
.hero-icon { width: 26px; height: 26px; color: white; }

.hero-icon-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid #1f3a52;
  opacity: 0;
  animation: iconPulse 3s ease-out infinite;
}
.ring-1 { width: 68px; height: 68px; animation-delay: 0s; }
.ring-2 { width: 86px; height: 86px; animation-delay: 0.8s; }

@keyframes iconPulse {
  0% { transform: scale(0.7); opacity: 0.5; }
  100% { transform: scale(1.4); opacity: 0; }
}

/* Título letra por letra */
.hero-title {
  font-size: 24px; font-weight: 700; color: #111827;
  margin: 0; display: flex; flex-wrap: wrap;
}
.title-char {
  display: inline-block;
  opacity: 0; transform: translateY(12px);
  animation: charReveal 0.4s ease forwards;
}
@keyframes charReveal {
  to { opacity: 1; transform: translateY(0); }
}

.hero-sub {
  font-size: 13px; color: #6b7280; margin: 4px 0 0 0;
}

/* Buscador hero */
.hero-search-wrap { flex-shrink: 0; }
.search-box {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 14px;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 280px;
}
.search-box.search-focus {
  border-color: #1f3a52;
  box-shadow: 0 0 0 3px rgba(31,58,82,0.1);
}
.search-ico { width: 16px; height: 16px; color: #9ca3af; flex-shrink: 0; }
.search-box input {
  border: none; outline: none; width: 100%;
  font-size: 14px; color: #374151; background: transparent;
}
.search-box input::placeholder { color: #9ca3af; }

/* ── STATS CARDS ── */
.cards {
  display: flex; gap: 18px; margin-bottom: 28px;
}
.stat-card {
  background: white; flex: 1;
  padding: 20px 20px 20px 24px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  position: relative; overflow: hidden;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.45s ease, transform 0.45s ease, box-shadow 0.2s;
}
.cards-visible .stat-card { opacity: 1; transform: translateY(0); }
.stat-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.09);
  transform: translateY(-3px) !important;
}

.stat-accent {
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 4px; border-radius: 4px 0 0 4px;
}
.stat-icon-bg {
  position: absolute; right: 16px; top: 50%;
  transform: translateY(-50%);
  opacity: 0.07;
}
.stat-icon-bg svg { width: 52px; height: 52px; }

.stat-card h3 { font-size: 13px; color: #6b7280; font-weight: 500; margin: 0 0 10px 0; }
.stat-card p { font-size: 30px; font-weight: 800; margin: 0; line-height: 1; }

/* ── TABLA BOX ── */
.table-box {
  background: white;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  margin-bottom: 28px;
  overflow: hidden;
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.box-visible { opacity: 1; transform: translateY(0); }

.table-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #f9fafb;
}
.table-header-left {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600; color: #374151;
}
.table-header-left svg { color: #1f3a52; }

.count-badge {
  background: #1f3a52; color: white;
  font-size: 11px; font-weight: 600;
  padding: 2px 8px; border-radius: 999px;
  line-height: 1.6;
}

/* ── TABLA ── */
table { width: 100%; border-collapse: collapse; }
thead { background: #f9fafb; }
th {
  text-align: left; font-size: 12px; font-weight: 600;
  color: #6b7280; padding: 13px 18px;
  white-space: nowrap;
}
.sortable { cursor: pointer; user-select: none; transition: color 0.15s; }
.sortable:hover { color: #1f3a52; }
.sort-icon { font-size: 11px; margin-left: 4px; opacity: 0.6; }

td { padding: 14px 18px; font-size: 14px; color: #374151; border-top: 1px solid #f1f5f9; }

/* Filas con entrada animada */
.table-row {
  transition: background 0.18s;
  animation: rowSlideIn 0.35s ease both;
}
.table-row:hover td { background: #f8fafc; }

@keyframes rowSlideIn {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes rowFlash { 0% { background: #d1fae5; } 100% { background: transparent; } }
.row-flash { animation: rowFlash 1.2s ease !important; }

/* ── USER CELL ── */
.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar-wrap { position: relative; flex-shrink: 0; }
.avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  transition: transform 0.2s;
}
.avatar:hover { transform: scale(1.12); }
.avatar-online {
  position: absolute; bottom: 1px; right: 1px;
  width: 9px; height: 9px; border-radius: 50%;
  background: #22c55e; border: 1.5px solid white;
}
.user-info { display: flex; flex-direction: column; }
.user-name { font-weight: 600; font-size: 14px; color: #111827; }
.user-handle { font-size: 12px; color: #6b7280; }
.email-td { color: #6b7280; font-size: 13px; }

.phone-cell { display: flex; align-items: center; gap: 6px; color: #374151; }

/* ── BADGES ── */
.badge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.success { background: #dcfce7; color: #15803d; }
.danger { background: #fee2e2; color: #b91c1c; }

/* ── ORDER NUM PILL ── */
.order-num-pill {
  display: inline-block;
  background: #f1f5f9;
  color: #1f3a52;
  font-size: 12px; font-weight: 700;
  padding: 3px 10px; border-radius: 6px;
  font-family: 'Courier New', monospace;
  transition: background 0.15s;
}
tr:hover .order-num-pill { background: #e0ecff; color: #2563eb; }

/* ── ACCIONES ── */
.actions { display: flex; gap: 8px; align-items: center; }
.action-btn {
  width: 32px; height: 32px; border-radius: 7px; border: none;
  background: #1f3a52;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: white;
  transition: all 0.15s;
  -webkit-font-smoothing: antialiased;
}
.action-btn svg {
  pointer-events: none;
  filter: drop-shadow(0 0 0.3px rgba(255,255,255,0.4));
}
.view-btn:hover { background: #2d5580; transform: scale(1.07); }
.download-btn:hover { background: #1d4ed8; transform: scale(1.07); }

/* ── EMPTY STATE ── */
.empty-state {
  display: flex; flex-direction: column;
  align-items: center; gap: 8px;
  padding: 44px 0; color: #9ca3af; font-size: 14px;
}

/* ══ COMPROBANTE PROFESIONAL ══════════════════════════════ */
.modal {
  position: fixed; inset: 0; background: rgba(0,0,0,.45);
  backdrop-filter: blur(2px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000; padding: 20px;
}
.cp-wrap {
  background: #fff;
  width: 740px; max-width: 100%;
  max-height: 90vh; overflow-y: auto;
  border-radius: 4px;
  box-shadow: 0 8px 40px rgba(0,0,0,.18);
  font-family: 'Georgia', 'Times New Roman', serif;
}
.cp-head {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 22px 32px; background: #0f2236;
}
.cp-empresa-nombre { color: #fff !important; }
.cp-empresa-datos { color: #93c5fd !important; }
.cp-doc-titulo { color: #93c5fd !important; }
.cp-doc-numero { color: #fff !important; }
.cp-head-left { display: flex; align-items: center; gap: 14px; }
.cp-logo { flex-shrink: 0; }
.cp-empresa-nombre {
  font-size: 20px; font-weight: 700; letter-spacing: 3px;
  color: #1f3b57; font-family: Arial, sans-serif;
}
.cp-empresa-datos { font-size: 11px; color: #6b7280; margin-top: 3px; font-family: Arial, sans-serif; }
.cp-head-right { text-align: right; }
.cp-doc-titulo { font-size: 13px; font-weight: 600; letter-spacing: 2px; color: #6b7280; font-family: Arial, sans-serif; text-transform: uppercase; }
.cp-doc-numero { font-size: 26px; font-weight: 700; color: #1f3b57; font-family: Arial, sans-serif; margin-top: 4px; }

.cp-linea-doble { border: none; border-top: 3px double #1f3b57; margin: 0 32px; }
.cp-linea-simple { border: none; border-top: 1px solid #d1d5db; margin: 0 32px; }

.cp-info-row {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 0; padding: 22px 32px; border-bottom: 1px solid #e5e7eb;
}
.cp-info-bloque { padding-right: 20px; }
.cp-info-bloque--center { border-left: 1px solid #e5e7eb; padding-left: 20px; border-right: 1px solid #e5e7eb; padding-right: 20px; }
.cp-info-bloque--right { padding-left: 20px; padding-right: 0; }
.cp-label { font-size: 9px; font-weight: 700; letter-spacing: 2px; color: #9ca3af; text-transform: uppercase; font-family: Arial, sans-serif; margin-bottom: 5px; }
.cp-valor-grande{ font-size: 14px; color: #111827; line-height: 1.4; }
.cp-valor-sub { font-size: 12px; color: #6b7280; margin-top: 2px; font-family: Arial, sans-serif; }
.cp-estado-caja {
  display: inline-block; padding: 5px 14px; border-radius: 2px;
  font-size: 12px; font-weight: 700; font-family: Arial, sans-serif;
  letter-spacing: .5px; margin-top: 4px;
}
.cp-estado-caja.success { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.cp-estado-caja.danger { background: #fffbeb; color: #92400e; border: 1px solid #fcd34d; }

.cp-tabla { width: 100%; border-collapse: collapse; margin: 0; }
.cp-th {
  padding: 10px 12px 10px 32px;
  font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
  color: #fff; background: #1f3b57;
  text-transform: uppercase; font-family: Arial, sans-serif; text-align: left;
}
.cp-th--num { width: 44px; padding-left: 32px; }
.cp-th--centro { text-align: center; }
.cp-th--right { text-align: right; padding-right: 32px; }
.cp-tr { border-bottom: 1px solid #f3f4f6; }
.cp-tr:nth-child(even) { background: #f9fafb; }
.cp-td { padding: 13px 12px 13px 32px; font-size: 13px; color: #374151; vertical-align: top; }
.cp-td--num { color: #9ca3af; font-size: 12px; width: 44px; font-family: Arial, sans-serif; }
.cp-td--centro { text-align: center; font-family: Arial, sans-serif; }
.cp-td--right { text-align: right; padding-right: 32px; }
.cp-prod-nombre { font-weight: 600; color: #111827; }
.cp-prod-desc { font-size: 12px; color: #6b7280; margin-top: 3px; font-family: Arial, sans-serif; }
.cp-entrega-badge { font-size: 11px; font-weight: 600; font-family: Arial, sans-serif; padding: 3px 10px; border-radius: 2px; }
.cp-entrega-badge.success { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.cp-entrega-badge.danger { background: #fffbeb; color: #92400e; border: 1px solid #fcd34d; }

.cp-bottom { display: flex; gap: 32px; padding: 22px 32px 28px; }
.cp-observaciones { flex: 1; }
.cp-obs-caja {
  margin-top: 8px; padding: 12px; border: 1px solid #e5e7eb;
  font-size: 12px; color: #374151; line-height: 1.6;
  min-height: 64px; font-family: Arial, sans-serif;
}
.cp-firmas { display: flex; gap: 28px; align-items: flex-end; flex-shrink: 0; }
.cp-firma-bloque { text-align: center; }
.cp-firma-linea { width: 130px; border-top: 1px solid #374151; margin-bottom: 6px; }
.cp-firma-nombre { font-size: 11px; color: #374151; font-family: Arial, sans-serif; }
.cp-firma-cargo { font-size: 11px; font-weight: 600; color: #1f3b57; font-family: Arial, sans-serif; }

.cp-pie {
  background: #1f3b57; padding: 10px 32px;
  display: flex; justify-content: space-between;
  font-size: 10px; color: #93c5fd;
  font-family: Arial, sans-serif; letter-spacing: .3px;
}

.cp-acciones {
  display: flex; justify-content: flex-end; gap: 12px;
  padding: 16px 32px;
  border-top: 1px solid #e5e7eb; background: #f9fafb;
}
.btn-primary { background: #1f3b57; color: white; padding: 8px 14px; border-radius: 8px; border: none; cursor: pointer; transition: background .2s; font-size: 14px; }
.btn-primary:hover { background: #2d5580; }
.btn-secondary { background: #f3f4f6; color: #374151; padding: 8px 14px; border-radius: 8px; border: 1px solid #e5e7eb; cursor: pointer; transition: background .2s; font-size: 14px; }
.btn-secondary:hover { background: #e5e7eb; }
.btn-icon-row { display: flex; align-items: center; gap: 8px; }

/* ── TOAST ── */
.toast {
  position: fixed; bottom: 28px; right: 28px;
  background: #111827; color: white;
  padding: 12px 18px; border-radius: 10px;
  font-size: 14px; display: flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,.2); z-index: 2000;
}

/* ── TRANSICIONES ── */
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.toast-enter-active, .toast-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }

.row-enter-active, .row-leave-active { transition: opacity 0.3s ease; }
.row-enter-from, .row-leave-to { opacity: 0; }
</style>