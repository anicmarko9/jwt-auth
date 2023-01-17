import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }): Promise<void> => {
  await queryInterface.createTable("users", {
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
  });
  await queryInterface.createTable("countries", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    officialName: {
      type: DataTypes.STRING,
    },
    independent: {
      type: DataTypes.BOOLEAN,
    },
    currency: {
      type: DataTypes.JSON,
    },
    capitalCity: {
      type: DataTypes.STRING,
    },
    continent: {
      type: DataTypes.STRING,
    },
    subContinent: {
      type: DataTypes.STRING,
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    landlocked: {
      type: DataTypes.BOOLEAN,
    },
    area: {
      type: DataTypes.STRING,
    },
    population: {
      type: DataTypes.STRING,
    },
    drivingSide: {
      type: DataTypes.STRING,
    },
    flagUrl: {
      type: DataTypes.STRING,
    },
    mapUrl: {
      type: DataTypes.STRING,
    },
    forecast: {
      type: DataTypes.JSON,
    },
  });
};
export const down = async ({ context: queryInterface }): Promise<void> => {
  await queryInterface.dropTable("users");
  await queryInterface.dropTable("countries");
};
