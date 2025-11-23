import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { type Material, type InsertMaterial, type Purchase, type InsertPurchase, type Mason, type InsertMason, type WorkDay, type InsertWorkDay, type Advance, type InsertAdvance, type Meal, type InsertMeal, type GlobalReport, type MasonWithStats } from "@shared/schema";

const dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, "database.sqlite");
const db = new Database(dbPath);

// initialize tables if not exists
db.exec(`
CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  material_id TEXT NOT NULL,
  date TEXT,
  quantity REAL,
  price REAL
);
CREATE TABLE IF NOT EXISTS masons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  salary REAL
);
CREATE TABLE IF NOT EXISTS workdays (
  id TEXT PRIMARY KEY,
  mason_id TEXT NOT NULL,
  date TEXT,
  hours REAL,
  amount REAL
);
CREATE TABLE IF NOT EXISTS advances (
  id TEXT PRIMARY KEY,
  mason_id TEXT NOT NULL,
  date TEXT,
  amount REAL
);
CREATE TABLE IF NOT EXISTS meals (
  id TEXT PRIMARY KEY,
  mason_id TEXT NOT NULL,
  date TEXT,
  amount REAL
);
`);

// Simple helper functions (implement minimal operations used by app)
export class SQLiteStorage {
  insertMaterial(m) {
    const stmt = db.prepare("INSERT INTO materials (id,name) VALUES (?,?)");
    stmt.run(m.id, m.name);
    return m;
  }
  listMaterials() {
    return db.prepare("SELECT * FROM materials").all();
  }
  insertPurchase(p) {
    const stmt = db.prepare("INSERT INTO purchases (id,material_id,date,quantity,price) VALUES (?,?,?,?,?)");
    stmt.run(p.id,p.materialId,p.date,p.quantity,p.price);
    return p;
  }
  listPurchases() {
    return db.prepare("SELECT * FROM purchases").all();
  }
  insertMason(m) {
    const stmt = db.prepare("INSERT INTO masons (id,name,salary) VALUES (?,?,?)");
    stmt.run(m.id,m.name,m.salary || 0);
    return m;
  }
  listMasons() {
    return db.prepare("SELECT * FROM masons").all();
  }
  insertWorkDay(w) {
    const stmt = db.prepare("INSERT INTO workdays (id,mason_id,date,hours,amount) VALUES (?,?,?,?,?)");
    stmt.run(w.id,w.masonId,w.date,w.hours,w.amount);
    return w;
  }
  listWorkDays() {
    return db.prepare("SELECT * FROM workdays").all();
  }
  insertAdvance(a) {
    const stmt = db.prepare("INSERT INTO advances (id,mason_id,date,amount) VALUES (?,?,?,?)");
    stmt.run(a.id,a.masonId,a.date,a.amount);
    return a;
  }
  listAdvances() {
    return db.prepare("SELECT * FROM advances").all();
  }
  insertMeal(m) {
    const stmt = db.prepare("INSERT INTO meals (id,mason_id,date,amount) VALUES (?,?,?,?)");
    stmt.run(m.id,m.masonId,m.date,m.amount);
    return m;
  }
  listMeals() {
    return db.prepare("SELECT * FROM meals").all();
  }
  // other functions can be added as needed based on app usage
}

export const storage = new SQLiteStorage();
