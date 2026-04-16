export const MEDIA_ENDPOINTS = {
  POST: {
    REGISTER: '/media/register',
    UPLOAD_CONFIRM: '/media/uploadConfirm',
    DELETE: '/media/delete',
  },
  PUT: {
    UPLOAD: '', // динамический
  },
} as const;
