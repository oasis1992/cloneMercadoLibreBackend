const express = require('express')
const axios = require('axios')
const cors = require('cors')

const URL = 'https://api.mercadolibre.com'
const app = express()
const port = 8080

app.options(cors())

const parseProductsResponse = (response) => ({
    categories: response.filters.length ? response.filters[0].values[0].path_from_root.map(category => category.name) : [],
    items: response.results.map((item) => {
        const priceSeparator = item.price.toString().split('.')
        const amount = Number(priceSeparator[0])
        const decimals = priceSeparator[1] ? Number(priceSeparator[1]) : null
        return {
            id: item.id,
            title: item.title,
            price: {
                amount,
                decimals,
                currency: item.currency_id,
            },
            contition: item.contition,
            free_shipping: item.shipping.free_shipping,
            picture: item.thumbnail,
            city_name: item.address.city_name,
        }
    })
})

const parseDetailProductResponse = (response, responseCategory) => {
    const priceSeparator = response.price.toString().split('.')
    const amount = Number(priceSeparator[0])
    const decimals = priceSeparator[1] ? Number(priceSeparator[1]) : null
    return {
        categories: responseCategory.path_from_root.map(category => category.name),
        item: {
            id: response.id,
            title: response.title,
            price: {
                amount,
                decimals,
                currency: response.currency_id,
            },
            condition: response.condition,
            sold_quantity: response.sold_quantity,
            free_shiping: response.shipping.free_shipping,
            picture: response.pictures[0].secure_url,
            city_name: response.seller_address.city.name,
            description: response.description
        }
    }
}

app.use((_, res, next) => {
    // Dominio que tengan acceso (ej. 'http://example.com')
       res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Metodos de solicitud que deseas permitir
       res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
       res.setHeader('Access-Control-Allow-Headers', '*');
    
    next();
})

app.get('/api/items', async function(req, res) {
    if (!req.query.q) {
        res.send({
            statusCode: 400,
            message: 'Missing query param: q'
        })
        return
    }

    let data = {}
    try {
        data = await axios.get(`${URL}/sites/MLA/search/?q=${req.query.q}&limit=${req.query.limit || 50}`)
        const dataParsed = parseProductsResponse(data.data)
        res.json(dataParsed)
        return
    } catch (e) {
        if (e.response.status === 404) {
            res.status(404).json({
                statusCode: 404,
                message: 'Product not found'
            })
            return
        }

        if (e.response.status === 400) {
            res.status(400).json({
                statusCode: 400,
                message: 'Product not found'
            })
            return
        }

        res.status(500).json({
            statusCode: 500,
            message: 'Server error'
        })
    }
})

app.get('/api/items/:id', async function(req, res) {
    try {
        const data = await axios.get(`${URL}/items/${req.params.id}`)

        const dataCategory = await axios.get(`${URL}/categories/${data.data.category_id}`)
        const dataParsed = parseDetailProductResponse(data.data, dataCategory.data)
        const dataDescription = await axios.get(`${URL}/items/${req.params.id}/description`)
        dataParsed.item.description = dataDescription.data.plain_text
        res.json(dataParsed)
        return
    } catch (e) {
        if (e.response.status === 404) {
            res.status(404).json({
                statusCode: 404,
                message: 'Product not found'
            })
            return
        }

        if (e.response.status === 400) {
            res.status(404).json({
                statusCode: 404,
                message: 'Product not found'
            })
            return
        }

        res.status(500).json({
            statusCode: 500,
            message: 'Server error'
        })
    }
})

app.listen(port)

console.log('Server started at http://localhost:' + port)