//const { writeFile } = require("fs");
import fs from "fs/promises"

class ProductManager {
	constructor(path) {
		this.path = path;
	}

	async addProduct({ title, description, price, thumbnail, code, stock }) {
    		 if (!title || !description || !price || !thumbnail || !code || !stock) {
	     	console.log("Revisa las propiedades, te falta alguna");
			return null;
		    }

            const products = await this.getProducts();

            const repitCode = products.find(prod => prod.code === code);
            if (repitCode) {
                console.log('Algún código se repite');
                return null;
            }

            const id = products.length ? products[products.length - 1].id + 1 : 1
        
            const newProduct = {title, description, price, thumbnail, code, stock, id};
            products.push(newProduct);

            await this.writeFile(products)

            return id
    }
	    
	    async getProducts() {
            try {
                const lista =await fs.readFile(this.path, "utf-8")
                const products = JSON.parse(lista);
                return products
            }   catch (error) {
                await fs.writeFile(this.path ,'[]');
                return [];
            }   
	    }

	    async getProductById(id) {
            const products = await this.getProducts();
		    const porId = products.find((prod) => prod.id === id);
            if(!porId) {
              console.log("Not found");
              return null;
            }
            return porId;
	    }

	    async updateProduct(id, obj) {
            const products = await this.getProducts();
            const indexProduct = products.findIndex(product => product.id === id);
            if(indexProduct < 0){
               console.log("No se encuentra el producto")
               return null;
            }
            products[indexProduct] = {...products[indexProduct], ...obj};
           
            await this.writeFile(products)
            return products[indexProduct]
	    }

	    async deleteProduct(id) {
            let products = await this.getProducts();
		    const largoOriginal = products.length;
            products = products.filter(product => product.id !== id);
            if(largoOriginal == products.length){
               console.log("no encontrado")
               return null
	        }

            await this.writeFile(products)
            return true
        }

        async writeFile(products){
            try {
                const lista = JSON.stringify(products, null, 2);
                await fs.writeFile(this.path, lista);
                return true;
            } catch (error) {
                console.log("Error al escribir el archivo", error);
                return null;
            }
        }
      
} 

export default ProductManager