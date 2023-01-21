import {
  Model,
  DataTypes,
  InstanceUpdateOptions,
  CreateOptions,
} from "sequelize";
import { sequelize } from "./../utils/db.util";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import AppError from "../utils/AppError";

class User extends Model {
  public id!: number;
  public name!: string;
  public bio: string;
  public email!: string;
  public photo: string;
  public role: string;
  public password!: string;
  public passwordConfirm!: string;
  public passwordChangedAt: Date;
  public passwordResetToken: string;
  public passwordResetExpires: number;
  public correctPassword: (p1: string | Buffer, p2: string) => Promise<boolean>;
  public changedPasswordAfter: (p1: number) => boolean;
  public createPasswordResetToken: () => string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: {
          msg: "Special characters not allowed",
        },
        notNull: {
          msg: "Please enter your name",
        },
        notEmpty: {
          msg: "Please enter your name",
        },
      },
    },
    bio: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Please enter your email",
        },
        isEmail: {
          msg: "Wrong email format!",
        },
        notNull: {
          msg: "Please enter your email",
        },
        isLowercase: {
          msg: "Email must be lowercase!",
        },
      },
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue:
        "https://res.cloudinary.com/dfptc3ila/image/upload/v1672134561/default_hmbqah.jpg",
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please enter your password",
        },
        len: {
          msg: "Password length must be at least 8 characters long!",
          args: [8, 100],
        },
        notNull: {
          msg: "Please enter your password",
        },
      },
    },
    passwordConfirm: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please confirm your password",
        },
        len: {
          msg: "Password length must be at least 8 characters long!",
          args: [8, 100],
        },
        notNull: {
          msg: "Please confirm your password",
        },
      },
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
    },
    passwordResetExpires: {
      type: DataTypes.BIGINT,
    },
  },
  {
    sequelize,
    indexes: [{ unique: true, fields: ["email"] }],
    timestamps: false,
    modelName: "user",
    scopes: {
      withoutPassword: {
        attributes: { exclude: ["password", "passwordConfirm"] },
      },
    },
    hooks: {
      beforeSave: async (
        user: User,
        options: InstanceUpdateOptions<any> | CreateOptions<any>
      ): Promise<void> => {
        if (
          user.changed("password") &&
          user.password !== user.passwordConfirm
        ) {
          throw new AppError("Passwords are not the same!", 400);
        }
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 12);
        }
        if (!user.isNewRecord && user.changed("password"))
          user.passwordChangedAt = new Date(Date.now() - 1000);
      },
    },
  }
);
User.prototype.correctPassword = async function (
  candidatePassword: string | Buffer,
  userPassword: string
): Promise<boolean> {
  if (candidatePassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  } else {
    throw new AppError("Please enter your current password", 400);
  }
};
User.prototype.changedPasswordAfter = function (JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp: number = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  // false === not changed
  return false;
};
User.prototype.createPasswordResetToken = function (): string {
  const resetToken: string = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default User;
