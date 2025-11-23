import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMaterialSchema,
  insertPurchaseSchema,
  insertMasonSchema,
  insertWorkDaySchema,
  insertAdvanceSchema,
  insertMealSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/materials", async (_req, res) => {
    try {
      const materials = await storage.getMaterials();
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch materials" });
    }
  });

  app.post("/api/materials", async (req, res) => {
    try {
      const validatedData = insertMaterialSchema.parse(req.body);
      const material = await storage.createMaterial(validatedData);
      res.status(201).json(material);
    } catch (error) {
      res.status(400).json({ error: "Invalid material data" });
    }
  });

  app.get("/api/purchases", async (_req, res) => {
    try {
      const purchases = await storage.getPurchases();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch purchases" });
    }
  });

  app.post("/api/purchases", async (req, res) => {
    try {
      const validatedData = insertPurchaseSchema.parse(req.body);
      const purchase = await storage.createPurchase(validatedData);
      res.status(201).json(purchase);
    } catch (error) {
      res.status(400).json({ error: "Invalid purchase data" });
    }
  });

  app.get("/api/masons", async (_req, res) => {
    try {
      const masons = await storage.getMasons();
      res.json(masons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch masons" });
    }
  });

  app.get("/api/masons/:id", async (req, res) => {
    try {
      const mason = await storage.getMasonWithStats(req.params.id);
      if (!mason) {
        res.status(404).json({ error: "Mason not found" });
        return;
      }
      res.json(mason);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mason" });
    }
  });

  app.post("/api/masons", async (req, res) => {
    try {
      const validatedData = insertMasonSchema.parse(req.body);
      const mason = await storage.createMason(validatedData);
      res.status(201).json(mason);
    } catch (error) {
      res.status(400).json({ error: "Invalid mason data" });
    }
  });

  app.get("/api/work-days", async (_req, res) => {
    try {
      const workDays = await storage.getWorkDays();
      res.json(workDays);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch work days" });
    }
  });

  app.post("/api/work-days", async (req, res) => {
    try {
      const validatedData = insertWorkDaySchema.parse(req.body);
      const workDay = await storage.createWorkDay(validatedData);
      res.status(201).json(workDay);
    } catch (error) {
      res.status(400).json({ error: "Invalid work day data" });
    }
  });

  app.get("/api/advances", async (_req, res) => {
    try {
      const advances = await storage.getAdvances();
      res.json(advances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch advances" });
    }
  });

  app.post("/api/advances", async (req, res) => {
    try {
      const validatedData = insertAdvanceSchema.parse(req.body);
      const advance = await storage.createAdvance(validatedData);
      res.status(201).json(advance);
    } catch (error) {
      res.status(400).json({ error: "Invalid advance data" });
    }
  });

  app.get("/api/meals", async (_req, res) => {
    try {
      const meals = await storage.getMeals();
      res.json(meals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch meals" });
    }
  });

  app.post("/api/meals", async (req, res) => {
    try {
      const validatedData = insertMealSchema.parse(req.body);
      const meal = await storage.createMeal(validatedData);
      res.status(201).json(meal);
    } catch (error) {
      res.status(400).json({ error: "Invalid meal data" });
    }
  });

  app.get("/api/reports/global", async (_req, res) => {
    try {
      const report = await storage.getGlobalReport();
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
