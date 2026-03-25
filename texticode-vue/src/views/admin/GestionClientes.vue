<template>
  <div class="layout">
    <AppSidebar rol="admin" />
    <main class="content">
      <h1 :class="{ 'fade-in': mounted }">Gestión de Clientes</h1>
      <input v-model="busqueda" type="text" class="search" placeholder="Buscar clientes...">

      <!-- STATS CARDS con contadores animados -->
      <div class="cards">
        <div class="card" :class="{ 'card-visible': mounted }" style="transition-delay: 0ms">
          <h3>Total Clientes</h3>
          <p>{{ displayTotalClientes }}</p>
        </div>
        <div class="card" :class="{ 'card-visible': mounted }" style="transition-delay: 80ms">
          <h3>Clientes Activos</h3>
          <p class="green">{{ displayActivos }}</p>
        </div>
        <div class="card" :class="{ 'card-visible': mounted }" style="transition-delay: 160ms">
          <h3>Órdenes Totales</h3>
          <p class="blue">{{ displayOrdenes }}</p>
        </div>
      </div>

      <!-- LISTA CLIENTES -->
      <section class="table-container" :class="{ 'section-visible': mounted }" style="transition-delay: 200ms">
        <h2>Lista de Clientes</h2>
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
              <tr v-for="c in clientesFiltradosOrdenados" :key="c.id" class="table-row">
                <td class="user-cell">
                  <div class="avatar" :style="{ background: avatarColor(c.iniciales) }">{{ c.iniciales }}</div>
                  {{ c.nombre }}
                </td>
                <td>{{ c.email }}</td>
                <td>{{ c.telefono }}</td>
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
      <section class="table-container" :class="{ 'section-visible': mounted }" style="transition-delay: 300ms">
        <h2 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="section-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"/>
          </svg>
          Comprobantes de Entrega
        </h2>
        <table>
          <thead>
            <tr>
              <th class="sortable" @click="sortOrdenes('numero')">
                Número de Orden <span class="sort-icon">{{ sortIcon('ordenes', 'numero') }}</span>
              </th>
              <th class="sortable" @click="sortOrdenes('cliente')">
                Cliente <span class="sort-icon">{{ sortIcon('ordenes', 'cliente') }}</span>
              </th>
              <th class="sortable" @click="sortOrdenes('fecha')">
                Fecha de Entrega <span class="sort-icon">{{ sortIcon('ordenes', 'fecha') }}</span>
              </th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in ordenesOrdenadas" :key="o.id" class="table-row" :class="{ 'row-flash': o.flash }">
              <td>{{ o.numero }}</td>
              <td>{{ o.cliente }}</td>
              <td>{{ o.fecha }}</td>
              <td>{{ o.productos }}</td>
              <td><span class="badge" :class="o.estadoClass">{{ o.estado }}</span></td>
              <td class="actions">
                <button class="icon-btn" title="Ver detalle" @click="verDetalle(o)">
                  <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z"/>
                  </svg>
                </button>
                <button class="icon-btn" title="Descargar" @click="descargar(o)">
                  <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
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
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAABKl0lEQVR4nO3d65KcuLIG0OoJv/8r9/nhU9u0GiguQpfMtSIm7LFnukBcSvlJiK/v7+8XAAAAENt/vTcAAAAAeJ4AAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAggT+9NwAAOO37xH/79fBnXP35AEBjAgAAGMde0f218funnPmMT2GBkAAABiAAAIC2torlr1fdovtpZwOJvf0GABoQAADAc9aK3k8Fb+/C/qizjwjs7Xf5s4QCAPCAr+/vWfoZADC0M0WsL9/zQYhQAABuEgAAwHmK/Wdttef3gf8GANjgEQAA+OxIwa/Qr2fr0Ymy3QUCAHCCAAAA1n0qLhX8ba2FMAIBADjBIwAA8JeCf27CAAD4wAwAADJT9Mfx6TENgQAA6QkAAMhmrxBU8MdRHuevlb8TBACQigAAgCy2ij5Ff3zCAAB4CQAAiG1rtF/Rn9dWGOARAQDCEwAAENHaqK6in9LyPDErAIDwBAAARGG0n6vMCgAgBQEAADNT9FPbkXNKGADAlAQAAMzIFH9a+BQGCAIAmIoAAICZKPzpZW29AEEAAFMRAAAwA4U/oxAEADAtAQAAIysLK0U/oxAEADAdAQAAI9ob8f96CQIYhyAAgGl8fX/rQwEwDCP+zM5igQAMywwAAEag8CeKtTcHCAIAGIIAAICeFP5EtnV+CwIA6EIAAEAPCn8y+X5ZIwCAAQgAAGjtXQwt/x2i21osUAgAQDMCAABaMeoPggAAOhIAAPA0hT/8VgYBHgsA4HECAACetBzZVPjDb2sBmRAAgEf813sDAAjp+6X4hzOWQcD3yzUDwAPMAACgprVpzAoZOMZrAwF4lBkAANSy9qozxT9s2yrst9YHAIBbvr6/facAcItF/uA5ZgMAUI0ZAADc4blleJb1NACoxhoAAFxh1B/aWgsBzAYA4BQBAABnla8pU/xDG14ZCMAtHgEA4IxyFFLxD+2szQBwHQJwmEUAATiiLDiAMSyvSbMBANjlEQAAPrEAGYyrvD6FAABs8ggAAFu2Vh9XYMBYPBIAwCFmAACwZm/UX3EB47FAIAAfmQEAQMmUf5iX2QAAbBIAAPC2nPKvcIB5rc0GAACPAADwer2s8g/ReCQAgF/MAADgXRgo/iEe4R4A/yMAAMjN8/4QnxAAgNfrJQAAyEzxD3mUa3wAkJAAACAni/1BTkIAgMQsAgiQi6nAcxp58Tbn0XzKEGDk8wuAigQAAHmY8j+HT8XYKMfuq/i1ZKR5bOX9QAgAkMDX97fvZYAEFP9j2iuez/4/rX06j67sG+0JAQASEQAAxKf4H8OZgjhCIVbul0BgXEIAgCQEAACxKf77WSukohb7Rx0JBZynfQgBABIQAADEpfhv60gxq7D6SSAwFiEAQHACAICYFP/tlIXS987fse9TIOBcfs57wUYhAEBgAgCAeMqOuxt9fXvtq2iqZy9McV7XsfamBiEAQFACAIA4ynd6u8HXtVX0K5DaEAa0Vd5HnOcAAQgAAGJQ/Ndnav/YtgpT5349ZgIABCMAAJjfshByU7/PSP9cto6Ra6Gecn0AACb1p/cGAHCLxf7qUfjP6chxc23c877PCAEAJicAAJjX98bvOWctQFHkzGmt6P96CclqEAIABOARAID5uZFfE63wf/o8mLVt1o6va+Y6IQDAxAQAAHNajsZxzmyrm386xq22/8i5NktbCgLuEQIATEoAADCvtRu4UGDd1tTwkWwdt7PbWfv41/j8UdvaOgHXeDsAwKQEAABzsejfeSOO+JfH7sg2jX689/bhyv62YEbAdUIAgAkJAADmYdr/OeXobs8i5UwBHOn4Ht3P3gXkXhDgmtsmBACYjAAAYA6K/+NGKfw/FbhZj+XW8RghEDAj4DwhAMBEBAAA4zPt/5jeU/0/jfI7dus+hSM9ikpBwDlCAIBJCAAAxqb4/6z3iP9e4OCYnbfXjj2OrYUCjxECAExAAAAwLsX/Z71G/bc+z3Gqb6sA73WsHeNty8eUhAAAAxIAAIxJ8b+vR+Gv6O+vZxggCDhGCAAwsD+9NwCAX743fk/76f5bRabj0sen4/Hk+VBOcbco5zoLlgIMzAwAgPHoQK9rOepvtH8erYOA9+cIhLZZDwBgUAIAgLEo/te1KijWCkjHYg5bYc3T54tHAtYJAQAGJAAAGEfG4v/T/rYa9Vf4x9JyVoC1AbYJAQAGIwAAGIORxN9aFA+Kt9haBwHOo9+EAAAD+a/3BgCgcFjxnhnwVNGw/Nm9XiXI897H+fX6uXDfE9dZufr91+L35X+XiXsawEDMAADoa1kwuCE/P1poqn9uLWYEmFWy7n2PyxaAAAzFDACA/hT/fz1Z/G+N+Gv3XFrMCChfEfhV/F35Z5m41wF0ZgYAQD8ZF/1b8/QUfK9sY0t5XpgN8CzrAQB09qf3BgAkpQP819Oj/uVnwNLabID3v9dQnt/ZAz/3PYDOzAAAaM9z/389Vfwr/LnqydkoFvv8x3oAAJ2YAQDQh+L/uSKr/Plw1Fp4VHM2gHDqr+XjT0IAgIYsAgjQVsYO79pr0GoX/+Uif1kLK+oog6Ra59NTjxrMyrUK0JhHAADayT4F+Mkp/5nblWc99ViA89YsAIDmzAAAaON74/dZPFH8L0f93/8OtT01bd9MAG9CAWhOAADQTtaO7lPF/3s69fvf4SlPPWIiBPgr670RoDkBAMDzMk9xrV38Lwux78U/0MITawMsf1bG+0T22VEATQkAAJ6VeYr6E8W/Rf7o7YnZAE+tjzGLrPsN0JwAAKCNLAXr1+LXmqOamYMUxlT7lZNCAOEewOMEAADPydihLYuXu4WMhf4YWe1HAsoQIGMQkO2eCdCUAADgGVk7sDVH/i30xwyWIUCN4jXzYy4Z9xmgKQEAwHOydeJrrmhejvpnakfmszxHaz4SkHUmQLZ7J0AzAgCA+jJO/X+y+F/7LBjRUyHA+/cZZNtfgKYEAAB1ZSr632qNVB593j9jGzOPJ9YFyHbOfxe/AlDJn94bABBQpg57rVE6C/0xo61rvRzFvrsmxjJkW/786Mr9BuAmMwAA6snWUa1V3GQsbIjh0/la85GAbI8DuBcAPEAAAFBfho5rrdX+Ff9E91QIkEXGfQZ4jAAAoI5Mo/9fG78/S/FPFk+EABnuN+4LAJUJAADuy1TImvYP1wgBrsn4VhWAxwgAAOqJ2EFdG+1X/MN55TP8Nc79LCHA6yUEAKhCAABwT/QOeO3VzBX/ZFW+2u5uQVvrUZwZuFcAVCIAAKgjQwdV8Q/nbF0vNUOATG8GMAsA4CYBAMB1WZ5NrfG8cVn8ZyhWYO/eIAQ4J/p9FqAJAQAAe2oUFGsj/zrzIAS4IkPoCvAYAQDANRlG/2uM2Jv2D/ueCAGiyhJyADxGAADAGsU/tFM7BIhcIJtFBHCDAADgvAyj/6+X4h9aqvmKwOghwOuV4x4MUJ0AAOC8LB1rxT+09b3x+zMyvB7QfQXgIgEAwDnRp5/eHVVT/MM9Na6hLKPjWfYToBoBAMA5UUfUXq86I4eKf7ivxhT+qOsBuMcA3CAAADgu+uj/63V/6v/yV+C6mmuNRAoByvaItG8AjxMAABwXuaNZ67l/xT/Uc/e6Wv6/Ee9fQkeAkwQAAMdE7mjeLQwU//CsWiFAVBn2EaAKAQDAZxGfoy1d3ccMbQM91Xg9YNT1AF4vhT/AKQIAgOMidjTvFAblauURiwsYQY3XA75Fvk4j3qMBqhIAAHwWtcNca78iPx4Bo7gbskVeD0AACXCQAABgX9Ti9u7Ivef+ob2aiwICkJAAACAvz/3DnGoU8pGu4eWjTAIOgB0CAIBtUQvdO53k8rl/4Dlr95+76wFELJKj7Q/AYwQAAJ9F7VzeCTeitgmMZOs6q7UegIATIBkBAMC6qNNJa636D/TnUYCfot2vAaoTAABwhKn/MJbliv4eBfgp8r4B3CIAAPgt6kh3jWm/OtUwjhqj/9Hud+5RADsEAADbInUkTf2HuDwK8JtZAAArBAAA8d0d8Tf1H8blUYDfou0PQDUCAICfoi7+Z+o/xFXr+ow2CwCAwp/eGwDAsPbCkIghyRmf3s9OfZ+K0+ztv7xezxbyEdcCeL3i7hfAZQIAgH8idhTvdID3/p9MxdbRthMK1FPjfM3a9jXW+4jQdhHv5wC3CQAAfovQ+X296jz7H6UtzqpRTH69rJ9w1rLdP8082Zudsvw1U9vfKXqjXu9mAQAsCAAAYrvS8c3cWV4rQL9e10dT934uf221zVabf334b8qfkTEIqPEoQIQQMPO9DGCVAADgrwid3aUand4obbGlHE1+vY4VoGd+/lsZJkRv26PKdq9x3n4Kce6umj+6mkVvxPYBSE0AABDXndH/DB3/sn2eHC3cKnQztPOaJwr/vc95f9YygIne9rVmAUTgMQCA/+c1gADx6OQe06oILT9zbeZBJst2v/p4xdXPfRf+LT+3h1qzHCK0UZQQA6AKAQBAvNGu18vo/ydlEdrj85fFaBa99ztTAHO38M9wHwBIRwAAEEvkgqaW3sX/cjsyTU1e7mvv/c0UAijmtQPA/wgAAOIVAEb/t41S/C+NVBg/ZcSgI0sIcNWIxwyAmwQAQHaRCt7y/edX/t/Iek8/3xM5fBm5kMwSAkQ+vwA4QQAA8FeUzvGV/Yiy73s+vTt+BCMXylfNsE/RQ4Aa13eEdskyywlglwAAIIY7HfTor6Qbcdr/ljuzOEYz0z5EDQHK4OvsNa5gBghGAABkNkNBeMbVZ/+Xv0YzU/H/FqkQnandX69410HN63um47hHqAGkJgAAyN0ZjNKp3zNbERphNHqGqf+lGR4TuePqFPhIBXOU/QC4TAAAML+rxVaW0f8ZzVx0afe4Zj62ALwEAEBes41OPqHc/4jtEeE4z7j9M7f7jLMXjqo1CyBi2wCkIAAAspt9tK/m6P/sbbEUoUCZcTQ6Qruzb8bzshRhHwAuEQAAEFWkUdyZ9iNCu0eeBfB6XZ8FEIHCH0hNAABkFKVjf3Ufouz/lkj7ZqSS2u6cT7MvTgmQngAAYG53ivnIhWX0kGNEUdvbfsUkXANSEgAAmWXt/GXv+M9qhuMWKXiJXCBefQNIlDaJsA8AlwgAAOb0Vfx6VPRX/0UUpegCADoTAADZRBqhVBT+djUYgYzuhEuuMYAJCQCArLIWzxk67VmPbU9Rz6uo+/V63Sv8o1xjkfYF4BABAMB8rr6iTEeXJ0WaXVOKul+vV+x92+N+CKQkAADIR8cXWLqyGODyVwAmIQAAMokwQnnnlX+z7ztQ150wUJAIMCEBAJDR7B3XO8X87PuelRHXflwzcb3vpY4xkIYAAAAgr7tFsFAKYCICAID4TP+H61w764ycA0xIAABkEaEIvrv9Ouvz+i5+hdoyF/SzfzcAHCYAALKZvYMbIciAWcx+vzjq7n7OfE8SrgGpCAAAYhMYwH2Kw3WZZw0ATEkAAJBDpk66oqQP7T4/YSFAcAIAgDnomB+jAO1Du8/PVHiABAQAQBYRCugr0/kj7Hd2HuPoR7sfN3tbmcECpCAAADLI2qkzohfLDMdx9iJwyfVzTITCefbtBzhMAABkopOXR4SiZDYK5vm9Z5s4hgBBCQAAxhdpVLWFSMWL6f99RDqHWnKuAgxOAAAwh7OFoMIx1kjmTPsRpd2j7AcA/I8AAMggeyGcUYTCbcYQJ0K7c22x0QjHfrbrDeA0AQAQXYRO6R3Z93/mwuRdjMy2/bM/Rz779t+VfS2HrPsNJCEAALKYtVNnROq69zGfsZibbXujmHHWBXW45oAUBAAA47tSlChi/pqxU7883jNu/+s15yh6hHYfgXsPwMAEAADxKF5+m60Yfb3m29412j0PhT/ABAQAAHEpZP6a6VGAGUfOt2j3uV1pD+0HMDgBAAAZzFCMRixCZ2p3/hn1WLXgXABCEwAAkc3esZ9520c0cjEasfh/m6Hd37+njtnvXc4FICwBAJBBps7c7KHH00YrRr9fv4v/iMdvtHZ/vRT/ACT0p/cGALBLQV/fWjHao423CtCoxeh7f79efc/rEcOIUWV7+4j7LRCeGQAAMSlsjukxArwc9W/92S2tFVJl8d1638sQgs8sBAgQiBkAAGRVjv4/PRtg6/Oi2tq/1u2+95kAkIoAAIDsni5I136eAvTnaPz731+vukGAwv860+EBAhIAAMBfZUH6/rOlTwXRWoGp8N+2LNC3ivSjRai2B4APBABAZDOPXl3ZdiN29y2LxDIMKP9+y5X/J7u1IGDt7z/R9uOYeZ0F91EgLAEAEJVimLvWRqLPnFOzFj89bY3ia3cAqEAAADC2qzMBqE+79qHd+8r6KkAhMhCS1wACjEvhA8zIvQtgUAIAAAD2KOgBghAAANHpuAIAwEsAAADAOgEqQDACAAAAAEhAAAAQhxWrgZG4JwEMRgAAEIOpugAA7BIAAAAAQAICAAAAnmBmEsBgBAAAANT0VfwKwCAEAAAAAJCAAABgXFdGz0y5BQBglQAAAIBPhIsAAQgAAADY41l+gCAEAAAAAJCAAAAAgNo8MgAwIAEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAPCJVwECBCAAABiXVbQBAKhGAAAAwJ4rYaQZAwADEgAAAABAAgIAgFiMugG9eXwJYFACAAAAniAIABiMAAAAAAASEAAAxGDqPwAAuwQAAAAAkIAAAIgu08i4520BANgkAAAAAIAEBAAAAKzJNIMKIAUBABCVjisAZ/nuAEITAACRzf5MvI4oMAL3IoAgBAAAY7sSYuisA7W4BwEE8qf3BgCw6vulEz2q8rjMPtNkJmvXhPYfS5R7V4R9APhFAAAQhw5rfUfadOu/UZhed+ZcFsiMaebjECXEAPhFAAAQi47rfTUKyq/i58xcDLWi3QHgYQIAAPjnXTx+r/zZWe+fsSxKFaS/bRXsd9t972fzmSARICABAAD8LtBrFD97YYJidL04r9nu5c/V9gCkJwAAGNvVgujrpdA54onCf+8zys/JeoxatHv5OV+LP8va7leYCQAQiNcAAhnM3oFVrDyjLA6fPk/WRqFnPzfPerfBOwxp0e7vz10LYNjn3gMQjAAAgOjKYm+tCG29PctR6LXti6h14LL2+RnbvSWLkAIMTgAARDb7VN+rq6Dz01o7jjASvBVCzHzOblmbit/LVggQsd05p/e5CfA4AQBAPAqZdcsR4B4j0GvKbYpopOL/bWubRtm+3u62w8z3oJHOU4DqBAAAZDJq5z5qCDBi8b9UtvvMhSsAfCQAABjfnTcB8NcsBfYM23jWLPs0wza2NMtxA+AEAQDAHIxMXjdLERNtKvosocvewoAcN8OxBkhPAABkMWvH9OpCgAKDv0afgl6KcuxmaOslIUA9Ec5fgLAEAABEN0vx/zbLyPkns+1DlPDlrpmOWU1Z9xtIRgAARKdTn1eEDv2M+zDjNpci7MMds4U3NWXdbyCJP703AIBHZQ9AZi1kZp8FMOu2t273M58z+nU84/EuzXreAhwmAACYw9nCZPYC8q4I+/21+HX04u8tQru/PdXuZRsd+Yyv4v8b7XzIfK8BmIoAAGB8OtfXRGi3Gfdhxm1eqh2erS0w+F38/Sdlwb/2c2q4u8+jBRMAFAQAQCYzjaTWlG2/Zy4+t8xwDLX7umXxf/VNA+Xo/9rPWfucK2YPcK7Itr9AYgIAgHncKRoyirD/sz3KMdO27qnZ7uVo/d2fuVX0PzUr4IgIxxwgBW8BADKYYfT0k+/i17P/XzZZ95sx1Sr+S+/Cv5wVcOVzrm5blGstSngFsEsAAABzUJz0cafdvzZ+X1vNIACAwAQAADlkKQQi7ucMM1i0+7bWrxW8EwTc2dbRz1EAXgIAIJ/ZC5Ur6wBk65ibytuPdv+n5/oNZgQAsEoAAGQRoRC+ug4AtOC8/GeU+025OOD34s9qBAIRwrbZtx/gFAEAQB46utDWSNfc2qyA5d9lnv4fIcgAOEQAABCfjm0cjmUfZ9p99GNUBgGjby8AFQkAgIxm7/BemV48+wgdzGSGwnpvRsCZnwHARAQAAHO5W8jrsMN5kQO0q+sBRFiTxP0QSEcAAGQyysJcPWTed2hFQTknxw1IQwAAMCcFPYwpw3U5wyMOR2U4XgD/IwAAspq58+oxgLxGLlacV//caYvlM/nfr3vP6APAD396bwAAl50tMu6+6msWWfZzRNr9nrL9voq/W/vznmYOJkZpQ4CmzAAAsok2dT7SvtSgPfqI2u4ti8Rl8f/9+j36/1X8fS/RQp5I+wLwkQAAYE4eA8gjWsE1i5ar3JfFf3m8l2FAGQT0DANmPy+jBlcAmwQAQGazd15fr+uPAUQX4diWZjhuEdu9h71jvTYroGUQUH7elVcIAtCJAADIKFoRHGlfaojwfvKZRWn3HveJM5/XMwhY+zxBAMAEBAAA87ra0bdI3jxmOk5RCv/X6/6+tGwLQcB57oFAWgIAgPlFm9HAbzMd3+znY6+icm+dgKfNGgQApCMAADKLMAJkFsC6977NXIjOeHxmbu+3Gdu9VL4ysNeMgDKMeO38HoAGBABAVhE7nhGKr9pmDwFerzm3P2u7j7TPa0V46yBguR3LbVhuY2tfxa8AqfzpvQEA3HZ1tHvZER6pcKll5pFc295H75kjT332clr+8t+Xf/aE5c8ut6HcjpZmPkcBbjEDACB3RzBi4V+aOeCYbbvL6d0zb39E5Wj8iAsGRj8GAF0JAIDMZixQ9tzZn6id7mWhMcux7j0KfUf5CsaZzqver4/05oB/2/bkZwOkJgAAiOHuYoCRzbR/kaYm9y6oz6jd7md/Vq8V80cOAp4S6RoDOE0AAPBXlA5hrVkAUdrjbYZR9WVhMvJ2nqXdj29Hz8/uHQQst8MrBAEeIgAAshu9ODmj5iyAKG1SGvV4j1KE1jb6IxhPtvuI+/tJzyBg7TNrBgECBYCXAAAgImsBrFsWFSMVZ1GL/7ds7T7SPl7V4/n8pa0g4O79yfR/ID0BAMA/ETqG1gL4bKRiNHrxvzRDu49wDxhhG97K0f/eMwKWfwbABQIAgHGKkpqudpCzjJD1LryXI5u9tqGV8r3vrYvIpfLtBFkefblrb0bADAsGfhW/AqT1p/cGAFDdssg60+GNGITsWU4tbvnauiyF/9takV3uf4uV35efM2K7X7lmWytnA7Q+jmWYtPyzT8d09LYFaMIMAICfInUQzQL4rOWCZzMUoa20ave1xeRaTl+PbIQFA5fb4dEAgAO+vr8z9z8AfhjpGeUaro4oZhuhflsbXSz//Iytn5GpTY+o/Sz+KO1+5fqb+R60NzrfwtpnXp0NBRCWRwAAfpu1A17LWoc5Q5tsPVu8tt9lMbHVNgr/z7YKtzVn/5u9/4669t4a0KL4HnVRR4ChmAEA8NPMI3BrzAK4bq/NjrZp1ra741O7Hi0qe7f9nRkA79/PrkcQsCQMACiYAQCQw9UFAbPNAljaG/k3sl/f3jPk5Xm4pP3HtbXuRatiXNEPUBAAAKyLUuzemdGwDAF6vbatl602y9QGre21bZZ2j/q8eu8gAID/5y0AAD9FKfyXajzWkO092tHOAfrIcr0c1fOtAQC8BAAA7CuDA511OMc189P34p8er2cESE0AAPBbxGm4d2cBRGsPoL/lDABBAEADAgCA+O4u5Le3ABuwTiF7nCAAoBEBAMC6SM+8fxe/XhFxbQQYWYR7z1mCAICHCQAAtkXteN55K8DyV6A+YZsgAOAxAgCAzyIVvHc70Wuv74rUPkA/5b1EEABQmQAAYFvUkbg7CwKu/X8R2whqiXofecJWO20FAdoV4CQBAEBed0MAI/9AK+/7zjIIKP8MgA8EAAD7Iha7NUYkrQcAnylM71ub+v+9+EcQAHCCAADguCjF7vKtAHfCgLX1AIB6sl9bR+5PZgQAnCAAAPgseie85noAwH3R7zlHHb2/eDQA4CABAMAxUUe77+5XxEckYASK1/M8GgDwgQAA4JjIBe538etZQgDYZ7ZMe2YEAKwQAAAcF73zeLdIEQLAb9HvGyPzaABAQQAAcFzEke5yhe076wGs/R6gN0EAwP8TAADkVr5a645leCAEAEZjjQAgPQEAwDkRZwEs3X01oGedoa6o95rezAgAUhIAALCmRgjw7lgD57l2nufRACAdAQDAeRlmAbxeZgJATVeuCddQGx4NANIQAACwpsbaANGDEiAeQQAQmgAA4JoM09xrFO9CAFBAzsijAUBIAgAA9txdFPD1EgLAXa6dPqwRAIQjAAC4Lstz7rVDAMUMMBNBABCGAADgnq/i16hqhADvnwMc55oZh8UCgekJAADuW44MRXf3zQCvl8cByO3M9eM6GZcZAcCUBAAA92V6FOD1uh8CWBOArJzzsXg0AJiOAACgrugd/BohwPL/j95e8Ha3KHStjMujAcA0BAAAdWSZBfB6/dxPCwPCMc7xHAQBwNAEAAD1Zejo1xq9XwYnGdoNyMGjAcCQBAAA9WQrZpdvBqgxE+D9e4hmeZ04x/OwRgAwHAEAQF2ZHgV4vX4WNEIA+Klc9NK5nZMgABiGAADgOVk6+7VDAMUSEdR67WW2UDGi5bkgCAC6EgAA1Jexw15zTYD3z1v+O8ykVvFPDOX3gSAA6EYAAPCMr+LXDGrOBPBIALNS/HPUVhAA8BgBAMBzMhawy32u8d7zjG3InMqRXOcsR5VBgNkAwGMEAADPyTqaIwQgm3LU/6lz1TUQW7kGiiAAqE4AAPCs5Qrgyz+LrnYI8P6ZFgekl63zzqg/tQkCgMcIAADaqfF8/ExqhgDlzxEE0Fp5Drd8xZ9zPady9lOW7w7gQQIAgOdlnsb+VAiQtT3pb1nstxz1V/zltDYbAOAyAQBAG5k7bssObI2prN4SQC/l+9yde7SS9fsDqEwAANBe1qKh1msC38pnr7O2K89ZW7vD+UYvyyAV4BIBAEA7Rq3rT2Vdmw2QtW2pb20hNucXPQkBgFsEAABt6bjVXxdg+bOyByzUs1b41zyvrp77zm0ALhMAAPSRfSTxqRDASC17jpwTa4v8PVH4Oz8BaE4AANDe2nPFGdVeHPBt7fVsmduZf9Ze5bf270+FSHd+ptlDANwmAADoY6szn7FQfeoVV2uPBWRsX7atnRtPjfrXXgQTAE4TAAD0sxylfstaGDzxSMD751kfgC1l4f96PTfqX3umCwCcJgAA6GstBMiqDAGeDALMBsitVeH/adRfGMBZ7lvALX96bwAA/+MZ39/FWO1wZKvoy97uUZXX1NpsmycKqqdn9rhX5PTUfRFIRAAA0F+5YJ2O/e9R+ieCgK3HArR/HHtBz1OF/9bnwR2Kf6AKAQDAGDwK8Fu5QNtTswHWPmv5Z8ypPFeevr5arOfh/pCT4h+o5uv7W/8GYCDL1+Lxz9PPa7+ZETC/VtP8tz7j6PlydZvcI3JofR4DSZgBADCW5Ui3Dv4/W0VW7Q7x2s83I2B8a6P9a39eW41X+xnV5W0reHR+ANUIAADGJQT4a9kOT68NsPzMN7MCxrRV9K/9XW2f1hY4cn4o/Hm9FP1AYwIAgPFYFPCnrdenle3zVId5b1bA8s9po2fBdGS6v/OBTxT9QDcCAIAxCQG2fRe/tlof4NOigeXfUUfPkf7yM0d6HMR9YS4jnMcAAgCAgQkBjlkrzp7uUO89IjBSkTizUUZJW6zuf4ZicS6jnMcAr9dLAAAwOiHAb1vt0CMIWH7echvKPy//jp/WjlPvYmnEUf836weMb2t9CICuBAAA41uGAHwuxNYWCny92ocB5Wd/KnKz+RSQ9Drft84f2NPrTRQAp3x9f/teA5iE1wOeV47O9+yMHy1wIx7fI+HHCMem9VT/q7NV3AvGoOgHpmMGAMA8ljMBdPyPKUfge07HPfJIwNZMga3/fiSf2nOkgv/NKx45y2J+wNTMAACYjxDgur3F+0awdUyvbGON86PW547Uxq/XWIX/lUd8lv+9+8DzFP1AGGYAAMzHTIDr1jruIwUBd0b/y//3if35tB17MxhGMFLhzziOzA5S9AMhmAEAMC8hwH0RX9H1xPkQpT1GLPyvLvLp+n9GxHsCwP+YAQAwN0XAPVur9I80K+CsGbf5CWdH+3teR45ZH8tj7rV9QAoCAIB5vTuvQoD7yk6/YmBOd0b7e18/vd9SkdGy+J859AM4TAAAMDchQH2fZgW8XoqEkRw5XiNT+PdXLqroeABhCQAA5icEeMbWrIDl3ykU+hj9uX7m875/Xl2TAWAKAgCAGIQAzxIG9Lc3AyPz+e56v6+8fwoBgLC8BQAgLjf453k/+HPK8zdy0X+34IzUFiPwOAAQlhkAAHGtLWRHXUdmBrxeioijtp7nL/8+oivniAK1rnImAEA4AgCAuHRi2yofBfg0Yp392Ky1R+RRfsb3XfzeowBAOAIAgLjKzqtiqo21dj4zoh2x2Di6n9nPUcVmW0fWTxACAKFYAwAgPiHAePaKia1jNHoBsndubW278/GfK4WmRT+fZz0AIBQzAADiM4I1nr3HAbZGxo8UeU8c46PF5afPVqQ+RwjwHG8GAEIRAADksPU4gMJhDEemIdf4OWdsrWXQ6vNhFAp/IAyPAADksvU4gCBgbq2KE+fIc66OMHsMoB2zAIDpmQEAkMuyA7ssGhQPc3P84HneDABM77/eGwBAc951DWMykj8+My6AqQkAAHKysjWMRUE5FyEAMCUBAEBe5crWggCYl+v3GVtv5dj6O4ChCQAAWI5k6dAC/LM1ym/9FGBKAgAAXi8hAMBZ1gMApiMAAODN4oAwHwVoX0IAYCoCAACWrAsAfSkm5+S4AVMQAACwxiMBAMd8b/weYDgCAAC2eCQA4Bj3SWAKAgAA9rw7tB4JgOcZPZ6b9QCA4QkAAPhkuS7A+9+B8bg2xyAEAIYlAADgqPKRAMUGjMG1OI5lUCoEAIYjAADgDLMBYEyKzXEIAYBhCQAAuMJsAHiOwnF+jh8wJAEAAFetzQYQBMA9Csc4LAoIDEcAAMBdy9kA738HOCPqfUMIAAxFAABADdYGgPtqzKKZ7dpbvmo0MiEAMIQ/vTcAgFDWQgCdXti3LNozXS9ZiuLlWinv3wN0YQYAALVZGwCOWyv+r1wzsxXT5f5Fv0d4MwAwBAEAAE+xNgBsWxb52d6osdzvr5U/j0rhD3TnEQAAnlQ+BuCxANi+LjJYK/6XU+Ojj5AvFwXMdNyBQQgAAGhBEAC5C/+lteJXCADQgEcAAGhprQDSASa6crr/65XzvP9U2Ecv/EvZ9hcYgAAAgNaWI3yZiyHi6/Wc/4jX09HXhGYZGbcoINCFRwAA6MVjAUS1tbJ/VlcW+ltOk48qQ9ABDObr+zvyfRWAiawVSr6kmE3vqf6jFc5bK/5/svzvR9mXp2SZ9QAMwAwAAEaxtz5A9AKAuRnx33eluN1aFHCkcKMWiwICzQgAABiNIIBZKPz33S1q10KAyPcAIQDwOIsAAjCqrcUCdY7prdfifjOpVcweXTxwdpFnOAADMQMAgNGZEcAIttamiFyUXlW7iM0yMl6uexB9f4EOBAAAzGKt6BcE8LRZC/9eI8lXVvw/+nNHW+DwKRn2EejEWwAAmJk3B/CEsnCddQp662uhxeh1hhDALADgMWYAADAzjwdQU6TCv9c2t/rsCCHA1j6U6wHMdv4BAxMAABDB3uMB5Z9DaWs1f4XXca2K1UivBPy07V4PCFQnAAAgkiOF3MwFA/XM+mz/iFoXqZFCgD3ORaA6AQAAUW3NChAG5BVliv9IerXdMnSIGgJ4FACoziKAAGSyN9LrCzGevWMcuZgqXyf3lBEWq2u1rz2N0M5AEGYAAJDJ3rRvMwNi+BTsKKDqGKUozTA6Xs50iLyvwMPMAACAzyPDvizH9el4ZS2Wnnxd3ijF/1KW1wN6bAW4xQwAAPg8VdzjAuPYKnwU/W2NVPy/RQ8Bou8f0IAAAAB+23scQCDQ3pFR/tGK0ahGnYa+9WYABTPAggAAAPYdeabcYwN1HBndf/93oxWgGYxeTK+9GWDk7b3KuQ9cJgAAgHOOLjInFNi3V8RYuK+eWkX718bvR5Ph9YAAlwkAAOCeI48D7IUCW/9PJGeK/U//PcfUbMMRF/3bM+pjCrVE3jfgYQIAAKjrTJH/KRj49P/3drQI2dp2U/mfVbNQnK3oXIYAI147AF0IAACgjauj/2dCgj1HiqA7n7H382cqHPlp5tH0aCHAzMcCGMTX93eE+yEAhHb0y7pmYXCmg6AgGdedAjhKwTl7CDDbIxjAwMwAAIDxtRj9Lz9LoZHDWmEcteCcMQSIeiyATswAAACI7ewIeJSR/6Xl/szS+VX8A9X913sDAAB41NGCPvKr85b7NUMxrfgHHuERAACAHMpiclnoZyg4Z5nZkOFYAJ14BAAAIIe9EfCZRsfvGnlRQMU/8CgBAABAPlsL/2UxYgiQ7RgAHQgAAADIrHdn2Kg/0IxFAAEAyGiExx4U/0BTAgAAADLq/WYAxT/QnAAAAICseoUAin+gCwEAAACZtQwBvhafp/gHmhMAAACQXYs3ApSj/op/oDkBAAAA/AsBnijMTfkHhiAAAACAv54IART/wDAEAAAA8E/NEEDxDwxFAAAAAOu+Nn5/5P+z2B8wHAEAAAD8tPZmgKOLBFrsDxiWAAAAAH678npAU/6Bof3pvQEAADCo5XoAezMByr9T/ANDEgAAAMC2cibA1iKBRv2B4QkAAABg394Iv1F/YBoCAAAAOKYs/C3yB0zFIoAAAHCewh+YjgAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAT+9N4AAICbviv+rK+KP4tzHEeAhwkAAICZrBWJtYu9Fp+RXas2Lj/HcQRSEwDUUTOx5p8rX9KOxbYz7fn9//99j/YcvXPW8xz71DbO/zaunqMtj8/o19FZy7Z78jr4Kn69ug38drYQv3u9bB3L6Mdx9u+BiMfkiNmP25OynhOPEQDU4+Ss6+qN0HFYN1N7vsOHEfXctqPHcNS2i6JGcfm0KB3J9358vfaLuCc+s7S3Da65bXvF9tPn6dYMg6+N/ybScZx5X/auwcii7x8DEQDUFaXT1dudm2DPkesRXW1Lo//7Wo/kXgkeXAP13T0/W9yfZrmGtvQsGPesbVdZSM7e9jWthSMj3JP2ZiFECwNGaO+z1oK2t+iPcui//hbtGA9DAMBoXOx13emULgvPVl9Iy88b7VzosU1X214Hor7Rzsc1M2zjlq3R9BHP5bVC5Kv4u5mPxR2jFv5b1maZfL/G/A7K4MoMnNfK3wE7BADAEVLpf8yMgHpmKxjXbBWRWa7brf2fyVoxmT3MGcle6Fb+veMFHwgAgD09RuNHnAXQY2renTYQ2DCDssCa/ZzNGAREO4av1/Y+RT6OsznyKIfjBRsEAMBRMxXANfWa+r/8FSKJWDQulUFAxIIk+jF8vQQBM9mbheJ4QUEAAHzScxbASFp3cEdsA7irPK8jFo5vawVkhGt6uR/l1OuIx/O9v9GOY0Qe5YAD/uu9AcAUej8K0EvPhf90VoimLBwjFotrlgXIzPtdLo5X7ses+3XE8rj1/l7imOX5Ovu1B1UJAICzMhamrToNGduW+D4VjpFtrSw/WxsopP7K8OhDNFuP5EBaAgDgqB5fnD1nAbQehTe9lIi2Cscs5/jaKPlshcjMwcUTMjz2EM3aDA7HjbQEAMAZGaent+wkZGtbYss6XXzN1irlI7fD1qwF9yiPBMzKbAB4CQCA61p1AnvMAmj9mTrURGPU+KetAGTUImRvyv+I29vL6MeR34Q3pCcAAM7q9YXZYzp+S0b/iWIZoOlcbxu1CBHenDPqcWSfRwJISwAAXNWjYG3xBf1d/Pq0r+JXmNkIb++YyWjFo+L/mtGOI8fMvjgnXCIAAK742vj9U1p1rnou/AezM4vlmlGKR4XQPctiUvvNxblPKgIA4Koez+VH/SxFE7Mz7f+e3iGAAqguIcB8XAOkIQAAamg9av7El3Ov0X/moEO4TYhVR6+F9hQ+dfUOc7jOtUAKAgDgjoizAFp8xrKDoXBiZjrMdbVuT6v737N1/xYCzMv3MuEJAIAaWn5hPvGMZa8FDXUymJni/zkRZlVlsGy38pgJAeZlLQdC+9N7A4DpRXotoC97OM91U9e7+Ph6PRsUjh5Cftq20c67te1ZHkvm8/Q1CF0IAOqSFjKaVl9ayy/JVtNWa30xt076dSjOG+He6nj9NPII2dVjNdK+PB0CjDp748x+fpp+P4qa31e00yqIg+YEAPX1uEE8+WXnhvebNtk3UzHdY+G/Vp/Z8zytffyXU2npr+V1c+R+srYtZ8/BcpR2hCLyqQKkZfF/5fjd2aYRj+NblELy6e0f6ZhFmsERYR+oRABQT68bVqYb8Ui0y2+tOze1O8RPa9kuPbkn5dFzUc5PRf/Z87D8f3sXkS0+v/eiqlv7eOceUn7eKLMcytBl9mLsifb8Kn596nPOijCDY5Tr4KpZ231YAoA6ep2YLZJ7tmmf31o/ClB+5hkRF/7rfU62POb0MUIneK1AuDtKt1eMtu48l9tSs717H7+9hfJa/fxeRdDIj81c8cRjKeXPH+G4vc0cAiy3e8btpzIBAPCUFh2dWmsAPG3mjgO89XpufO36efKxkE8Bw1P7vlb4P3XP6DmroVZoc+czexaTvg/W7T0K0iOIK7dl5vUAZtteHiYAAGrr9SjAmc9sORLji5doWnfA14KHlmsQlJ/7xL2jxf71HIHuPf29/PxexeSMxWMvn2ZzOHbHzbztPEAAwBFuHP9oh2OWU816T9sbgWuI2fU8h3sXj+U2vP+9xr2tVbDRu+1GWchzlG2ZdSS5p7UQp1eYNduxm2lbaeC/3hsAk1HMHteyrc6MbI22gjnMpPXU//c1NEqHu9Y04HIUusV0+PdntVIWaSMcv9fr9zHssRYM1/U8pxw7QhAAAE8ZPSVvuYjmqG0AR/S4jntN+T/qagFZFv4t2rb38etRZB/Ru5AUEF9XBoMtj59jx/QEAEALrUa2Pn0pt/7iHjkAgbNar4I/avH/dqaA3Cr8WxcuLc1w/xtxhgLHjDrDBIYnAACe1CMlP/qZT3UWRh3tgit6XL/vz53hWjpSgPQs/FsX4bUekWipZxFpJPm+XsfPsWNaAgDgaV/Fr086M/r/1Bf38ufP0gGGPb2mR89irQD5ev0shnsHGi0LpNmO3+vVp4hUPNbT+vg5dkxNAAC00OPVXb2+oGfr+MIRrV6ZOWPx+HptFyA9C/+1tnzyOM58/F6v/qvKc0+PEMexY0oCAKCF1s/dr/2ZZ//hnNZvzJjdcrQ/23PJUfazdYiheKyrd18DpiAAAFqLnMzPPgIGa1q9MSPStTPSfjh+10Tal4wcP9ggAABa6ZXMtxr919kgmh6v1prdKAsXlu0Z8VWDTxl58Vo+a92Wjh3TEQAALbUcIS9DgBYidYLJ7enFMt9cL896+jhGPn49vquoo1Vfw7FjSgIAoJdIHUdT/+E6187cIh6/aPuTmWMJBQEA0Fq06XI6F3CNa+cZrQryDMfPQpjzat3XiNSvITgBANDDV/Hr7CKOgJFX61XQXTvPaFGQRD5+LddQeFNEPuPp4xf1GiAoAQDQS4TXZM287fDJ0++MZ16OX10K/2e0mAXg2DEdAQDQS5RHASKPgMHTXDvzynDvi/I9BfA/AgBgBDN2Ii38B/corOpzT3qOdp2b4wf/TwAA9GR0BcaigISffE/NrdXxc54wjT+9NwAmNuqNfrbO+3IkfdQ2LRn9h+tcP897ev0Gx+8Z2pYnLM+pUftZzvmGBABwjRvVM2YIARx7gJye/I5S+M9rlmM36jaO3u8LRwAA5416oxr1xn7EbKMeM20rXDHqfY6+st73su53NDMMMjxlxP12XXViDQA4zw3rGV/FryOaLaiA0bh2nqV9nzNiAcUxmQv/kTkmnQgA4Dw3rOeM3LY61lDHyNf5zFq1q+MH3KVP1ZEAABjJqCPsy8VzRts2qKnV+e06mpvjB9whSOxIAACMaMRCe8RtAijpWD/L9wAwNQEAMJrROlejbQ8AAFwiAABGNMqjAKb+k4mRY9jm8ZgYtC/pCQCA0fX+slb8AwAQggAAGJXX9gCQje894FECAAAA+ExxDkxPAACwz0wEAABCEAAAoxrh2fvvjd8DAMB0BADAiEYqvEcIIgAA4DYBADCq0abej7Y9AABwigAAGM2II+4KfzIQcgHRuceRngAAGMlIU//XKJAA8hotnAY4TQAAjGbUInv0cAKA57jvAyEIACCWmTsoI079L82wjQBPyn4PnPl7FkAAAMFE6JjN0LkadZYCzMD186wW3wOOH7N58rqI0PcikT+9NwAm5EZf30wj6zNtKwBz8L3yHN/b9p8FAQBcM/Lox2w3+eUX88jtuvTeZp0KOMc186yn29fxY2ZP9jFmuDZm6WPxMAEAXDf6jX42M34xCQGIyjT9+Thmz2l5n/d9Qm1fG78nKWsAAD0tR9JnM+M2wyh0Quc18337rqf3OWObtuB+AwsCAKCXCB2dzB1hYmq5gJzrBnia+w0UBABAT1GKZ6MLRBLhmszOPakej3mxx7nBdAQAQA+ROlRGF+CaKAFgVtmO35P7GuX7cDSt+hqR+jQkIAAAWptx1f8jsnWG4Q7XyjNa3Yccv/oUkc9xvsKCAADopcUX8ter7TPNEEmLa0fBM7fox09RPi/HDjYIAICWWn8hvwvzllMAhQHMrvUosmvmGU/f9zIdvwz7GJVHN6AgAACi6vWYgRAAznHNzC3q8WsVWCsi62s52GCmAdMRAMA5bvLXLUfIn+4sfhW/lr9/SsRO8Ii0czutRpGppyzInzyGkY9fyxBZEfmMyOcnXCYAAFpo2bkpO209RqeijoiNQkf5ea3P4UjXTIuQ84yntyXi40+R9iWbVuej7yGmJQAAWur1Sp6vlT978rOB4yJdM+/7zChvOnn6nhexCGr5ppqI7ddT6zDKzA2mJAAAnlZ+QfbuELcQcUSMvCyiecxaMdDqsadSj4UcZz9+JUXkXHrMNIQpCQCAVlq99m+rE9ByFkD5mTCj1ufvzEVkucbJ8p+v17z7dcbMx++t5T4oIutpOWtj7TNhKgIA4EmjdqY8CgDjmq2I/HSfK9cj6RGqtDTb8XvrEWAoIu9rXfw7XkxPAAA8pUfH5tNnGtGEc9beqPGknot3nrUc4f+0rWuzASI+Xz7T8VvqMTuM+3qM/JefC9MRAABP6z31f+//aWW2zjAstT53Zygir07t7xEEtC5WZjh+b2WIo4icw/K4vf8dOEgAAOf4kjlm5JHvHrMAYGY91s8YuYisUXgs9+/J4rNXgTny8XtbbiPz6PmmjR73QqhOAADUNstUSgsCwth6Pju/peao43Kfvlb+rLYej2S9P3eU4/fW83EMReQ1a6P+rY/brEa69hjAn94bAITVcjGeK9P/e0z1nLkDQW7LoqXHDJqr1/qT2/HUz37/Wa397FlwjnL83p48jmvKgMF3wHmtj9naZy//3TFkegIAOMeNf9+IC/9taV3QLD/LeQTnrD1z3/JtHi2Kj7XHAl6LP6uh10yktWnbvR4pWf57q88t/8x3wLayzcpg7P1npv4fN+t28xABAJwz8xdAC7O+iqdlZ2L2jgR59ZoF8Lb37G/t62lrVL6FJ2YELI9dz+P33panAo69zyz/rDX3/J/2jkPZVmsj8a1EOG76HPwgAIBzRuhE3PHkF0A5wt1yVP2q1sW4L2Gi6F1Evrfh059f/bkj3Otr3y9GCR8/rXtwd/uOnCOtjfIIRE132/NTO4zQx4py3Jb36xHa9ayZ235IAgA4x7Pc68ovx1bPVY7+M9d4FICZjXTuliPK5Z+fsbY/vTvKTxYfIyxKuvUox9p2be3/kf92bUp5zxksETyxH73Pxy0RjluEfaAiAQCcN+qX1J5WnfbWbVNjf3oVNCMVUnBG70cBSnuj91d/ziieCjpHuu/cOX57/+1W2/X4nhqtze8Y6dp/UrR9nHFfolwzwxEAAHe17gw8Ofo/y6ML2Wm/cYzWSR5pW+742vh9rZ89ahF35lGA0bZ9TdT71Axtf0e00AZ+EAAAd7T+gnyyU9yDTgaz2ltUbsTCckZP3xu2QoBRjt8I23BHlOfHs3GsCO+/3hsAhNCyo/ZUZ6rHgoAws61C0bl9T4t70V6Y6vjdp/ifk+NGCgIA4KoeU/9baf1ZOtzn6JiNwyyWuno9TvVV/Mp9rou5KP5JQwAAXNHrC7LFqFjr2Qw9PhdqEgLU0eMRpzIEcB+6z/Uwn/cxc9xIQQAA3BFx9L/1Z+pwE4Gi556eo48K/3pcB/NZmwkDoQkAgLN6LfzX6nN7dYZ1wolCJ/qcEaYel4s6cp7ify7LBUyd96QiAACuirDw35bWz8Mq/M/RXmMyknbeCMX/kuN33tqbMBjbaNcdNCUAAM6IvPBfqUdHWCeS2elYHzdaW5WFrFHRz8pjqL3GtjzHR7nuoDkBAHBU1IX/tlgQEK4ztXbfaMX/knvQMSMfQ35bHq/lv0M6AgDgrB6vqOrt6Y5C2TGBCDwSsG6GEUgzAfYp/uexNurvmJGaAAA4ovfiVL20CiHK9h0p/IA7FJL/rE2xH9myaHr/e3amkM9jeb9R+MOCAAA4ovUI9WirKbfYlu/iVyEAUSgk5y1EZgstnjTrMczk6/W78H+9HCv4QQAAfFIWpk8b7Yu6HJlv8XkKf6LJXEhGmC6eeQq1Uf/xlUV/xvsMHPan9wYAQ2u96n/5uaNoMSOhHCVt9bkz0h7z2goBIoZe0UaMt/Yn4rF7vX6fn7Mfv4jW7iGOE3wgAABGMsMX91OBSPkzdTiJam16bqSZL9GnH2+t6xDt+L1eccKbKMrjUAbmwAECAPYoQHIz+v9Tr9F4swCIaq9Qnq2YzDYSuRXiLP9sJmuFpcK/r622V/TDTQIAYE2PDtxMhW7rtwPM1DZw1szFZLbCv7R37F7F341oK3TKdAx7+9TW5fnj2MBNAoAY3Az/+Sp+5ZrWC9/NYlmIa5dtT6+VMCv3p32fiskRCklTkNetBTZr53vvY7h2jKIGN7Ptz9q5kfG7Ntv+0sHX93fvezE3tDx4s9yQnND7jhzH3q+hG/1c632Ojdw+Wd8UcZR79nlHirOn2tUU5PuOtFXr47f8zIjHr/d31BURj8NZMx63VpwflQkAAIAZ9JoKbApyHb2CE8cPYMEjAADADM4+W3600Kv1c9h3ZW2AvVkDR9eJcPwAFswAAACi2+rsKA7HZwQfoCIzAACA6BSN83LsACr6r/cGAAAAAM8TAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkMD/AXbk8TXH98fGAAAAAElFTkSuQmCC" alt="Texticode" style="height:60px;width:60px;object-fit:contain;" />
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
            <button class="btn-primary btn-icon" @click="descargar(ordenSeleccionada)">
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
        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="18" height="18">
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

