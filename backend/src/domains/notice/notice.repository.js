const prisma = require('../../config/db.config');

const findAllNotices = async () => {
  return prisma.notices.findMany({
    orderBy: { created_at: 'desc' }, // 최신순 정렬
  });
};

const createNotice = async (data) => {
  return prisma.notices.create({ data });
};

const updateNotice = async (notice_id, data) => {
  return prisma.notices.update({
    where: { notice_id: parseInt(notice_id) },
    data,
  });
};

const deleteNotice = async (notice_id) => {
  return prisma.notices.delete({
    where: { notice_id: parseInt(notice_id) },
  });
};

module.exports = { findAllNotices, createNotice, updateNotice, deleteNotice };