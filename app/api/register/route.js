import db from "../../lib/db";

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      firstName,
      lastName,
      address,
      mobile,
      email,
      eircode,
      applianceType,
      brand,
      modelNumber,
      serialNumber,
      purchaseDate,
      warrantyExpirationDate,
      costOfAppliance
    } = data;

    const errors = {};

    const eircodeRegex = /^D\d{2}\s\d{4}$/;
    const modelRegex = /^\d{3}-\d{3}-\d{4}$/;
    const serialRegex = /^\d{4}-\d{4}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10,15}$/;

    if (!firstName || !firstName.trim()) errors.firstName = "First name is required";
    if (!lastName || !lastName.trim()) errors.lastName = "Last name is required";
    if (!address || !address.trim()) errors.address = "Address is required";
    if (!mobile || !mobileRegex.test(mobile)) errors.mobile = "Invalid mobile number";
    if (!email || !emailRegex.test(email)) errors.email = "Invalid email address";
    if (!eircode || !eircodeRegex.test(eircode)) errors.eircode = "Invalid Eircode format (e.g., D01 1234)";
    if (!applianceType) errors.applianceType = "Please select an appliance type";
    if (!brand || !brand.trim()) errors.brand = "Brand is required";
    if (!modelNumber || !modelRegex.test(modelNumber)) errors.modelNumber = "Invalid model number (e.g., 123-456-7890)";
    if (!serialNumber || !serialRegex.test(serialNumber)) errors.serialNumber = "Invalid serial number (e.g., 1234-5678-9012)";
    if (!purchaseDate) errors.purchaseDate = "Purchase date is required";
    if (!warrantyExpirationDate) errors.warrantyExpirationDate = "Warranty date is required";
    if (!costOfAppliance || isNaN(costOfAppliance)) errors.costOfAppliance = "Valid cost is required";

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
          errors
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const sanitize = (str) =>
      str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const cleanFirst = sanitize(firstName.trim());
    const cleanLast = sanitize(lastName.trim());
    const cleanAddress = sanitize(address.trim());
    const cleanMobile = sanitize(mobile.trim());
    const cleanEmail = sanitize(email.trim());
    const cleanEircode = sanitize(eircode.trim());
    const cleanType = sanitize(applianceType);
    const cleanBrand = sanitize(brand.trim());
    const cleanModel = sanitize(modelNumber.trim());
    const cleanSerial = sanitize(serialNumber.trim());

    //Check if appliance already exists
    const [existing] = await db.query(
      "SELECT id FROM appliances WHERE serial_number = ?",
      [cleanSerial]
    );

    if (existing.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: { serialNumber: "An appliance with this serial number already exists" }
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    //Check if user already exists based on email, if so reuse their ID, otherwise create new user
    let userID;
    const [existingUser] = await db.query(
      'SELECT * FROM User WHERE Email = ?',
      [cleanEmail]
    );

    if (existingUser.length > 0) {
      // User already exists, reuse their ID
      userID = existingUser[0].UserID;
    } else {
      // Insert new user
      const [userResult] = await db.query(
        'INSERT INTO User (FirstName, LastName, Address, Mobile, Email, Eircode) VALUES (?, ?, ?, ?, ?, ?)',
        [cleanFirst, cleanLast, cleanAddress, cleanMobile, cleanEmail, cleanEircode]
      );
      userID = userResult.insertId;
    }

    //Insert Appliance
    await db.query(
      'INSERT INTO Appliance (UserID, ApplianceType, Brand, ModelNumber, SerialNumber, PurchaseDate, WarrantyExpirationDate, CostOfAppliance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userID, cleanType, cleanBrand, cleanModel, cleanSerial, purchaseDate, warrantyExpirationDate, costOfAppliance]
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'New appliance added successfully.',
      data: {
        firstName: cleanFirst,
        lastName: cleanLast,
        email: cleanEmail,
        eircode: cleanEircode,
        applianceType: cleanType,
        brand: cleanBrand,
        modelNumber: cleanModel,
        serialNumber: cleanSerial,
        purchaseDate,
        warrantyExpirationDate,
        costOfAppliance
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({
      success: false,
      errors: { general: "Server error, please try again" }
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}