import tokenModel from "../models/token.model";

export default () => {
  const getByToken = (token: string) => {
    return tokenModel.findOne({ token: token });
  };
  const remove = (token: string) => {
    return tokenModel.deleteOne({ token: token });
  };
  const create = (token: string, userId: string) => {
    return tokenModel.create({ token, userId });
  };
  return { getByToken, remove, create };
};
