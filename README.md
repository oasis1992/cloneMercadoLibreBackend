

## 1. Empezar

### Nota: Versión recomendada de Node 18.0
$~$

```bash
 1. yarn install
 2. yarn start
```

Se levanta un endpoint con su respectivo puerto [http://localhost:8080](http://localhost:8080)

$~$

## API

$~$
### 2. Buscar productos
    /api/items

| query param | type        | default  |
| ----------- | ----------- | -------  |
| q           | string      |          |

$~$
### 2.1 Success Response
```json
{
    categories: [string],
    items: [{
        id: number,
        title: string,
        price: {
            amount: number,
            decimals: number,
            currency: string,
        },
        contition: string,
        free_shipping: boolean,
        picture: string,
        city_name: string,
    }]
}
```
### 2.2 Error Response

#### Query param "q" no es enviado

```json
{
    statusCode: 400,
    message: 'Missing query param: q'
}
```

$~$

#### No se encuentran coincidencias con "q"
```json
{
    statusCode: 404,
    message: 'Product not found'
}
```
$~$

#### La búsqueda es sobrepasada por los limites o se encontraron caracteres extraños en "q"

```json
{
    statusCode: 400,
    message: 'Product not found'
}
```
$~$
#### Error de servidor


```json
{
    statusCode: 500,
    message: 'Server error'
}
```
$~$
### 2. Buscar productos
    api/items/:id

| url param   | type        | default  |
| ----------- | ----------- | -------  |
| id          | string      |          |

### 3.1 Success Response
```json
{
    categories: [string],
    item: {
        id: number,
        title: string,
        description: string,
        price: {
            amount: number,
            decimals: number,
            currency: string,
        },
        condition: string,
        sold_quantity: number,
        free_shiping: boolean,
        picture: string,
        city_name: string,
        description: string
    }
}
```
### 3.2 Error Response

#### No se encuentran coincidencias
```json
{
    statusCode: 404,
    message: 'Product not found'
}
```
$~$

#### La búsqueda es sobrepasada por los limites o se encontraron caracteres extraños en "q"

```json
{
    statusCode: 400,
    message: 'Product not found'
}
```
$~$
#### Error de servidor


```json
{
    statusCode: 500,
    message: 'Server error'
}
```