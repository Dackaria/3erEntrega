import express from "express";
import ProductManager from "./ProductManager.js";
//const express = require("express");
//const ProductManager = require("./ProductManager.js");

const manager = new ProductManager("productos.json");

const app = express();

app.get("/products", async (req, res) => {
	const limit = parseInt(req.query.limit);
	const allproduct = await manager.getProducts();
	if (!isNaN(limit)) {
		return res.status(200).send({ products:allproduct.slice(0, limit)});
	}
	res.json(allproduct);
});

app.get("/products/:id", async (req, res) => {
	const idProduct = req.params.id;
	const product = await manager.getProductById(Number(idProduct));
	if(!product) return res.status(404).json("No se encontró el producto con ese ID.");
	res.json({payload: product});
});

app.listen(8080, () => console.log("¡Servidor arriba escuchando en el puerto 8080!"));
