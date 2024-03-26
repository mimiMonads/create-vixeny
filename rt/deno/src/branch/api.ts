
import { morphism } from "vixeny";
import { db } from "../db.ts";

const getFirst10 = morphism()({
  f: () => {
    const stmt = db.prepare("SELECT * FROM items LIMIT 10");
    const items = stmt.all();
    stmt.finalize();
    return items; 
  },
});

const getUserBranch = morphism()({
  f: (c) => {
    const stmt = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
    const user = stmt.value<[any]>(c.arguments);
    stmt.finalize();
    return user || null; 
  },
});

const deleteByID = morphism()({
  f: (c) => {
    const stmt = db.prepare("DELETE FROM items WHERE id = ?");
    stmt.run(c.arguments);
    stmt.finalize();
    return true; 
  },
});

const addItem = morphism()({
  f: (c) => {
    const stmt = db.prepare("INSERT INTO items (name, price) VALUES (?, ?)");
    stmt.run(c.arguments);
    stmt.finalize();
    return true;
  },
});

export { addItem, deleteByID, getFirst10, getUserBranch };
