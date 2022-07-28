import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { SendEmailRequest } from "aws-sdk/clients/ses";
import { Request, RequestHandler, Response } from "express";

import { comparePassword, hashPassword } from "../helpers/auth";
import User, { UserModel } from "../models/user";
import { ClientConfiguration } from "aws-sdk/clients/ses";

export type MyRequest = Request & {
  user?: UserModel;
  files?: any;
  params?: any;
};

const awsConfig: ClientConfiguration = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");

    // hash password
    const hashedPassword = await hashPassword(password);

    // register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;

    // check if our db has user with that email
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");

    // check password
    const match = await comparePassword(password, user.password!);
    if (!match) return res.status(400).send("Wrong password");

    // create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
      jwtid: "user",
    });

    // return user and token to client, exclude hashed password
    delete user.password;

    // send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // only works on https
    });

    // send user as json response
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const logout: RequestHandler = async (_req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout success" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser: RequestHandler = async (req: MyRequest, res) => {
  try {
    const user = await User.findById(req.user!._id).select("-password").exec();
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.json({ sucess: false });
  }
};

export const forgotPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { password_reset_code: shortCode }
    );
    if (!user) return res.status(400).send("User not found");

    // prepare for email
    const params: SendEmailRequest = {
      Source: process.env.EMAIL_FROM!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
                <html>
                  <h1>Reset password</h1>
                  <p>User this code to reset your password</p>
                  <h2 style="color:red;">${shortCode}</h2>
                  <i>edemy.com</i>
                </html>
              `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset Password",
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword: RequestHandler = async (req, res) => {
  try {
    const { email, code, new_password } = req.body;

    console.table({ email, code, new_password });
    const hashedPassword = await hashPassword(new_password);

    const user = User.findOneAndUpdate(
      {
        email,
        password_reset_code: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: "",
      }
    ).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error! Try again.");
  }
};

export const sendTestEmail: RequestHandler = (req, res) => {
  // prepare for email
  const params: SendEmailRequest = {
    Source: process.env.EMAIL_FROM!,
    Destination: {
      ToAddresses: ["incredipurr@gmail.com"],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                <html>
                  <h1>Reset password</h1>
                  <p>User this code to reset your password</p>
                  <h2 style="color:red;">${":))))"}</h2>
                  <i>edemy.com</i>
                </html>
              `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Reset Password",
      },
    },
  };

  const emailSent = SES.sendEmail(params).promise();
  emailSent
    .then((data) => {
      console.log(data);
      res.json({ ok: true });
    })
    .catch((err) => {
      console.log(err);
      res.json({ ok: false });
    });
};
