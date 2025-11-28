export default ({ env }) => {
  const defaultAppKeys = [
    'c6df75902a5d4c2090c1b146f4c33a3d',
    '91ed83d93ad44c0a8b2f2a9420c8d6e3',
    '54f8901bd1ea4d8eabf8e60c5c3be5c2',
    'd7cfe9ab1f224570a02be4cb8fdc41e7',
  ];
  const appKeys = env.array('APP_KEYS');

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      // fallback keys keep dev/CI working even sem `.env`
      keys: appKeys && appKeys.length > 0 ? appKeys : defaultAppKeys,
    },
  };
};
