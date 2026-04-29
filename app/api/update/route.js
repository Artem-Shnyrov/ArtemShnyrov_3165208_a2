import db from "@/lib/db"

export async function PUT(req){
    try{
        const data = await req.json();
        const {serialNumber, applianceType, brand, modelNumber, purchaseDate, warrantyExpirationDate, costOfAppliance } = data;

        if (!serialNumber){
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Serial number is required"
                }),
                {
                    status: 400,
                    headers: {"Content-Type": "application/json"}
                }
            )
        }

        const [rows] = await db.query(
            'SELECT * FROM Appliance JOIN User ON Appliance.UserID = User.UserID WHERE Appliance.SerialNumber = ?',
            [serialNumber.trim()]
        )

        if (rows.length === 0){
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "No matching appliance found"
                }),
                {
                    status: 404,
                    headers: {"Content-Type": "application/json"}
                }
            )
        }

        const sanitize = (str) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const cleanType = sanitize(applianceType);
        const cleanBrand = sanitize(brand.trim());
        const cleanModel = sanitize(modelNumber.trim());

         const formatDate = (date) => {
            const [day, month, year] = date.split('/');
            return `${year}-${month}-${day}`;
        };

        const formattedPurchaseDate = formatDate(purchaseDate);
        const formattedWarrantyDate = formatDate(warrantyExpirationDate);

        const [result] = await db.query(
            'UPDATE Appliance SET ApplianceType = ?, Brand = ?, ModelNumber = ?, PurchaseDate = ?, WarrantyExpirationDate = ?, CostOfAppliance = ? WHERE SerialNumber = ?',
            [cleanType, cleanBrand, cleanModel.trim(), formattedPurchaseDate, formattedWarrantyDate, costOfAppliance, serialNumber.trim()]
        )

        return new Response(
            JSON.stringify({
                success: true,
                message: "Appliance has been updated"
            }),
            {
                status: 200,
                headers: {"Content-Type": "application/json"}
            }
        )
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Server error, please try again"
            }),
            {
                status: 500,
                headers: {"Content-Type": "application/json"}
            }
        )
    }
}