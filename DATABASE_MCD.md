# Modèle Conceptuel de Données - Smart Campus Platform

## Format 1 : Mermaid (pour Markdown/GitHub)

```mermaid
erDiagram
    BUILDINGS ||--o{ ENERGY_READINGS : "consomme"
    BUILDINGS ||--o{ PRESENCE_READINGS : "héberge"
    BUILDINGS ||--o{ RESERVATIONS : "contient"
    BUILDINGS ||--o{ MAINTENANCE_TICKETS : "concerne"
    BUILDINGS ||--o{ COURSES : "accueille"
    
    STUDENTS ||--o{ PRESENCE_READINGS : "pointe"
    STUDENTS ||--o{ ANNOUNCEMENTS : "reçoit"
    
    STAFF_USERS ||--o{ COURSES : "enseigne"
    STAFF_USERS ||--o{ ANNOUNCEMENTS : "envoie"
    STAFF_USERS ||--o{ MAINTENANCE_TICKETS : "signale"
    
    BUILDINGS {
        int id PK
        varchar name
        text address
        decimal total_area
        int floors
        timestamp created_at
    }
    
    ENERGY_READINGS {
        int id PK
        int building_id FK
        varchar reading_type
        decimal value
        varchar unit
        timestamp recorded_at
    }
    
    MAINTENANCE_TICKETS {
        int id PK
        varchar title
        text description
        varchar building
        varchar location
        varchar priority
        varchar status
        timestamp created_at
        timestamp updated_at
    }
    
    RESERVATIONS {
        int id PK
        varchar title
        varchar room
        varchar building
        timestamp start_time
        timestamp end_time
        int attendees
        varchar status
        timestamp created_at
    }
    
    STUDENTS {
        int id PK
        varchar student_number UK
        varchar first_name
        varchar last_name
        varchar email UK
        varchar phone
        date date_of_birth
        varchar program
        varchar level
        varchar year
        varchar address
        varchar city
        varchar postal_code
        varchar country
        timestamp created_at
    }
    
    COURSES {
        int id PK
        varchar course_code
        varchar course_name
        varchar instructor
        varchar building
        varchar room
        date course_date
        time start_time
        time end_time
        int expected_students
        timestamp created_at
    }
    
    ANNOUNCEMENTS {
        int id PK
        varchar title
        text message
        varchar type
        varchar target_audience
        timestamp created_at
    }
    
    STAFF_USERS {
        int id PK
        varchar first_name
        varchar last_name
        varchar email UK
        varchar phone
        varchar department
        varchar position
        date hire_date
        varchar status
        varchar password_hash
        timestamp created_at
        timestamp updated_at
    }
    
    PRESENCE_READINGS {
        int id PK
        int student_id FK
        int building_id FK
        timestamp recorded_at
        varchar method
    }
```

---

## Format 2 : DBML (pour dbdiagram.io)

Copiez ce code sur https://dbdiagram.io/d

```dbml
// Smart Campus Platform - Database Schema

Table buildings {
  id int [pk, increment]
  name varchar(255) [not null]
  address text
  total_area decimal(10,2)
  floors int
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  
  indexes {
    name
  }
}

Table energy_readings {
  id int [pk, increment]
  building_id int [ref: > buildings.id]
  reading_type varchar(50) [not null, note: 'electricity, water, gas']
  value decimal(10,2) [not null]
  unit varchar(20) [not null]
  recorded_at timestamp [not null]
  
  indexes {
    (building_id, recorded_at)
    reading_type
  }
}

Table maintenance_tickets {
  id int [pk, increment]
  title varchar(255) [not null]
  description text
  building varchar(100)
  location varchar(100)
  priority varchar(20) [not null, note: 'low, medium, high, critical']
  status varchar(20) [default: 'pending', note: 'pending, in_progress, resolved']
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
  
  indexes {
    status
    priority
    created_at
  }
}

Table reservations {
  id int [pk, increment]
  title varchar(255) [not null]
  room varchar(100) [not null]
  building varchar(100) [not null]
  start_time timestamp [not null]
  end_time timestamp [not null]
  attendees int
  status varchar(20) [default: 'pending', note: 'pending, confirmed, cancelled']
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  
  indexes {
    (building, room, start_time)
    status
  }
}

Table students {
  id int [pk, increment]
  student_number varchar(50) [unique, not null]
  first_name varchar(100) [not null]
  last_name varchar(100) [not null]
  email varchar(255) [unique, not null]
  phone varchar(20)
  date_of_birth date
  program varchar(100)
  level varchar(50) [note: 'Licence, Master, Doctorat']
  year varchar(20)
  address text
  city varchar(100)
  postal_code varchar(20)
  country varchar(100)
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  
  indexes {
    student_number
    email
  }
}

Table courses {
  id int [pk, increment]
  course_code varchar(50) [not null]
  course_name varchar(255) [not null]
  instructor varchar(255) [not null]
  building varchar(100)
  room varchar(100)
  course_date date [not null]
  start_time time [not null]
  end_time time [not null]
  expected_students int
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  
  indexes {
    course_code
    (building, room, course_date)
  }
}

Table announcements {
  id int [pk, increment]
  title varchar(255) [not null]
  message text [not null]
  type varchar(50) [note: 'info, urgent, event']
  target_audience varchar(100)
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  
  indexes {
    type
    created_at
  }
}

Table staff_users {
  id int [pk, increment]
  first_name varchar(100) [not null]
  last_name varchar(100) [not null]
  email varchar(255) [unique, not null]
  phone varchar(20)
  department varchar(100)
  position varchar(100)
  hire_date date
  status varchar(20) [default: 'active', note: 'active, inactive, on_leave']
  password_hash varchar(255)
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
  
  indexes {
    email
    status
  }
}

Table presence_readings {
  id int [pk, increment]
  student_id int [ref: > students.id]
  building_id int [ref: > buildings.id]
  recorded_at timestamp [not null, default: `CURRENT_TIMESTAMP`]
  method varchar(50) [note: 'fingerprint, card, facial']
  
  indexes {
    (student_id, recorded_at)
    building_id
  }
}
```