const busqueda          = ref('')
const ordenSeleccionada = ref(null)
const mounted           = ref(false)
const toastMsg          = ref('')
const cargando          = ref(true)
const fechaHoy          = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })

// ── Contadores animados ──
const displayTotalClientes = ref(0)
const displayActivos       = ref(0)
const displayOrdenes       = ref(0)

function animateCount(targetRef, target) {
  let val = 0
  const step = Math.max(1, Math.ceil(target / 40))
  const id = setInterval(() => {
    val += step
    if (val >= target) { targetRef.value = target; clearInterval(id) }
    else targetRef.value = val
  }, 20)
}

// ── Datos ──
const clientes = ref([])
const ordenes  = ref([])

// ── CARGA DESDE LA BD ──
async function cargarDatos() {
  cargando.value = true
  try {
    // Traemos todos los usuarios y filtramos los que tienen Rol = 'cliente'
    const [dataUsuarios, dataOrdenes, dataComprobantes] = await Promise.all([
      getUsuarios(),
      getOrdenes(),
      getComprobantes(),
    ])

    // Clientes: usuarios cuyo rol sea 'cliente' (acepta variantes del nombre)
    clientes.value = dataUsuarios
      .filter(u => (u.Nombre_Rol || u.Rol || '').toLowerCase() === 'cliente' && u.Estado === 'activo')
      .map(u => ({
        id:        u.Id_Usuario,
        nombre:    u.Nombre_Completo || u.Nombre_Usuario || '',
        email:     u.Correo         || '',
        telefono:  u.Telefono       || '—',
        estado:    u.Estado === 'activo' ? 'Activo' : 'Inactivo',
        iniciales: (u.Nombre_Completo || u.Nombre_Usuario || '?')
                     .split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase(),
      }))

    // Mapa id_cliente → nombre para enriquecer las órdenes
    const mapaClientes = {}
    clientes.value.forEach(c => { mapaClientes[c.id] = c.nombre })

    // Órdenes enriquecidas con datos de comprobante si existe
    const mapaComp = {}
    dataComprobantes.forEach(c => { mapaComp[c.Id_Orden] = c })

    ordenes.value = dataOrdenes
      .filter(o => mapaClientes[o.Id_Cliente])   // solo órdenes de clientes
      .map(o => {
        const comp       = mapaComp[o.Id_Orden]
        const estadoComp = comp?.Estado || o.Estado
        const esEntregado= estadoComp === 'Entregado' || o.Estado === 'Completada'
        // Buscar datos del cliente para el comprobante
        const clienteInfo = clientes.value.find(c => c.id === o.Id_Cliente) || {}
        return {
          id:             o.Id_Orden,
          numero:         String(o.Id_Orden).padStart(4, '0'),
          cliente:        mapaClientes[o.Id_Cliente] || `Cliente #${o.Id_Cliente}`,
          clienteEmail:   clienteInfo.email    || '—',
          clienteTel:     clienteInfo.telefono || '—',
          fecha:          o.Fecha_Limite?.split('T')[0] || o.Fecha_Limite || '—',
          fechaCreacion:  o.Fecha_Creacion?.split('T')[0] || o.Fecha_Inicio?.split('T')[0] || '—',
          productos:      o.Producto      || o.Descripcion || '—',
          descripcion:    o.Descripcion   || o.Producto    || '—',
          cantidad:       o.Cantidad      || 1,
          unidad:         o.Unidad        || 'unidad(es)',
          observaciones:  o.Observaciones || o.Notas || '',
          estado:         esEntregado ? 'Entregado' : 'Pendiente',
          estadoClass:    esEntregado ? 'success' : 'danger',
          productosList:  [o.Producto || o.Descripcion || '—'],
          flash:          false,
        }
      })

  } catch (e) {
    console.error('Error cargando datos de clientes:', e)
    clientes.value = []
    ordenes.value  = []
  } finally {
    cargando.value = false
  }
}

