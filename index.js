//http module
const http = require("http")
const data = require("./data.json")
const cors = require("cors")

const express = require("express")


const app = express()

app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(express.json())


// const server = http.createServer((req, res) => {
//     console.log("🚀 ~ req:", req.url, req.method)

//     if (req.url === "/products" && req.method === "GET") {
//         res.end(data)
//     }

//     if (req.url === "/product/id" && req.method === "GET") {
//         res.end("sending product details")
//     }
// })


app.get("/products", (req, res) => {

    const { q } = req.query
    console.log("🚀 ~ query:", q)

    const products = !q ? data.products : data.products.filter(prod => prod.title.toLowerCase().includes(q.toLowerCase()))
    res.send({
        products: products
    })
})

app.get("/products/:productId", (req, res) => {

    const productId = req.params.productId
    console.log("🚀 ~ productid:", productId)

    const product = data.products.find(prod => prod.id === parseInt(productId))

    return res.send(product)
})


app.post("/product", (req, res) => {
    console.log("🚀 ~ req:", req.body)
    data.products.push(req.body)
    res.json(data)

})

app.delete("/product:productId", (req, res) => {
    
    const productId = req.params.productId
    data.products.push(req.body)
    res.json(data)

})





app.listen(8084, () => {
    console.log(`server is running on http://localhost:8084`)
})

// npm init