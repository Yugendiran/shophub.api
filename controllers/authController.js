import conn from "../config/db.js";
import sqlString from "sqlstring";

export class AuthController {
  static register(req, res) {
    let userData = req.body;

    let query = sqlString.format(
      "SELECT COUNT(*) AS userCount FROM User WHERE email = ?",
      [userData.email]
    );

    conn.query(query, (err, result) => {
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

      let query = sqlString.format(`INSERT INTO User SET ?`, [userData]);

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
