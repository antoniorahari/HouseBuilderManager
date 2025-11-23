import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const materials = pgTable("materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
});

export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  materialId: varchar("material_id").notNull().references(() => materials.id),
  date: timestamp("date").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const masons = pgTable("masons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }).notNull(),
});

export const workDays = pgTable("work_days", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  masonId: varchar("mason_id").notNull().references(() => masons.id),
  date: timestamp("date").notNull(),
  hours: decimal("hours", { precision: 5, scale: 2 }).notNull(),
});

export const advances = pgTable("advances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  masonId: varchar("mason_id").notNull().references(() => masons.id),
  date: timestamp("date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
});

export const meals = pgTable("meals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  masonId: varchar("mason_id").notNull().references(() => masons.id),
  date: timestamp("date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
});

export const insertMaterialSchema = createInsertSchema(materials).omit({ id: true });
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Material = typeof materials.$inferSelect;

export const insertPurchaseSchema = z.object({
  materialId: z.string(),
  date: z.coerce.date(),
  quantity: z.coerce.number().positive(),
  totalPrice: z.coerce.number().positive(),
});
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

export const insertMasonSchema = z.object({
  name: z.string().min(1),
  dailyRate: z.coerce.number().positive(),
});
export type InsertMason = z.infer<typeof insertMasonSchema>;
export type Mason = typeof masons.$inferSelect;

export const insertWorkDaySchema = z.object({
  masonId: z.string(),
  date: z.coerce.date(),
  hours: z.coerce.number().positive(),
});
export type InsertWorkDay = z.infer<typeof insertWorkDaySchema>;
export type WorkDay = typeof workDays.$inferSelect;

export const insertAdvanceSchema = z.object({
  masonId: z.string(),
  date: z.coerce.date(),
  amount: z.coerce.number().positive(),
});
export type InsertAdvance = z.infer<typeof insertAdvanceSchema>;
export type Advance = typeof advances.$inferSelect;

export const insertMealSchema = z.object({
  masonId: z.string(),
  date: z.coerce.date(),
  amount: z.coerce.number().positive(),
});
export type InsertMeal = z.infer<typeof insertMealSchema>;
export type Meal = typeof meals.$inferSelect;

export interface GlobalReport {
  totalMaterialsSpent: number;
  totalMasonsPaid: number;
  totalAdvances: number;
  totalMeals: number;
  totalExpenses: number;
}

export interface MasonWithStats extends Mason {
  totalWorked: number;
  totalAdvances: number;
  totalMeals: number;
  totalPaid: number;
  balance: number;
}

export interface PurchaseWithMaterial extends Purchase {
  materialName: string;
}
