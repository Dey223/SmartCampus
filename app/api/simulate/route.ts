import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// IoT Data Simulator - generates realistic sensor data
export async function POST() {
  try {
    const buildings = await sql`SELECT id FROM buildings`

    for (const building of buildings) {
      // Generate energy readings
      const electricity = Math.floor(Math.random() * 800) + 200
      const gas = Math.floor(Math.random() * 50) + 10
      const water = Math.floor(Math.random() * 2000) + 500
      const solar = Math.floor(Math.random() * 300) + 50
      const temperature = Math.floor(Math.random() * 8) + 18

      await sql`
        INSERT INTO energy_readings (building_id, electricity_kwh, gas_m3, water_liters, solar_generation_kwh, temperature_celsius)
        VALUES (${building.id}, ${electricity}, ${gas}, ${water}, ${solar}, ${temperature})
      `
    }

    // Generate presence records for some rooms
    const rooms = await sql`SELECT id, capacity FROM rooms ORDER BY RANDOM() LIMIT 20`

    for (const room of rooms) {
      const occupancy = Math.floor(Math.random() * Number(room.capacity))
      const sensorTypes = ["wifi", "camera", "badge", "manual"]
      const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)]

      await sql`
        INSERT INTO presence_records (room_id, occupancy_count, max_capacity, sensor_type)
        VALUES (${room.id}, ${occupancy}, ${room.capacity}, ${sensorType})
      `
    }

    return NextResponse.json({ success: true, message: "Simulated data generated successfully" })
  } catch (error) {
    console.error("Simulation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate simulated data" }, { status: 500 })
  }
}
