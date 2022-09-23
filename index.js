import express from 'express'
import { Router } from 'express'
import productos from './productos.js'

const routerProductos = Router()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use('/api/productos', routerProductos)
app.use(express.static('public'))


const port = 8080
const server = app.listen(port, () => console.log(`Servidor escuchado en el puerto: ${port}`))
server.on('error', (error) => console.log(`Error producido: ${error}`))

routerProductos.get('/', ( req, res ) => { //devuelve todos los productos
    res.json(productos)
})

routerProductos.get('/:id', ( req, res )=>{ //devuelve un producto según su id 
    const pos = parseInt(req.params.id)
    const producto = productos[pos - 1]
    if(!producto) {
        res.json({Error: "El producto no existe."})
    } else {
        res.json(producto)
    }
})

routerProductos.post('/', ( req, res ) => { //recibe y agrega un producto y lo devuelve con el id asignado
    const producto = req.body
    producto.id = productos.length + 1 
    productos.push(producto)
    res.json({
        ProductoAgregado: producto
    })
})

routerProductos.put('/:id', ( req, res ) => { //recibe y actualiza un producto segun su id
    const pos = parseInt(req.params.id)
    const productoNuevo = req.body
    let productoViejo = productos[pos - 1] 
    productos[pos - 1] = productoNuevo
    productoNuevo.id = pos
    if(!productoViejo) {
        res.json({Error: "El producto seleccionado no existe"})
    } else {
        res.json({productoAnterior: productoViejo, productoNuevo: productoNuevo})
    }
})

routerProductos.delete('/:id', ( req, res ) => { // elimina un producto segun su id
    const pos = parseInt(req.params.id)
    let filtro = productos.find(prod => prod.id == pos)
    if(!filtro) {
        res.json({Error: "El producto seleccionado no existe"})
    } else {
        let productoBorrado = productos.splice(pos - 1, 1)
        res.json({ProductoEliminado: productoBorrado})
    }
})
