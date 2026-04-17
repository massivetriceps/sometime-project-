const noticeRepository = require('./notice.repository');

const getNotices = async () => {
  const notices = await noticeRepository.findAllNotices();
  return { content: notices };
};

const createNotice = async (adminId, { title, content, attachment_url }) => {
  await noticeRepository.createNotice({
    admin_id: adminId,
    title,
    content,
    attachment_url,
  });
  return { message: '공지사항이 성공적으로 등록되었습니다.' };
};

const updateNotice = async (noticeId, { title, content, attachment_url }) => {
  await noticeRepository.updateNotice(noticeId, {
    title,
    content,
    attachment_url,
  });
  return { message: '공지사항이 수정되었습니다.' };
};

const deleteNotice = async (noticeId) => {
  await noticeRepository.deleteNotice(noticeId);
  return { message: '공지사항이 삭제되었습니다.' };
};

module.exports = { getNotices, createNotice, updateNotice, deleteNotice };