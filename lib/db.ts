import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export type Building = {
  id: number
  name: string
  code: string
  address: string
  total_area_sqm: number
  floors: number
  year_built: number
  created_at: string
}

export type Room = {
  id: number
  building_id: number
  name: string
  room_number: string
  floor: number
  capacity: number
  room_type: "lecture_hall" | "lab" | "office" | "conference" | "common_area"
  has_projector: boolean
  has_whiteboard: boolean
  has_video_conferencing: boolean
  is_accessible: boolean
  created_at: string
}

export type EnergyReading = {
  id: number
  building_id: number
  reading_timestamp: string
  electricity_kwh: number
  gas_m3: number
  water_liters: number
  solar_generation_kwh: number
  temperature_celsius: number
}

export type Reservation = {
  id: number
  room_id: number
  user_name: string
  user_email: string
  title: string
  description: string
  start_time: string
  end_time: string
  status: "pending" | "confirmed" | "cancelled"
  attendees_count: number
  is_recurring: boolean
  created_at: string
}

export type PresenceRecord = {
  id: number
  room_id: number
  recorded_at: string
  occupancy_count: number
  max_capacity: number
  sensor_type: "wifi" | "camera" | "badge" | "manual"
}

export type MaintenanceTicket = {
  id: number
  room_id: number | null
  building_id: number
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "open" | "in_progress" | "pending_parts" | "resolved" | "closed"
  category: "electrical" | "plumbing" | "hvac" | "structural" | "cleaning" | "security" | "it"
  reported_by: string
  assigned_to: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
}

export type Equipment = {
  id: number
  room_id: number | null
  building_id: number
  name: string
  equipment_type: string
  serial_number: string
  purchase_date: string
  warranty_expires: string | null
  last_maintenance: string | null
  next_maintenance: string | null
  status: "operational" | "maintenance" | "repair" | "decommissioned"
}
