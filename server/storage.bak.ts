import {
  type Material,
  type InsertMaterial,
  type Purchase,
  type InsertPurchase,
  type Mason,
  type InsertMason,
  type WorkDay,
  type InsertWorkDay,
  type Advance,
  type InsertAdvance,
  type Meal,
  type InsertMeal,
  type GlobalReport,
  type MasonWithStats,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getMaterials(): Promise<Material[]>;
  createMaterial(material: InsertMaterial): Promise<Material>;

  getPurchases(): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;

  getMasons(): Promise<Mason[]>;
  getMasonById(id: string): Promise<Mason | undefined>;
  createMason(mason: InsertMason): Promise<Mason>;

  getWorkDays(): Promise<WorkDay[]>;
  createWorkDay(workDay: InsertWorkDay): Promise<WorkDay>;

  getAdvances(): Promise<Advance[]>;
  createAdvance(advance: InsertAdvance): Promise<Advance>;

  getMeals(): Promise<Meal[]>;
  createMeal(meal: InsertMeal): Promise<Meal>;

  getGlobalReport(): Promise<GlobalReport>;
  getMasonWithStats(masonId: string): Promise<MasonWithStats | undefined>;
}

export class MemStorage implements IStorage {
  private materials: Map<string, Material>;
  private purchases: Map<string, Purchase>;
  private masons: Map<string, Mason>;
  private workDays: Map<string, WorkDay>;
  private advances: Map<string, Advance>;
  private meals: Map<string, Meal>;

  constructor() {
    this.materials = new Map();
    this.purchases = new Map();
    this.masons = new Map();
    this.workDays = new Map();
    this.advances = new Map();
    this.meals = new Map();
  }

  async getMaterials(): Promise<Material[]> {
    return Array.from(this.materials.values());
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const id = randomUUID();
    const material: Material = { ...insertMaterial, id };
    this.materials.set(id, material);
    return material;
  }

  async getPurchases(): Promise<Purchase[]> {
    return Array.from(this.purchases.values());
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const id = randomUUID();
    const purchase = {
      id,
      materialId: insertPurchase.materialId,
      date: insertPurchase.date,
      quantity: insertPurchase.quantity,
      totalPrice: insertPurchase.totalPrice,
    };
    this.purchases.set(id, purchase as Purchase);
    return purchase as Purchase;
  }

  async getMasons(): Promise<Mason[]> {
    return Array.from(this.masons.values());
  }

  async getMasonById(id: string): Promise<Mason | undefined> {
    return this.masons.get(id);
  }

  async createMason(insertMason: InsertMason): Promise<Mason> {
    const id = randomUUID();
    const mason = {
      id,
      name: insertMason.name,
      dailyRate: insertMason.dailyRate,
    };
    this.masons.set(id, mason as Mason);
    return mason as Mason;
  }

  async getWorkDays(): Promise<WorkDay[]> {
    return Array.from(this.workDays.values());
  }

  async createWorkDay(insertWorkDay: InsertWorkDay): Promise<WorkDay> {
    const id = randomUUID();
    const workDay = {
      id,
      masonId: insertWorkDay.masonId,
      date: insertWorkDay.date,
      hours: insertWorkDay.hours,
    };
    this.workDays.set(id, workDay as WorkDay);
    return workDay as WorkDay;
  }

  async getAdvances(): Promise<Advance[]> {
    return Array.from(this.advances.values());
  }

  async createAdvance(insertAdvance: InsertAdvance): Promise<Advance> {
    const id = randomUUID();
    const advance = {
      id,
      masonId: insertAdvance.masonId,
      date: insertAdvance.date,
      amount: insertAdvance.amount,
    };
    this.advances.set(id, advance as Advance);
    return advance as Advance;
  }

  async getMeals(): Promise<Meal[]> {
    return Array.from(this.meals.values());
  }

  async createMeal(insertMeal: InsertMeal): Promise<Meal> {
    const id = randomUUID();
    const meal = {
      id,
      masonId: insertMeal.masonId,
      date: insertMeal.date,
      amount: insertMeal.amount,
    };
    this.meals.set(id, meal as Meal);
    return meal as Meal;
  }

  async getGlobalReport(): Promise<GlobalReport> {
    const purchases = await this.getPurchases();
    const totalMaterialsSpent = purchases.reduce(
      (sum, p) => sum + Number(p.totalPrice),
      0
    );

    const masons = await this.getMasons();
    const workDays = await this.getWorkDays();
    const advances = await this.getAdvances();
    const meals = await this.getMeals();

    let totalMasonsPaid = 0;
    for (const mason of masons) {
      const dailyRate = Number(mason.dailyRate);
      const masonWork = workDays.filter((w) => w.masonId === mason.id);
      const totalHours = masonWork.reduce(
        (sum, w) => sum + Number(w.hours),
        0
      );
      totalMasonsPaid += (totalHours / 8) * dailyRate;
    }

    const totalAdvances = advances.reduce(
      (sum, a) => sum + Number(a.amount),
      0
    );

    const totalMeals = meals.reduce(
      (sum, m) => sum + Number(m.amount),
      0
    );

    const totalExpenses = totalMaterialsSpent + totalMasonsPaid + totalAdvances + totalMeals;

    return {
      totalMaterialsSpent,
      totalMasonsPaid,
      totalAdvances,
      totalMeals,
      totalExpenses,
    };
  }

  async getMasonWithStats(masonId: string): Promise<MasonWithStats | undefined> {
    const mason = await this.getMasonById(masonId);
    if (!mason) return undefined;

    const workDays = await this.getWorkDays();
    const advances = await this.getAdvances();
    const meals = await this.getMeals();

    const dailyRate = Number(mason.dailyRate);
    const masonWork = workDays.filter((w) => w.masonId === masonId);
    const totalHours = masonWork.reduce(
      (sum, w) => sum + Number(w.hours),
      0
    );
    const totalWorked = (totalHours / 8) * dailyRate;

    const totalAdvances = advances
      .filter((a) => a.masonId === masonId)
      .reduce((sum, a) => sum + Number(a.amount), 0);

    const totalMeals = meals
      .filter((m) => m.masonId === masonId)
      .reduce((sum, m) => sum + Number(m.amount), 0);

    const totalPaid = totalAdvances + totalMeals;
    const balance = totalWorked - totalPaid;

    return {
      ...mason,
      totalWorked,
      totalAdvances,
      totalMeals,
      totalPaid,
      balance,
    };
  }
}

export const storage = new MemStorage();
