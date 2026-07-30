const ActiviteLog = require("../models/ActiviteLog");

exports.listerActivites = async (req, res) => {
  const limite = Math.min(Number(req.query.limite) || 50, 200);
  const activites = await ActiviteLog.findAll({
    order: [["createdAt", "DESC"]],
    limit: limite,
  });
  res.json(activites);
};
