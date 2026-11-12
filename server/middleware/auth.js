import { clerkClient, getAuth } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);
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
        console.error("Failed to verify admin access:", error);
        return res.status(500).json({ success: false, message: "Unable to verify admin access" });
    }
};