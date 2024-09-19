import * as yup from "yup";
import { AppError } from "../shared/errors/AppError.ts";

const YupValidator = async (dataShape: yup.AnyObject, dataValidation: object) => {
  try {
    const schema = yup.object().shape(dataShape);
    await schema.validate(dataValidation);
  } catch (error: any) {
    throw new AppError(error.message, 400);
  }
};

export { YupValidator };
