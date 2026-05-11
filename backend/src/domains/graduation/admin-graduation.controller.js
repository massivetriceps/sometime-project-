const { StatusCodes } = require('http-status-codes');
const adminGraduationService = require('./admin-graduation.service');
const prisma = require('../../config/db.config');

const handleGetRules = async (req, res, next) => {
  try {
    const rules = await prisma.gRADUATION_REQS.findMany({
      include: { majors: { select: { major_name: true, college_name: true } } },
      orderBy: [{ major_id: 'asc' }, { apply_year: 'asc' }],
    });
    res.status(StatusCodes.OK).success(rules);
  } catch (error) { next(error); }
};

const handleUpdateRules = async (req, res, next) => {
  try {
    const result = await adminGraduationService.updateGraduationRules(req.body);
    res.status(StatusCodes.OK).success(result);
  } catch (error) { next(error); }
};

module.exports = { handleGetRules, handleUpdateRules };