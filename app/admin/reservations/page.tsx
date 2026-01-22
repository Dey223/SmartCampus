import { sql } from "@/lib/db"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReservationCalendar } from "@/components/reservations/reservation-calendar"
import { ReservationsList } from "@/components/reservations/reservations-list"
import { RoomSelector } from "@/components/reservations/room-selector"
import { NewReservationDialog } from "@/components/reservations/new-reservation-dialog"

async function getReservationsData() {
  const reservations = await sql`
    SELECT 
      res.id,
      res.title,
      res.description,
      res.start_time,
      res.end_time,
      res.status,
      res.attendees_count,
      res.user_name,
      res.user_email,
      r.id as room_id,
      r.name as room_name,
      r.code as room_number,
      r.capacity,
      r.room_type,
      b.name as building_name,
      b.code as building_code
    FROM reservations res
    JOIN rooms r ON r.id = res.room_id
    JOIN buildings b ON b.id = r.building_id
    ORDER BY res.start_time DESC
  `

  const rooms = await sql`
    SELECT 
      r.id,
      r.name,
      r.code as room_number,
      r.floor,
      r.capacity,
      r.room_type,
      r.has_projector,
      r.has_whiteboard,
      false as has_video_conferencing,
      false as is_accessible,
      b.name as building_name,
      b.code as building_code
    FROM rooms r
    JOIN buildings b ON b.id = r.building_id
    ORDER BY b.name, r.name
  `

  const buildings = await sql`SELECT id, name, code FROM buildings ORDER BY name`

  return {
    reservations: reservations.map(
      (r: {
        id: number
        title: string
        description: string
        start_time: string
        end_time: string
        status: string
        attendees_count: number
        user_name: string
        user_email: string
        room_id: number
        room_name: string
        room_number: string
        capacity: number
        room_type: string
        building_name: string
        building_code: string
      }) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        startTime: r.start_time,
        endTime: r.end_time,
        status: r.status,
        attendeesCount: r.attendees_count,
        userName: r.user_name,
        userEmail: r.user_email,
        roomId: r.room_id,
        roomName: r.room_name,
        roomNumber: r.room_number,
        capacity: r.capacity,
        roomType: r.room_type,
        buildingName: r.building_name,
        buildingCode: r.building_code,
      }),
    ),
    rooms: rooms.map(
      (r: {
        id: number
        name: string
        room_number: string
        floor: number
        capacity: number
        room_type: string
        has_projector: boolean
        has_whiteboard: boolean
        has_video_conferencing: boolean
        is_accessible: boolean
        building_name: string
        building_code: string
      }) => ({
        id: r.id,
        name: r.name,
        roomNumber: r.room_number,
        floor: r.floor,
        capacity: r.capacity,
        roomType: r.room_type,
        hasProjector: r.has_projector,
        hasWhiteboard: r.has_whiteboard,
        hasVideoConferencing: r.has_video_conferencing,
        isAccessible: r.is_accessible,
        buildingName: r.building_name,
        buildingCode: r.building_code,
      }),
    ),
    buildings: buildings.map((b: { id: number; name: string; code: string }) => ({
      id: b.id,
      name: b.name,
      code: b.code,
    })),
  }
}

export default async function ReservationsPage() {
  const data = await getReservationsData()

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
                <h1 className="text-3xl font-bold tracking-tight text-balance">Module Réservations</h1>
                <p className="text-muted-foreground">Gérer les réservations de salles et équipements</p>
              </div>
              <NewReservationDialog rooms={data.rooms} buildings={data.buildings} />
            </div>

            {/* Main Content */}
            <Tabs defaultValue="calendar" className="space-y-6">
              <TabsList>
                <TabsTrigger value="calendar">Calendrier</TabsTrigger>
                <TabsTrigger value="list">Liste</TabsTrigger>
                <TabsTrigger value="rooms">Salles</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="space-y-6">
                <ReservationCalendar reservations={data.reservations} />
              </TabsContent>

              <TabsContent value="list" className="space-y-6">
                <ReservationsList reservations={data.reservations} />
              </TabsContent>

              <TabsContent value="rooms" className="space-y-6">
                <RoomSelector rooms={data.rooms} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
