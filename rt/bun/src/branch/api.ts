import { petitions } from "vixeny";
import { db } from "../db.ts";

const getElements = "SELECT * FROM items LIMIT 10";

const getFromTableUser =
  `SELECT * FROM users WHERE username = ? AND password = ?`;

const deleteQuery = "DELETE FROM items WHERE id = ?";

const insertQuery = "INSERT INTO items (name, price) VALUES (?, ?)";

const getUserBranch = petitions.branch()({
  args: {} as any,
  f: (c) =>
    db
      .query(getFromTableUser)
      .values(c.args as {}),
});

const getFirst10 = petitions.branch()({
  f: () => db.query(getElements).all() as [number, string, number][],
});

const deleteByID = petitions.branch()({
  args: {} as any,
  f: (c) => db.run(deleteQuery, [c.args as number]),
});

const addItem = petitions.branch()({
  args: {} as any,
  f: (c) => db.run(insertQuery, c.args as []),
});

export { addItem, deleteByID, getFirst10, getUserBranch };
