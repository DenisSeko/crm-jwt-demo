-- Kreiranje tablica ako ne postoje
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  owner_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Očisti postojeće podatke i ubaci demo podatke
DELETE FROM notes;
DELETE FROM clients;
DELETE FROM users;

-- NOVI HASH za "demo123" koji SIGURNO radi
INSERT INTO users (email, password_hash, name) VALUES
('demo@demo.com', '$2b$10$ZDbMMunC5KeZjUCG4qJTA.SNBB3ypob3LIU.34jAIXpoORFDY.D/C', 'Demo User'),
('ivan.horvat@example.com', '$2b$10$ZDbMMunC5KeZjUCG4qJTA.SNBB3ypob3LIU.34jAIXpoORFDY.D/C', 'Ivan Horvat');

-- Demo klijenti
INSERT INTO clients (name, email, company, owner_id) VALUES
('Marko Marković', 'marko.markovic@firma.hr', 'IT Solutions d.o.o.', 1),
('Petra Horvat', 'petra.horvat@primjer.hr', 'Digital Agency', 1),
('Ivana Kovačić', 'ivana.kovacic@tvrtka.hr', 'Web Studio', 1),
('Ana Marić', 'ana.maric@kompanija.hr', 'Tech Innovations', 2);

-- Demo bilješke
INSERT INTO notes (user_id, client_id, title, content) VALUES
(1, 1, 'Prvi sastanak', 'Razgovarali o novom web projektu. Klijent želi moderni dizajn s e-trgovinom. Rok: 3 mjeseca.'),
(1, 1, 'Povratne informacije', 'Klijent zadovoljan prvim dizajnom. Traži manje promjena u bojama.'),
(1, 2, 'Početna konzultacija', 'Potrebna nova marketinška strategija za društvene mreže. Budžet: 50.000 kn.'),
(1, 3, 'Projektni zahtjevi', 'Klijent treba redesign postojeće web stranice. Naglasak na UX/UI.'),
(2, 4, 'Uvodni razgovor', 'Klijent zainteresiran za mobilnu aplikaciju. Potrebna detaljna analiza.'),
(1, 2, 'Dodatni zahtjevi', 'Klijent želi i SEO optimizaciju uz marketinšku strategiju.');

-- Provjera podataka
SELECT '✅ Users: ' || COUNT(*) FROM users;
SELECT '✅ Clients: ' || COUNT(*) FROM clients;
SELECT '✅ Notes: ' || COUNT(*) FROM notes;
