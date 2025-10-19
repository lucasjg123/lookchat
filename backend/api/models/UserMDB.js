import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { createAccessToken, createRefreshToken } from '../../helpers/jwt.js';

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

    const userExist = await User.findOne({
      $or: [{ name }, { mail }],
    });
    if (userExist) return { error: 'user duplicated' };

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userSave = new User({ name, mail, password: hashedPassword });
      await userSave.save();
      return { message: 'user created' };
    } catch (e) {
      console.error('Error creating user:', e);
      return { error: 'error creating user' };
    }
  }

  // ✅ Login de usuario
  static async login(user) {
    try {
      const { name, mail, password } = user;

      const userExist = await User.findOne({
        $or: [{ name }, { mail }],
      });
      if (!userExist) return { error: 'user not found' };

      const isMatch = await bcrypt.compare(password, userExist.password);
      if (!isMatch) return { error: 'invalid credentials' };

      const accessToken = createAccessToken(userExist);
      const refreshToken = createRefreshToken(userExist);

      return {
        user: {
          name: userExist.name,
        },
        accessToken,
        refreshToken,
      };
    } catch (e) {
      console.error('Error logging in:', e);
      return { error: 'error logging user' };
    }
  }
}
