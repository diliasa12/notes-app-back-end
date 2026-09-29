import { Pool } from "pg";
import bcrypt from "bcryptjs";
class UserRepositories {
  constructor() {
    this.pool = new Pool();
  }
  async verifyNewUsername(username) {
    const query = {
      text: "SELECT id from users WHERE username = $1",
      values: [username],
    };
    const result = await this.pool.query(query);
    return result.rows.length > 0;
  }
  async createUser({ id, username, password, fullname }) {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: "INSERT INTO users values($1,$2,$3,$4,$5,$6) RETURNING id",
      values: [id, username, hashPassword, fullname, createdAt, updatedAt],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }
  async getUserById(id) {
    const query = {
      text: "SELECT id,username,fullname,created_at,updated_at FROM users WHERE id = $1",
      values: [id],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }
  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    };
    const user = await this.pool.query(query);
    console.log(user);
    const { id, password: hashedPassword } = user.rows[0];

    const isPasswordMatch = bcrypt.compareSync(password, hashedPassword);
    if (!isPasswordMatch) {
      return null;
    }
    return id;
  }
}
export default new UserRepositories();
