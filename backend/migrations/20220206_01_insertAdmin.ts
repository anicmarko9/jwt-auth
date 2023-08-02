import * as bcrypt from "bcrypt";

export const up = async ({ context: queryInterface }): Promise<void> => {
  return await queryInterface.bulkInsert(
    "users",
    [
      {
        name: "Marko",
        email: "anicmarko9@gmail.com",
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
        passwordConfirm: "**********",
        role: "admin",
      },
    ],
    {}
  );
};

export const down = async ({ context: queryInterface }): Promise<void> => {
  return await queryInterface.bulkDelete("users", null, {});
};
