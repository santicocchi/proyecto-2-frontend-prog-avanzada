"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import WithAuth from "@/components/auth/withAuth"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { useAuth } from "@/components/auth/context/UserContext"

interface ChartConfig {
  id: string
  title: string
  url: string
  roles: string[]
  small?: boolean
  extraSmall?: boolean
}

export default function DashboardPage() {
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [appliedStart, setAppliedStart] = React.useState("")
  const [appliedEnd, setAppliedEnd] = React.useState("")
  const [isApplied, setIsApplied] = React.useState(false)

  const [showSuccessModal, setShowSuccessModal] = React.useState(false)
  const [showErrorModal, setShowErrorModal] = React.useState(false)
  const [successMessage, setSuccessMessage] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")

  const [viewDueño, setViewDueño] = React.useState(false)
  const [viewEmpleado, setViewEmpleado] = React.useState(false)

  const { user, hasRole } = useAuth()

  // ⚡ Configurar vistas según el rol
  React.useEffect(() => {
    if (hasRole("dueño")) setViewDueño(true)
    if (hasRole("empleado")) setViewEmpleado(true)
  }, [user])

  // 📊 Configuración de gráficos
  const charts: ChartConfig[] = [
    {
      id: "ventas-anuales",
      title: "Ventas anuales",
      url: "https://app.chartbrew.com/chart/92f55015-9ef8-4fe3-b247-af9d0b88a3af/share?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidHlwZSI6IkNoYXJ0IiwiaWQiOiIxMjAxNjMiLCJzaGFyZVBvbGljeUlkIjozOX0sImlhdCI6MTc2MTEwOTI3OCwiZXhwIjoxMDQwMTAyMjg3OH0.iuNydC9pzdnxUxbQYKrvAn-qlY-nBAw0Ye_UfDsrU6k&theme=os",
      roles: ["dueño"],
    },
    {
      id: "porcentaje-medio-pago",
      title: "Porcentaje medio de pago",
      url: "https://app.chartbrew.com/chart/4b08123c-2854-4f72-b2a1-4a19549affee/share?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidHlwZSI6IkNoYXJ0IiwiaWQiOiIxMjAxODIiLCJzaGFyZVBvbGljeUlkIjo0Mn0sImlhdCI6MTc2MTExMTY5MCwiZXhwIjoxMDQwMTAyNTI5MH0.ctR6lvZDu3t586HG3f5n8iiV4u30J7uUBJ5xR_6XKjQ&theme=os",
      roles: ["dueño"],
      small: true,
    },
    {
      id: "cantidad-ventas-responsable",
      title: "Cantidad de ventas por responsable",
      url: "https://app.chartbrew.com/chart/c9d11ab4-6a58-4b89-83bb-6b864a825cf7/share?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidHlwZSI6IkNoYXJ0IiwiaWQiOiIxMjAxODUiLCJzaGFyZVBvbGljeUlkIjo0M30sImlhdCI6MTc2MTExMzIyMiwiZXhwIjoxMDQwMTAyNjgyMn0.YwkVwYzqxmqSVTil7iF9ZW_51KqIBoLmI01lFo-gGhI&theme=os",
      roles: ["dueño"],
      small: true,
    },
    {
      id: "cliente-mayor-compra",
      title: "Cliente mayor compra",
      url: "https://app.chartbrew.com/chart/e1272bd9-e37a-4af8-83be-72a88c1cbc65/share?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidHlwZSI6IkNoYXJ0IiwiaWQiOiIxMjAxODAiLCJzaGFyZVBvbGljeUlkIjo0MX0sImlhdCI6MTc2MTExMDkxOCwiZXhwIjoxMDQwMTAyNDUxOH0.vG11ZR5JJR_sjJbeX567-Qn8GXz1n4ceftvIanZ4Ef8&theme=os",
      roles: ["dueño"],
    },
    {
      id: "producto-mas-vendido",
      title: "Producto más vendido",
      url: "https://app.chartbrew.com/chart/b11a3a04-963e-417d-9c30-30720fcaade8/share?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidHlwZSI6IkNoYXJ0IiwiaWQiOiIxMjAxOTciLCJzaGFyZVBvbGljeUlkIjo0NX0sImlhdCI6MTc2MTExNTg4NywiZXhwIjoxMDQwMTAyOTQ4N30.0OaSAFy-nQQCC7ePyrZKMIYliVR34KYVC1qVF_FSzvQ&theme=os",
      roles: ["dueño"],
    },
    {
      id: "cantidad-proveedores-activos",
      title: "Cantidad de proveedores activos",
      url: "https://app.chartbrew.com/chart/6fc428e7-742c-4118-b4a8-02758cf7ef65/share?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidHlwZSI6IkNoYXJ0IiwiaWQiOiIxMjAyNTgiLCJzaGFyZVBvbGljeUlkIjo0OH0sImlhdCI6MTc2MTE3MzkzMSwiZXhwIjoxMDQwMTA4NzUzMX0.8QZyqSdu6Z_fw2HBDYuWwKF4lvhLlRBm9dWYJUSD6V4&theme=os",
      roles: ["dueño", "empleado"],
      extraSmall: true,
    },
    {
      id: "cantidad-lineas-activas",
      title: "Cantidad de líneas activas",
      url: "https://app.chartbrew.com/chart/cde8dafe-a8a6-4961-8fea-3da7181a3b56/share?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidHlwZSI6IkNoYXJ0IiwiaWQiOiIxMjAyNTciLCJzaGFyZVBvbGljeUlkIjo0N30sImlhdCI6MTc2MTE3MzQ1MywiZXhwIjoxMDQwMTA4NzA1M30.MZdslJbRXXl9cf9930mYkFmvg_at7hWbgr0Si1dViRA&theme=os",
      roles: ["dueño", "empleado"],
      extraSmall: true,
    },
    {
      id: "cantidad-marcas-activas",
      title: "Cantidad de marcas activas",
      url: "https://app.chartbrew.com/chart/a1d40ee9-c4eb-43aa-b50e-0951a378f88c/share?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidHlwZSI6IkNoYXJ0IiwiaWQiOiIxMjAyNTQiLCJzaGFyZVBvbGljeUlkIjo0Nn0sImlhdCI6MTc2MTE3MjgyMiwiZXhwIjoxMDQwMTA4NjQyMn0.pF67asVSwVRqTaMhwg-yZ0w4jmUSRk-VWF_vdwdPF4Y&theme=os",
      roles: ["dueño", "empleado"],
      extraSmall: true,
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ""
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`
  }

  const handleApplyDates = () => {
    if (!startDate || !endDate) {
      setErrorMessage("Por favor seleccioná ambas fechas antes de continuar.")
      setShowErrorModal(true)
      return
    }

    if (new Date(endDate) < new Date(startDate)) {
      setErrorMessage("La fecha final no puede ser anterior a la inicial.")
      setShowErrorModal(true)
      return
    }

    setAppliedStart(formatDate(startDate))
    setAppliedEnd(formatDate(endDate))
    setIsApplied(true)
  }

  // 🔧 Render dinámico con agrupación
  const renderChartsForRole = (role: string) => {
    const filteredCharts = charts.filter((chart) => chart.roles.includes(role))
    const elements: JSX.Element[] = []
    let i = 0

    while (i < filteredCharts.length) {
      const current = filteredCharts[i]

      // Agrupar de a 3 extraSmall
      if (current.extraSmall && filteredCharts[i + 1]?.extraSmall && filteredCharts[i + 2]?.extraSmall) {
        const group = [filteredCharts[i], filteredCharts[i + 1], filteredCharts[i + 2]]
        elements.push(
          <div
            key={`extraSmall-${group.map((g) => g.id).join("-")}`}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full justify-items-center"
          >
            {group.map((chart) => (
              <iframe
                key={chart.id}
                src={`${chart.url}&startDate=${appliedStart}&endDate=${appliedEnd}`}
                width="90%"
                height="240"
                className="rounded-lg shadow-md border"
              ></iframe>
            ))}
          </div>
        )
        i += 3
      }

      // Agrupar de a 2 small
      else if (current.small && filteredCharts[i + 1]?.small) {
        const pair = [filteredCharts[i], filteredCharts[i + 1]]
        elements.push(
          <div
            key={`small-${pair.map((g) => g.id).join("-")}`}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full justify-items-center"
          >
            {pair.map((chart) => (
              <iframe
                key={chart.id}
                src={`${chart.url}&startDate=${appliedStart}&endDate=${appliedEnd}`}
                width="90%"
                height="280"
                className="rounded-lg shadow-md border"
              ></iframe>
            ))}
          </div>
        )
        i += 2
      }

      // Individual normal
      else {
        elements.push(
          <div key={current.id} className="w-full flex flex-col items-center">
            <iframe
              src={`${current.url}&startDate=${appliedStart}&endDate=${appliedEnd}`}
              width={current.small || current.extraSmall ? "90%" : "95%"}
              height={current.small || current.extraSmall ? "260" : "340"}
              className="rounded-lg shadow-md border max-w-[1600px]"
            ></iframe>
          </div>
        )
        i++
      }
    }

    return elements
  }

  return (
    <WithAuth>
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        <div className="flex flex-1">
          <QuickNavLeft />

          <main className="flex-1 lg:ml-72 px-6 py-12 flex flex-col items-center text-center space-y-10">
            <div>
              <h1 className="text-4xl font-bold mb-3 text-balance">Panel de Estadísticas</h1>
              <p className="text-lg text-muted-foreground">
                Seleccioná un rango de fechas y aplicá los cambios para visualizar los gráficos
              </p>
            </div>

            {/* Selector de fechas */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex flex-col">
                <label className="text-sm text-muted-foreground mb-1">Desde</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded-md px-3 py-1"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-muted-foreground mb-1">Hasta</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded-md px-3 py-1"
                />
              </div>
              <button
                onClick={handleApplyDates}
                className="mt-2 sm:mt-5 bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition"
              >
                Aplicar
              </button>
            </div>

            {/* Mostrar gráficos */}
            {isApplied ? (
              <div className="flex flex-col gap-10 w-full items-center">
                {viewDueño && renderChartsForRole("dueño")}
                {viewEmpleado && renderChartsForRole("empleado")}
              </div>
            ) : (
              <p className="text-muted-foreground mt-10">
                Seleccioná un rango de fechas y presioná <b>Aplicar</b> para generar los gráficos
              </p>
            )}
          </main>
        </div>
      </div>

      {/* Modales */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold mb-3 text-red-600">Error</h2>
            <p className="text-muted-foreground mb-5">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold mb-3 text-green-600">Éxito</h2>
            <p className="text-muted-foreground mb-5">{successMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </WithAuth>
  )
}