---

## Format 3 : PlantUML (pour draw.io ou PlantUML)

```plantuml
@startuml Smart_Campus_MCD

entity "buildings" as buildings {
  * id : int <<PK>>
  --
  * name : varchar(255)
  address : text
  total_area : decimal(10,2)
  floors : int
  created_at : timestamp
}

entity "energy_readings" as energy {
  * id : int <<PK>>
  --
  * building_id : int <<FK>>
  * reading_type : varchar(50)
  * value : decimal(10,2)
  * unit : varchar(20)
  * recorded_at : timestamp
}

entity "maintenance_tickets" as tickets {
  * id : int <<PK>>
  --
  * title : varchar(255)
  description : text
  building : varchar(100)
  location : varchar(100)
  * priority : varchar(20)
  * status : varchar(20)
  created_at : timestamp
  updated_at : timestamp
}

entity "reservations" as reservations {
  * id : int <<PK>>
  --
  * title : varchar(255)
  * room : varchar(100)
  * building : varchar(100)
  * start_time : timestamp
  * end_time : timestamp
  attendees : int
  status : varchar(20)
  created_at : timestamp
}

entity "students" as students {
  * id : int <<PK>>
  --
  * student_number : varchar(50) <<UK>>
  * first_name : varchar(100)
  * last_name : varchar(100)
  * email : varchar(255) <<UK>>
  phone : varchar(20)
  date_of_birth : date
  program : varchar(100)
  level : varchar(50)
  year : varchar(20)
  address : text
  city : varchar(100)
  postal_code : varchar(20)
  country : varchar(100)
  created_at : timestamp
}

entity "courses" as courses {
  * id : int <<PK>>
  --
  * course_code : varchar(50)
  * course_name : varchar(255)
  * instructor : varchar(255)
  building : varchar(100)
  room : varchar(100)
  * course_date : date
  * start_time : time
  * end_time : time
  expected_students : int
  created_at : timestamp
}

entity "announcements" as announcements {
  * id : int <<PK>>
  --
  * title : varchar(255)
  * message : text
  type : varchar(50)
  target_audience : varchar(100)
  created_at : timestamp
}

entity "staff_users" as staff {
  * id : int <<PK>>
  --
  * first_name : varchar(100)
  * last_name : varchar(100)
  * email : varchar(255) <<UK>>
  phone : varchar(20)
  department : varchar(100)
  position : varchar(100)
  hire_date : date
  * status : varchar(20)
  password_hash : varchar(255)
  created_at : timestamp
  updated_at : timestamp
}

entity "presence_readings" as presence {
  * id : int <<PK>>
  --
  * student_id : int <<FK>>
  * building_id : int <<FK>>
  * recorded_at : timestamp
  method : varchar(50)
}

' Relations
buildings ||--o{ energy : "consomme"
buildings ||--o{ presence : "héberge"
students ||--o{ presence : "pointe"

@enduml
```

---

## Instructions d'utilisation

### Pour Mermaid (GitHub/Markdown)
1. Copiez le code Mermaid
2. Collez-le dans un fichier `.md`
3. GitHub l'affichera automatiquement
4. Ou utilisez https://mermaid.live pour prévisualiser

### Pour dbdiagram.io (Recommandé !)
1. Allez sur https://dbdiagram.io/d
2. Collez le code DBML
3. Le diagramme se génère automatiquement
4. Exportez en PNG/PDF/SQL

### Pour PlantUML
1. Installez PlantUML ou utilisez https://plantuml.com/
2. Collez le code
3. Générez le diagramme

---

## Statistiques du Modèle

- **9 tables** principales
- **3 relations** clés (FK)
- **15 index** pour performance
- **Auto-increment** sur tous les ID
- **Timestamps** automatiques
- **Contraintes** de validation

