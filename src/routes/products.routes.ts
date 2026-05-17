import { Router, Request, Response } from "express";
import Product from "../models/Products";

const productRoutes = Router();

// GET all products
productRoutes.get("/", async (request: Request, response: Response) => {
  try {
    const products = await Product.findAll();
    return response.json(products);
  } catch (error) {
    return response.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET product by ID
productRoutes.get("/:id", async (request: Request, response: Response) => {
  try {
    const id = (request.params.id as string);
    const product = await Product.findByPk(parseInt(id));
    
    if (!product) {
      return response.status(404).json({ error: "Product not found" });
    }
    
    return response.json(product);
  } catch (error) {
    return response.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST create product
productRoutes.post("/", async (request: Request, response: Response) => {
  try {
    const { name, sector, quantity } = request.body;

    if (!name || sector === undefined || quantity === undefined) {
      return response.status(400).json({ 
        error: "Missing required fields: name, sector, quantity" 
      });
    }

    const product = await Product.create({
      name,
      sector,
      quantity
    });

    return response.status(201).json(product);
  } catch (error) {
    return response.status(500).json({ error: "Failed to create product" });
  }
});

// PUT update product
productRoutes.put("/:id", async (request: Request, response: Response) => {
  try {
    const id = (request.params.id as string);
    const { name, sector, quantity } = request.body;

    const product = await Product.findByPk(parseInt(id)) as any;

    if (!product) {
      return response.status(404).json({ error: "Product not found" });
    }

    await product.update({
      name: name ?? product.name,
      sector: sector ?? product.sector,
      quantity: quantity ?? product.quantity
    });

    return response.json(product);
  } catch (error) {
    return response.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE product
productRoutes.delete("/:id", async (request: Request, response: Response) => {
  try {
    const id = (request.params.id as string);
    const product = await Product.findByPk(id);

    if (!product) {
      return response.status(404).json({ error: "Product not found" });
    }

    await product.destroy();

    return response.json({ message: "Product deleted successfully" });
  } catch (error) {
    return response.status(500).json({ error: "Failed to delete product" });
  }
});

export default productRoutes;