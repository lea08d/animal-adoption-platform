import jwt from "jsonwebtoken";

export type AuthUser = {
  id: string;
  role: "ADMIN" | "STAFF" | "VOLUNTEER";
};

export function verifyToken(request: Request): AuthUser {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;

  return decoded;
}

export function requireRole(
  request: Request,
  allowedRoles: Array<"ADMIN" | "STAFF" | "VOLUNTEER">
): AuthUser {
  const user = verifyToken(request);

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}