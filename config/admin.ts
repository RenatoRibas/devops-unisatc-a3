export default ({ env }) => {
  const adminJwtSecret = env('ADMIN_JWT_SECRET', '77bbda8f567a4c0c8a2d7dc4b7f0c48d');
  const apiTokenSalt = env('API_TOKEN_SALT', '4a0a0b8d0d7d4f748dbb7075d3b6c9d4');
  const transferTokenSalt = env('TRANSFER_TOKEN_SALT', 'b5cc7a4a48c94d20bde7bad6da8e0f5b');

  return {
    auth: {
      secret: adminJwtSecret,
    },
    apiToken: {
      salt: apiTokenSalt,
    },
    transfer: {
      token: {
        salt: transferTokenSalt,
      },
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
  };
};
