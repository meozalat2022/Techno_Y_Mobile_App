import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../util/error.js";
import transporter from "../util/nodemailer.js";

export const signup = async (req, res, next) => {
  const { userName, name, email, phone, password } = req.body;

  if (!userName || !name || !email || !phone || !password) {
    return next(errorHandler(404, "من فضلك اكمل البيانات"));
  }

  try {
    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return next(errorHandler(404, "المستخدم موجود من قبل"));
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      userName: userName,
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
    });
    await user.save();

    return res.json({ success: "true" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return next(errorHandler(404, "اسم المستخدم والرقم السري مطلوب"));
  }
  try {
    const validUser = await User.findOne({ userName });

    if (!validUser) {
      return next(errorHandler(404, "مستخدم غيرمعروف"));
    }

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "الرقم السري خطأ"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res.cookie("token", token, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

//sign in with google

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res.cookie("token", token, { httpOnly: true }).status(200).json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res.cookie("token", token, { httpOnly: true }).status(200).json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json("Signed Out");
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(errorHandler(404, "يجب ادخال الأميل"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "لا يوجد مستخدم بهذا الأميل"));
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();
    const mailOption = {
      from: "techno.y62024@gmail.com",
      to: user.email,
      subject: "اعادة تعيين كلمةالمرور",
      text: `من فضلك استخدم هذا الرقم ${otp} لأعادة تعين كلمة المرور الجديدة`,
    };
    await transporter.sendMail(mailOption);
    return res.json({
      success: true,
      email: user.email,
      message: "تم ارسال الرقم السري لمرة واحدة لأميلك",
    });
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return next(errorHandler(404, "البيانات غير صحيحة"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "لا يوجد مستخدم بهذا الأميل"));
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return next(errorHandler(404, "الرقم السري لمرة واحدة غير صحيح"));
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return next(errorHandler(404, "الرقم السري لمرة واحدة منتهي الصلاحية"));
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "تم تغير الرقم السري بنجاح" });
  } catch (error) {
    next(error);
  }
};
