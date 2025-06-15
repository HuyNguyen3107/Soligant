// Quick test để verify userAPI exports
import * as userAPI from "../soligant-frontend/src/api/userAPI.js";

console.log("userAPI object:", userAPI);
console.log("createUser function:", typeof userAPI.createUser);
console.log("Available functions:", Object.keys(userAPI));

// Test import individual functions
import { createUser, getUsers } from "../soligant-frontend/src/api/userAPI.js";
console.log("Direct import createUser:", typeof createUser);
console.log("Direct import getUsers:", typeof getUsers);
