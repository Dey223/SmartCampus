import { sql } from "@/lib/db"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MaintenanceStats } from "@/components/maintenance/maintenance-stats"
import { TicketsList } from "@/components/maintenance/tickets-list"
import { EquipmentList } from "@/components/maintenance/equipment-list"
import { NewTicketDialog } from "@/components/maintenance/new-ticket-dialog"

async function getMaintenanceData() {
  // Get all tickets
  const tickets = await sql`
    SELECT 
      mt.id,
      mt.title,
      mt.description,
      mt.priority,
      mt.status,
      mt.category,
      mt.reported_by,
      mt.assigned_to,
      mt.created_at,
      mt.updated_at,
      mt.resolved_at,
      b.name as building_name,
      b.code as building_code,
      r.name as room_name,
      r.code as room_number
    FROM maintenance_tickets mt
    JOIN buildings b ON b.id = mt.building_id
    LEFT JOIN rooms r ON r.id = mt.room_id
    ORDER BY 
      CASE mt.priority 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
      END,
      mt.created_at DESC
  `

  // Get equipment
  const equipment = await sql`
    SELECT 
      e.id,
      e.name,
      e.category as equipment_type,
      e.code as serial_number,
      e.purchase_date,
      e.warranty_end as warranty_expires,
      e.last_maintenance,
      e.next_maintenance,
      e.status,
      b.name as building_name,
      r.name as room_name,
      r.code as room_number
    FROM equipment e
    LEFT JOIN rooms r ON r.id = e.room_id
    LEFT JOIN buildings b ON b.id = r.building_id
    ORDER BY e.next_maintenance ASC NULLS LAST
  `

  // Get stats
  const stats = await sql`
    SELECT 
      COUNT(*) FILTER (WHERE status = 'open') as open,
      COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
      COUNT(*) FILTER (WHERE status = 'pending_parts') as pending_parts,
      COUNT(*) FILTER (WHERE status IN ('resolved', 'closed')) as resolved,
      COUNT(*) FILTER (WHERE priority = 'critical' AND status NOT IN ('resolved', 'closed')) as critical,
      COUNT(*) as total
    FROM maintenance_tickets
  `

  const buildings = await sql`SELECT id, name, code FROM buildings ORDER BY name`
  const rooms = await sql`
    SELECT r.id, r.name, r.code as room_number, b.id as building_id 
    FROM rooms r 
    JOIN buildings b ON b.id = r.building_id 
    ORDER BY b.name, r.name
  `

  return {
    tickets: tickets.map(
      (t: {
        id: number
        title: string
        description: string
        priority: string
        status: string
        category: string
        reported_by: string
        assigned_to: string | null
        created_at: string
        updated_at: string
        resolved_at: string | null
        building_name: string
        building_code: string
        room_name: string | null
        room_number: string | null
      }) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        category: t.category,
        reportedBy: t.reported_by,
        assignedTo: t.assigned_to,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        resolvedAt: t.resolved_at,
        buildingName: t.building_name,
        buildingCode: t.building_code,
        roomName: t.room_name,
        roomNumber: t.room_number,
      }),
    ),
    equipment: equipment.map(
      (e: {
        id: number
        name: string
        equipment_type: string
        serial_number: string
        purchase_date: string
        warranty_expires: string | null
        last_maintenance: string | null
        next_maintenance: string | null
        status: string
        building_name: string
        room_name: string | null
        room_number: string | null
      }) => ({
        id: e.id,
        name: e.name,
        equipmentType: e.equipment_type,
        serialNumber: e.serial_number,
        purchaseDate: e.purchase_date,
        warrantyExpires: e.warranty_expires,
        lastMaintenance: e.last_maintenance,
        nextMaintenance: e.next_maintenance,
        status: e.status,
        buildingName: e.building_name,
        roomName: e.room_name,
        roomNumber: e.room_number,
      }),
    ),
    stats: {
      open: Number(stats[0]?.open || 0),
      inProgress: Number(stats[0]?.in_progress || 0),
      pendingParts: Number(stats[0]?.pending_parts || 0),
      resolved: Number(stats[0]?.resolved || 0),
      critical: Number(stats[0]?.critical || 0),
      total: Number(stats[0]?.total || 0),
    },
    buildings: buildings.map((b: { id: number; name: string; code: string }) => ({
      id: b.id,
      name: b.name,
      code: b.code,
    })),
    rooms: rooms.map((r: { id: number; name: string; room_number: string; building_id: number }) => ({
      id: r.id,
      name: r.name,
      roomNumber: r.room_number,
      buildingId: r.building_id,
    })),
  }
}

export default async function MaintenancePage() {
  const data = await getMaintenanceData()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-balance">Module Maintenance</h1>
                <p className="text-muted-foreground">Gestion des tickets et équipements</p>
              </div>
              <NewTicketDialog buildings={data.buildings} rooms={data.rooms} />
            </div>

            {/* Stats Cards */}
            <MaintenanceStats stats={data.stats} />

            {/* Main Content */}
            <Tabs defaultValue="tickets" className="space-y-6">
              <TabsList>
                <TabsTrigger value="tickets">Tickets</TabsTrigger>
                <TabsTrigger value="equipment">Équipements</TabsTrigger>
              </TabsList>

              <TabsContent value="tickets" className="space-y-6">
                <TicketsList tickets={data.tickets} />
              </TabsContent>

              <TabsContent value="equipment" className="space-y-6">
                <EquipmentList equipment={data.equipment} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
