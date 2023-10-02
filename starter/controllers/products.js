const { Query } = require('mongoose');
const Product = require('../models/product')
const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({
        featured: true
    }).select('name price');
    res.status(200).json({ nbHits: products.length, data: products })
}
const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }
    if (numericFilters) {
        OperatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': 'lt',
            '<=': 'lte'
        }
        const RegEx = /\b(<|<=|=|>|>=)\b/g;
        let filter = numericFilters.replace(RegEx, (match) => `-${OperatorMap[match]}-`)
        console.log(filter);
        const option = ['price', 'rating'];
        filter = filter.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (option.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        });
        console.log(queryObject);

    }
    let result = Product.find(queryObject)
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    }
    if (fields) {
        const FieldsList = fields.split(',').join(' ');
        result = result.select(FieldsList)
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    console.log(skip, limit)
    const products = await result;
    res.status(200).json({ nbHits: products.length, data: products })
}
module.exports = {
    getAllProducts,
    getAllProductsStatic
}