// ── Ordenamiento ──
const sortKeyClientes = ref('nombre')
const sortDirClientes = ref(1)
const sortKeyOrdenes  = ref('numero')
const sortDirOrdenes  = ref(1)

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
const avatarPalette = ['#dbeafe', '#fce7f3', '#d1fae5', '#fef3c7', '#ede9fe']
function avatarColor(iniciales) {
  return avatarPalette[(iniciales?.charCodeAt(0) || 0) % avatarPalette.length]
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
    mounted.value = true
    animateCount(displayTotalClientes, clientes.value.length)
    animateCount(displayActivos,       clientes.value.filter(c => c.estado === 'Activo').length)
    animateCount(displayOrdenes,       ordenes.value.length)
  }, 80)
})
</script>

<style scoped>
.layout  { display: flex; min-height: 100vh; }
.content { flex: 1; padding: 28px 30px; }

h1 {
  font-size: 26px; font-weight: 600; color: #111827;
  padding-bottom: 16px; margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  opacity: 0; transform: translateY(-10px);
  transition: opacity .4s ease, transform .4s ease;
}
h1.fade-in { opacity: 1; transform: translateY(0); }

.search {
  width: 300px; padding: 9px 12px 9px 36px;
  border-radius: 8px; border: 1px solid #e5e7eb;
  margin-bottom: 20px; font-size: 14px; outline: none;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='%239ca3af' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z'/%3E%3C/svg%3E") no-repeat 10px center;
  transition: border-color .2s, box-shadow .2s;
}
.search:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }

