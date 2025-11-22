import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { createAccessToken, createRefreshToken } from '../../helpers/jwt.js';
import { AppError } from '../../helpers/errors.js';

// ✅ Definición del esquema con índices únicos
const userSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        // reemplazamos _id por id
        ret.id = ret._id;
        delete ret._id;
        delete ret.password; // 🔒 No exponemos el password
      },
    },
  }
);

const User = model('User', userSchema);

export class UserModel {
  // ✅ Registrar usuario
  static async register(user) {
    const { name, mail, password } = user;

    try {
      const userExist = await User.findOne({
        $or: [{ name }, { mail }],
      });
      if (userExist) {
        // console.error('Error: user duplicated');
        throw new AppError('user already exists', 409);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userSave = new User({ name, mail, password: hashedPassword });
      await userSave.save();
      return { message: 'user created' };
    } catch (error) {
      // console.error('Error creating user:', error);
      // ✅ Si es AppError, lo volvemos a lanzar tal cual
      if (error instanceof AppError) throw error;
      throw new Error('Failed to register user');
    }
  }

  // ✅ Login de usuario
  static async login(user) {
    try {
      const { name, mail, password } = user;

      const userExist = await User.findOne({
        $or: [{ name }, { mail }],
      });

      if (!userExist) {
        // console.error('Error: user not found');
        throw new AppError('user not found', 401);
      }

      const isMatch = await bcrypt.compare(password, userExist.password);
      if (!isMatch) {
        // console.error('Error: invalid password');
        throw new AppError('invalid password', 401);
      }

      const accessToken = createAccessToken(userExist);
      const refreshToken = createRefreshToken(userExist);

      return {
        user: {
          name: userExist.name,
          id: userExist._id,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      // console.error('Error login user:', error);
      // ✅ Si es AppError, lo volvemos a lanzar tal cual
      if (error instanceof AppError) throw error;
      throw new Error('Failed to login user');
    }
  }

  // Función para obtener usuarios basada en un objeto de filtro dinámico
  static async get(user) {
    try {
      // Realiza la búsqueda en la base de datos con los filtros proporcionados
      const users = await User.find(user);
      return users;
    } catch (error) {
      throw new Error('Error al obtener usuarios');
    }
  }

  static async getById(id) {
    try {
      return await User.findById(id); // devuelve un OBJETO
    } catch (error) {
      throw new Error('Error al obtener usuario por ID');
    }
  }

  static async getByName(user) {
    try {
      const users = await User.find({
        name: { $regex: user.name, $options: 'i' },
      });
      return users;
    } catch (error) {
      throw new Error('Error al obtener usuarios');
    }
  }
}
