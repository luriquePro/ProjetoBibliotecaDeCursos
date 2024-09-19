import md5 from "md5";
export const HashPassword = (password: string): string => md5(password.toLowerCase() + process.env.PASS_SALT_KEY);
