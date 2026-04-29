export async function POST(req) {
  try {
    const data = await req.json();

    const {
      eircode,
      applianceType,
      brand,
      modelNumber,
      serialNumber,
      purchaseDate,
      warrantyExpirationDate
    } = data;

    const errors = {};

    const eircodeRegex = /^D\d{2}\s\d{4}$/;
    const modelRegex = /^\d{3}-\d{3}-\d{4}$/;
    const serialRegex = /^\d{4}-\d{4}-\d{4}$/;

    if (!eircode || !eircodeRegex.test(eircode)) {
      errors.eircode = "Invalid Eircode format (e.g., D01 1234)";
    }

    if (!applianceType) {
      errors.applianceType = "Please select an appliance type";
    }

    if (!brand || !brand.trim()) {
      errors.brand = "Brand is required";
    }

    if (!modelNumber || !modelRegex.test(modelNumber)) {
      errors.modelNumber = "Invalid model number (e.g., 123-456-7890)";
    }

    if (!serialNumber || !serialRegex.test(serialNumber)) {
      errors.serialNumber = "Invalid serial number (e.g., 1234-5678-9012)";
    }

    if (!purchaseDate) {
      errors.purchaseDate = "Purchase date is required";
    }

    if (!warrantyExpirationDate) {
      errors.warrantyExpirationDate = "Warranty date is required";
    }

    if (purchaseDate && warrantyExpirationDate) {
      const purchase = new Date(purchaseDate);
      const warranty = new Date(warrantyExpirationDate);

      if (warranty < purchase) {
        errors.warrantyExpirationDate = "Warranty cannot be before purchase date";
      }
    }

    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          errors,
          data 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const sanitize = (str) =>
      str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const record = {
      eircode: sanitize(eircode),
      applianceType: sanitize(applianceType),
      brand: sanitize(brand),
      modelNumber: sanitize(modelNumber),
      serialNumber: sanitize(serialNumber),
      purchaseDate,
      warrantyExpirationDate
    };

    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(process.cwd(), "inventory.json");

    let inventory = [];

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      inventory = JSON.parse(fileData);
    }

    inventory.push(record);
    fs.writeFileSync(filePath, JSON.stringify(inventory, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        data: record
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        errors: { general: "Server error, please try again" }
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}