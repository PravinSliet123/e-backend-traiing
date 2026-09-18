//http module
require("dotenv/config")
const http = require("http")
const data = require("./data.json")
const cors = require("cors")
const { PrismaClient } = require("./generated/prisma/client")
const { PrismaMariaDb } = require("@prisma/adapter-mariadb")


const express = require("express")

const adapter = new PrismaMariaDb(process.env.DATABASE_URL)
const prisma = new PrismaClient({ adapter })


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


app.get("/products", async (req, res) => {

    const { q } = req.query

    try {

        const products = await prisma.products.findMany()
        console.log("🚀 ~ products:", products)

        res.send({
            products: products
        })

    } catch (error) {

    }
})

app.get("/seller", async (req, res) => {

    const { q } = req.query

    try {

        const seller = await prisma.seller.findMany()
        console.log("🚀 ~ products:", seller)

        res.send({
            seller: seller
        })

    } catch (error) {

    }
})

app.post("/seller", async (req, res) => {
    try {
        console.log("selller clalling...")
        const body = req.body
        console.log("🚀 ~ body:", body)
        const isExist = await prisma.seller.findFirst({where:{email:body.email}})

        if(isExist){
            return res.status(400).json({message:"user already exist"})
        }

        const seller = await prisma.seller.create({ data: body })
        console.log("🚀 ~ seller:", seller)
        res.json(seller)
    } catch (error) {
        console.log("🚀 ~ error:", error)
    }



})


app.get("/products/:productId", (req, res) => {

    const productId = req.params.productId
    console.log("🚀 ~ productid:", productId)

    const product = data.products.find(prod => prod.id === parseInt(productId))

    return res.send(product)
})



app.post("/product", async (req, res) => {
    try {
        const body = req.body
        console.log("🚀 ~ body:", body)

        const ts = await prisma.$transaction()
        const product = await prisma.products.create({data:body})
        res.json(product)
    } catch (error) {
        console.log("🚀 ~ error:", error)
    }



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