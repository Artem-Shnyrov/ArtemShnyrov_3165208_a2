import db from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const serialNumber = searchParams.get('serialNumber'); 
        if (!serialNumber) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Serial number is required." 
                }),
                {
                    status: 400,
                    headers : {"Content-Type": "application/json"}
                }
            )
        }

        const [rows] = await db.query(
            'SELECT * FROM Appliance JOIN User ON Appliance.UserId = User.UserID WHERE Appliance.SerialNumber = ?',
            [serialNumber.trim()]
        )

        if (rows.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "No matching appliance found."
                }),
                {
                    status: 404,
                    headers : {"Content-Type": "application/json"}
                }
            )
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Appliance found.",
                data: rows[0]
            }),
            {
                status: 200,
                headers: {"Content-Type": "application/json"}
            }
           
        )
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Server error, please try again."
            }),
            {
                status: 500,
                headers: {"Content-Type": "application/json"}
            }
        )
    }
}