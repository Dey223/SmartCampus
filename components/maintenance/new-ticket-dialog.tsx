"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface Building {
  id: number
  name: string
  code: string
}

interface Room {
  id: number
  name: string
  roomNumber: string
  buildingId: number
}

interface NewTicketDialogProps {
  buildings: Building[]
  rooms: Room[]
}

export function NewTicketDialog({ buildings, rooms }: NewTicketDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState("")

  const filteredRooms = selectedBuilding ? rooms.filter((r) => r.buildingId.toString() === selectedBuilding) : []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau Ticket de Maintenance</DialogTitle>
          <DialogDescription>Signalez un problème ou une demande de maintenance.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" placeholder="Ex: Climatisation en panne" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electrical">Électricité</SelectItem>
                  <SelectItem value="plumbing">Plomberie</SelectItem>
                  <SelectItem value="hvac">CVC</SelectItem>
                  <SelectItem value="structural">Structure</SelectItem>
                  <SelectItem value="cleaning">Nettoyage</SelectItem>
                  <SelectItem value="security">Sécurité</SelectItem>
                  <SelectItem value="it">Informatique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building">Bâtiment</Label>
              <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.id.toString()}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Salle (optionnel)</Label>
              <Select disabled={!selectedBuilding}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {filteredRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.name} ({room.roomNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Décrivez le problème en détail..." rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reporter">Votre nom</Label>
            <Input id="reporter" placeholder="Jean Dupont" />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button type="submit">Créer le ticket</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