.cards { display: flex; gap: 20px; margin-bottom: 30px; }
.card {
  background: white; flex: 1; padding: 20px;
  border-radius: 12px; border: 1px solid #e5e7eb;
  opacity: 0; transform: translateY(16px);
  transition: opacity .4s ease, transform .4s ease, box-shadow .2s;
}
.card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); transform: translateY(-2px) !important; }
.card-visible { opacity: 1; transform: translateY(0); }
.card h3 { font-size: 14px; color: #6b7280; font-weight: 500; margin: 0; }
.card p  { font-size: 26px; font-weight: 700; margin: 10px 0 0 0; }
.green { color: #16a34a; }
.blue  { color: #2563eb; }

.table-container {
  background: white; padding: 20px;
  border-radius: 12px; border: 1px solid #e5e7eb;
  margin-bottom: 30px;
  opacity: 0; transform: translateY(12px);
  transition: opacity .45s ease, transform .45s ease;
}
.section-visible { opacity: 1; transform: translateY(0); }
.table-container h2 { font-size: 16px; margin-bottom: 10px; }

table { width: 100%; border-collapse: collapse; }
th    { text-align: left; font-size: 13px; font-weight: 500; color: #6b7280; padding: 12px 0; user-select: none; }
td    { padding: 14px 0; border-top: 1px solid #f3f4f6; font-size: 14px; color: #374151; }

.sortable       { cursor: pointer; }
.sortable:hover { color: #374151; }
.sort-icon      { font-size: 11px; margin-left: 4px; opacity: .6; }

.table-row            { transition: background .18s; }
.table-row:hover      { background: #f9fafb; }

@keyframes rowFlash { 0% { background: #d1fae5; } 100% { background: transparent; } }
.row-flash { animation: rowFlash 1.2s ease; }

.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar    { width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #374151; }

.badge   { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
.success { background: #dcfce7; color: #15803d; }
.danger  { background: #fee2e2; color: #b91c1c; }

.section-title { display: flex; align-items: center; gap: 8px; font-size: 16px; }
.section-icon  { width: 20px; height: 20px; }

.actions  { display: flex; align-items: center; gap: 8px; }
.icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border: 1px solid #e5e7eb;
  border-radius: 8px; background: white; cursor: pointer;
  transition: background .15s, transform .15s;
}
.icon-btn svg    { width: 18px; height: 18px; }
.icon-btn:hover  { background: #f3f4f6; transform: scale(1.08); }
.icon-btn:active { transform: scale(.95); }

.empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 36px 0; color: #9ca3af; font-size: 14px; }

.modal {
  position: fixed; inset: 0; background: rgba(0,0,0,.45);
  backdrop-filter: blur(2px);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
  padding: 20px;
}

/* ══ COMPROBANTE PROFESIONAL ══════════════════════════════ */
.cp-wrap {
  background: #fff;
  width: 740px; max-width: 100%;
  max-height: 90vh; overflow-y: auto;
  border-radius: 4px;
  box-shadow: 0 8px 40px rgba(0,0,0,.18);
  font-family: 'Georgia', 'Times New Roman', serif;
}

/* Encabezado */
.cp-head {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 22px 32px;
  background: #0f2236;
}
.cp-empresa-nombre { color: #fff !important; }
.cp-empresa-datos  { color: #93c5fd !important; }
.cp-doc-titulo     { color: #93c5fd !important; }
.cp-doc-numero     { color: #fff !important; }
.cp-head-left  { display: flex; align-items: center; gap: 14px; }
.cp-logo       { flex-shrink: 0; }
.cp-empresa-nombre {
  font-size: 20px; font-weight: 700; letter-spacing: 3px;
  color: #1f3b57; font-family: Arial, sans-serif;
}
.cp-empresa-datos  { font-size: 11px; color: #6b7280; margin-top: 3px; font-family: Arial, sans-serif; }

.cp-head-right     { text-align: right; }
.cp-doc-titulo     { font-size: 13px; font-weight: 600; letter-spacing: 2px; color: #6b7280; font-family: Arial, sans-serif; text-transform: uppercase; }
.cp-doc-numero     { font-size: 26px; font-weight: 700; color: #1f3b57; font-family: Arial, sans-serif; margin-top: 4px; }

/* Líneas divisoras */
.cp-linea-doble {
  border: none;
  border-top: 3px double #1f3b57;
  margin: 0 32px;
}
.cp-linea-simple {
  border: none;
  border-top: 1px solid #d1d5db;
  margin: 0 32px;
}

/* Bloque info: cliente + fechas + estado */
.cp-info-row {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
  padding: 22px 32px;
  border-bottom: 1px solid #e5e7eb;
}
.cp-info-bloque { padding-right: 20px; }
.cp-info-bloque--center { border-left: 1px solid #e5e7eb; padding-left: 20px; border-right: 1px solid #e5e7eb; padding-right: 20px; }
.cp-info-bloque--right  { padding-left: 20px; padding-right: 0; }

.cp-label       { font-size: 9px; font-weight: 700; letter-spacing: 2px; color: #9ca3af; text-transform: uppercase; font-family: Arial, sans-serif; margin-bottom: 5px; }
.cp-valor-grande{ font-size: 14px; color: #111827; line-height: 1.4; }
.cp-valor-sub   { font-size: 12px; color: #6b7280; margin-top: 2px; font-family: Arial, sans-serif; }

.cp-estado-caja {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 2px;
  font-size: 12px; font-weight: 700;
  font-family: Arial, sans-serif;
  letter-spacing: .5px;
  margin-top: 4px;
}
.cp-estado-caja.success { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.cp-estado-caja.danger  { background: #fffbeb; color: #92400e; border: 1px solid #fcd34d; }

/* Tabla de productos */
.cp-tabla { width: 100%; border-collapse: collapse; margin: 0; }
.cp-th {
  padding: 10px 12px 10px 32px;
  font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
  color: #fff; background: #1f3b57;
  text-transform: uppercase; font-family: Arial, sans-serif;
  text-align: left;
}
.cp-th--num    { width: 44px; padding-left: 32px; }
.cp-th--centro { text-align: center; }
.cp-th--right  { text-align: right; padding-right: 32px; }

.cp-tr { border-bottom: 1px solid #f3f4f6; }
.cp-tr:nth-child(even) { background: #f9fafb; }

.cp-td { padding: 13px 12px 13px 32px; font-size: 13px; color: #374151; vertical-align: top; }
.cp-td--num    { color: #9ca3af; font-size: 12px; width: 44px; font-family: Arial, sans-serif; }
.cp-td--centro { text-align: center; font-family: Arial, sans-serif; }
.cp-td--right  { text-align: right; padding-right: 32px; }

.cp-prod-nombre { font-weight: 600; color: #111827; }
.cp-prod-desc   { font-size: 12px; color: #6b7280; margin-top: 3px; font-family: Arial, sans-serif; }

.cp-entrega-badge {
  font-size: 11px; font-weight: 600; font-family: Arial, sans-serif;
  padding: 3px 10px; border-radius: 2px;
}
.cp-entrega-badge.success { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.cp-entrega-badge.danger  { background: #fffbeb; color: #92400e; border: 1px solid #fcd34d; }

/* Observaciones + Firmas */
.cp-bottom {
  display: flex; gap: 32px;
  padding: 22px 32px 28px;
}
.cp-observaciones { flex: 1; }
.cp-obs-caja {
  margin-top: 8px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  font-size: 12px; color: #374151; line-height: 1.6;
  min-height: 64px;
  font-family: Arial, sans-serif;
}

.cp-firmas { display: flex; gap: 28px; align-items: flex-end; flex-shrink: 0; }
.cp-firma-bloque { text-align: center; }
.cp-firma-linea  { width: 130px; border-top: 1px solid #374151; margin-bottom: 6px; }
.cp-firma-nombre { font-size: 11px; color: #374151; font-family: Arial, sans-serif; }
.cp-firma-cargo  { font-size: 11px; font-weight: 600; color: #1f3b57; font-family: Arial, sans-serif; }

/* Pie de página */
.cp-pie {
  background: #1f3b57;
  padding: 10px 32px;
  display: flex; justify-content: space-between;
  font-size: 10px; color: #93c5fd;
  font-family: Arial, sans-serif;
  letter-spacing: .3px;
}

/* Botones */
.cp-acciones {
  display: flex; justify-content: flex-end; gap: 12px;
  padding: 16px 32px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.btn-primary        { background: #1f3b57; color: white; padding: 8px 14px; border-radius: 8px; border: none; cursor: pointer; transition: background .2s; }
.btn-primary:hover  { background: #2d5580; }
.btn-secondary      { background: #f3f4f6; color: #374151; padding: 8px 14px; border-radius: 8px; border: 1px solid #e5e7eb; cursor: pointer; transition: background .2s; }
.btn-secondary:hover{ background: #e5e7eb; }
.btn-icon      { display: flex; align-items: center; gap: 8px; }
.icon-download { width: 18px; height: 18px; }

.modal-enter-active, .modal-leave-active { transition: opacity .25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.toast {
  position: fixed; bottom: 28px; right: 28px;
  background: #111827; color: white;
  padding: 12px 18px; border-radius: 10px;
  font-size: 14px; display: flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,.2); z-index: 2000;
}
.toast-enter-active, .toast-leave-active { transition: opacity .3s ease, transform .3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }

.row-enter-active, .row-leave-active { transition: opacity .3s ease; }
.row-enter-from, .row-leave-to       { opacity: 0; }
</style>