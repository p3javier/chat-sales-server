import { pool } from "../services/database.mjs";

// CREATE operation
export async function createUser(email, emailVerified = false, companyName) {
  const client = await pool.connect();
  try {
    const query = {
      text: "INSERT INTO users (email, email_verified, company_name) VALUES($1, $2, $3) RETURNING *;",
      values: [email, emailVerified, companyName],
    };

    const result = await client.query(query.text, query.values);
    return result.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  } finally {
    client.release();
  }
}

// READ operation - Get all users
export async function getUsers() {
  try {
    const query = "SELECT * FROM users";
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

// READ operation - Get a single user by email
export async function getUserByEmail(email) {
  try {
    const query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    const result = await pool.query(query);
    return result.rows[0]; // Return the first row (or undefined if not found)
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

// UPDATE operation
export async function updateUser(email, newCompanyName) {
  try {
    const query = {
      text: "UPDATE users SET company_name = $1 WHERE email = $2 RETURNING *",
      values: [newCompanyName, email],
    };

    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

// DELETE operation
export async function deleteUser(email) {
  try {
    const query = {
      text: "DELETE FROM users WHERE email = $1 RETURNING *",
      values: [email],
    };

    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}
