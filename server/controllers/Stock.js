const axios = require('axios')
const { Favorite } = require('../models/index')
const createError = require('http-errors')


class Stock {

  static getMostActiveStock(req, res, next) {
    const options = {
      url: 'https://financialmodelingprep.com/api/v3/stock/actives',
      method: 'GET'
    }
    axios(options)
      .then(response => {
        res.status(200).json(response.data.mostActiveStock)
      })
      .catch(next)
  }

  static getMostGainerStock(req, res, next) {
    const options = {
      url: 'https://financialmodelingprep.com/api/v3/stock/gainers',
      method: 'GET'
    }
    axios(options)
      .then(response => {
        res.status(200).json(response.data.mostGainerStock)
      })
      .catch(next)
  }

  static searchStock(req, res, next) {
    const query = req.query.query

    const options = {
      url: `https://financialmodelingprep.com/api/v3/search?query=${query}&limit=20`,
      method: 'GET'
    }
    axios(options)
      .then(response => {
        res.status(200).json(response.data)
      })
      .catch(next)
  }

  static getStockProfile(req, res, next) {
    const id = req.params.id

    const options = {
      url: `https://financialmodelingprep.com/api/v3/company/profile/${id}`,
      method: 'GET'
    }
    axios(options)
      .then(response => {
        res.status(200).json(response.data)
      })
      .catch(next)
  }

  static addFavorites(req, res, next) {

    const { stock_code, stock_name, stock_industry, stock_ceo } = req.body

    const objData = {
      stock_code,
      stock_name,
      stock_ceo,
      stock_industry,
      UserId: req.user.id
    }

    Favorite
      .create(objData)
      .then(response => {
        res.status(201).json(response)
      })
      .catch(next)
  }

  static getFavoriteList(req, res, next) {
    Favorite
      .findAll({
        where: {
          UserId: req.user.id
        }
      })
      .then(response => {
        if (data != null) {
          res.status(200).json(response)
        } else {
          throw createError(200, 'Favorite is empty!')
        }
      })
      .catch(next)
  }

  static getSingleFavoriteData(req, res, next) {
    Favorite
      .findByPk(req.params.id)
      .then(response => {
        if (response == null) {
          throw createError(404, 'Data Not Found!')
        } else {
          res.status(200).json(response)
        }
      })
      .catch(next)
  }

  static deleteFavoriteData(req, res, next) {
    let data = {}
    Favorite
      .findByPk(req.params.id)
      .then(response => {
        data = response
        return response.destroy()
      })
      .then(response => {
        if (data === null) {
          throw createError(404, 'Data Not Found!')
        } else {
          res.status(200).json(data)
        }
      })
  }


}

module.exports = Stock