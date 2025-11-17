import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
    try {
        const userId = req.auth?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "not authorized" });
        }

        const user = await clerkClient.users.getUser(userId);
        const role = user?.privateMetadata?.role;
        if (role !== "admin") {
            return res.status(403).json({ success: false, message: "not authorized" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "not authorized" });
    }
};