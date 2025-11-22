import jwt from 'jwt-simple';

const ACCESS_EXP = 1000 * 60 * 15; // 15 minutos
const REFRESH_EXP = 1000 * 60 * 60 * 24 * 7; // 7 días

export const createAccessToken = (user) => {
  const { name, mail, id } = user;
  const payload = {
    id,
    tipo: 'access',
    name,
    mail,
    exp: Math.floor((Date.now() + ACCESS_EXP) / 1000), // 👈 EN SEGUNDOS
  };
  return jwt.encode(payload, process.env.SECRETO);
};

export const createRefreshToken = (user) => {
  const { id } = user;
  const payload = {
    id,
    tipo: 'refresh',
    exp: Math.floor((Date.now() + REFRESH_EXP) / 1000), // 👈 EN SEGUNDOS
  };
  return jwt.encode(payload, process.env.SECRETO_REFRESH);
};
