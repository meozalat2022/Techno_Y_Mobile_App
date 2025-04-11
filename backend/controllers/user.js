import User from "../models/user.js";
import Address from "../models/address.js";

export const addNewAddress = async (req, res, next) => {
  try {
    const newAddress = await Address.create(req.body);
    return res.status(201).json(newAddress);
  } catch (error) {
    next(error);
  }
};

export const getUserAddresses = async (req, res, next) => {
  const user = req.params.userId;

  const id = user.slice(1);

  try {
    const userAddresses = await Address.find({ user: id });

    return res.status(200).json(userAddresses);
  } catch (error) {
    next(error);
  }
};

export const updateUserAddress = async (req, res, next) => {
  // get user ID and Address ID from params

  const { userId, addressId } = req.params;

  if (!userId || !addressId) {
    return next(errorHandler(404, "بيانات خطأ"));
  }
  // filter address by user ID
  try {
    const userAddresses = await Address.find({ user: userId.slice(1) });
    if (!userAddresses) {
      return next(errorHandler(404, "عنوان غير معروف"));
    }
    // find address by address ID and update
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId.slice(1),
      req.body
    );

    await updatedAddress.save();
    return res.status(201).json("Address Updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  const { addressId } = req.params;

  if (!addressId) {
    return next(errorHandler(404, "عنوان غير معروف"));
  }

  try {
    const deletedAddress = await Address.findByIdAndDelete(addressId.slice(1));

    res.status(200).json("Address Deleted successfully!");
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  const { userName, name, email, phone, userId } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        userName,
        name,
        email,
        phone,
      },
      { new: true }
    );
    await updatedUser.save();
    return res.status(201).json("User Updated successfully");
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {};
