// server/controllers/quote.controller.js
const db = require("../models");
const Quote = db.quotes;

exports.create = async (req, res) => {
  try {
    const quote = await Quote.create(req.body);
    res.status(201).send(quote);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const quotes = await Quote.findAll({ include: ['request'] });
    res.send(quotes);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id);
    if (!quote) return res.status(404).send({ message: 'Cotización no encontrada' });

    await quote.update(req.body);
    if (req.body.status === 'approved') {
      const invoice = { id: Date.now(), quote_id: quote.id, total: quote.total };
      return res.send({ ...quote.dataValues, invoice });
    }
    res.send(quote);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id);
    if (!quote) return res.status(404).send({ message: 'Cotización no encontrada' });
    await quote.destroy();
    res.send({ message: 'Cotización eliminada' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};