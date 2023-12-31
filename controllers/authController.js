import conn from "../config/db.js";
import sqlString from "sqlstring";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
import mailConfig from "../config/email.js";

dotenv.config();

export class AuthController {
  static async login(req, res) {
    let userData = req.body;

    let query = sqlString.format("SELECT * FROM User WHERE email = ?", [
      userData.email,
    ]);

    conn.query(query, async (err, result) => {
      if (err) {
        console.log(err);

        return res.json({
          success: false,
          message: "Server error",
        });
      }

      if (result.length == 0) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      let isMatch = await bcrypt.compare(userData.password, result[0].password);

      if (!isMatch) {
        return res.json({
          success: false,
          message: "Incorrect password",
        });
      } else {
        if (result[0].isVerified == 0) {
          return res.json({
            success: false,
            message: "User not verified",
          });
        }

        return res.json({
          success: true,
          message: "User logged in successfully",
          user: {
            userId: result[0].userId,
            name: result[0].name,
            email: result[0].email,
          },
        });
      }
    });
  }

  static async register(req, res) {
    let userData = req.body;

    console.log(userData);

    let query = sqlString.format(
      "SELECT COUNT(*) AS userCount FROM User WHERE email = ?",
      [userData.email]
    );

    conn.query(query, async (err, result) => {
      if (err) {
        console.log(err);

        return res.json({
          success: false,
          message: "Server error",
        });
      }

      if (result[0].userCount > 0) {
        return res.json({
          success: false,
          message: "User already registered with this email",
        });
      }

      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(userData.password, salt);

      userData.password = hash;

      let query = sqlString.format("INSERT INTO User SET ?", [userData]);

      conn.query(query, (err, result) => {
        if (err) {
          console.log(err);

          return res.json({
            success: false,
            message: "Server error",
          });
        }

        return res.json({
          success: true,
          message: "User registered successfully",
        });
      });
    });
  }
}
