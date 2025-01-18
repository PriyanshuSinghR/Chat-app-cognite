import { NextResponse } from "next/server";
import User from "../../../models/User";
import db from "../../../lib/db";
export async function GET() {
    try {
        await db();
        const users = await User.find({});
        return NextResponse.json(users.map((user) => user.userId));
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
