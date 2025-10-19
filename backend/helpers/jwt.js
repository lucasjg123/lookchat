import jwt from 'jwt-simple';

const ACCESS_EXP = 1000 * 60 * 15; // 15 minutos
const REFRESH_EXP = 1000 * 60 * 60 * 24 * 7; // 7 días

export const createAccessToken = (user) => {
  const { name, mail, id } = user;
  const payload = {
    id,
    name,
    mail,
    exp: Date.now() + ACCESS_EXP,
  };
  return jwt.encode(payload, process.env.SECRETO);
};

export const createRefreshToken = (user) => {
  const { id } = user;
  const payload = {
    id,
    tipo: 'refresh',
    exp: Date.now() + REFRESH_EXP,
  };
  return jwt.encode(payload, process.env.SECRETO);
};
