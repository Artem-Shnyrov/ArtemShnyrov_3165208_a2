'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Inventory() {
    const [eircode, setEircode] = useState('');
    const [applianceType, setApplianceType] = useState('');
    const [brand, setBrand] = useState('');
    const [modelNumber, setModelNumber] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [warrantyExpirationDate, setWarrantyExpirationDate] = useState('');
    const [errors, setErrors] = useState('');
    const [success, setSuccess] = useState('');
    const [submittedData, setSubmittedData] = useState(null);

    const validateForm = () => {
        if (!/^D\d{2}\s\d{4}$/.test(eircode)){
            setErrors('Invalid Eircode format. Please enter a valid Eircode (e.g., D01 1234).');
            return false;
         }

        if (!/^\d{3}-\d{3}-\d{4}$/.test(modelNumber)) {
            setErrors('Invalid model number format. Please enter a valid model number (e.g., 123-456-7890).');
            return false;
        }

        if (!/^\d{4}-\d{4}-\d{4}$/.test(serialNumber)) {
            setErrors('Invalid serial number format. Please enter a valid serial number (e.g., 1234-5678-9012).');
            return false;
        }

        if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(purchaseDate)) {
            setErrors('Invalid purchase date format. Please enter a valid date (e.g., 31/12/2020).');
            return false;
        }

        if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(warrantyExpirationDate)) {
            setErrors('Invalid warranty expiration date format. Please enter a valid date (e.g., 31/12/2023).');
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'eircode') setEircode(value);
        if (name === 'applianceType') setApplianceType(value);
        if (name === 'brand') setBrand(value);
        if (name === 'modelNumber') setModelNumber(value);
        if (name === 'serialNumber') setSerialNumber(value);
        if (name === 'purchaseDate') setPurchaseDate(value);
        if (name === 'warrantyExpirationDate') setWarrantyExpirationDate(value);

        setErrors('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const purchase = purchaseDate.split('/').reverse().join('-');
        const warranty = warrantyExpirationDate.split('/').reverse().join('-');
        if (new Date(warranty) < new Date(purchase)) {
            setErrors('Warranty expiration date cannot be earlier than purchase date.');
            return false;
        }

        if (!eircode.trim()) {
            setErrors('Please enter your Eircode.');
            return;
        }

        if (!applianceType) {
            setErrors('Please select an appliance type.');
            return;
        }

        if (!brand.trim()) {
            setErrors('Please enter the brand of the appliance.');
            return;
        }
        
        if (!modelNumber.trim()) {
            setErrors('Please enter the model number of the appliance.');
            return;
        }
        if (!serialNumber.trim()) {
            setErrors('Please enter the serial number of the appliance.');
            return;
        }
        if (!purchaseDate.trim()) {
            setErrors('Please enter the purchase date of the appliance.');
            return;
        }
        if (!warrantyExpirationDate.trim()) {
            setErrors('Please enter the warranty expiration date of the appliance.');
            return;
        }

        if (validateForm()) {
            try {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ eircode, applianceType, brand, modelNumber, serialNumber, purchaseDate, warrantyExpirationDate}),
                });
                const result = await res.json();
                if (res.ok) {
                    setSuccess('Form submitted successfully!');
                    setErrors('');
                    setSubmittedData(result.data);
                } else {
                    setErrors(result.message || 'Submission failed');
                    setEircode(result.data?.eircode || eircode);
                    setApplianceType(result.data?.applianceType || applianceType);
                    setBrand(result.data?.brand || brand);
                    setModelNumber(result.data?.modelNumber || modelNumber);
                    setSerialNumber(result.data?.serialNumber || serialNumber);
                    setPurchaseDate(result.data?.purchaseDate || purchaseDate);
                    setWarrantyExpirationDate(result.data?.warrantyExpirationDate || warrantyExpirationDate);
                }
            } catch (error) {
                setErrors('Network error, please try again.');
            }
        }
    };

    return (
        <div>
            <nav className="nav-bar">
                <Link href="/part-a" className="nav-link">Movie Booking</Link>
                <Link href="/part-b-c" className="nav-link active">Appliance Inventory</Link>
            </nav>
            <div className="inventory-form-container">
            <h1>Home Appliance Inventory Form</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="eircode">Eircode</label>
                <input
                    type="text"
                    pattern="^D\d{2}\s\d{4}$"
                    maxLength="8"
                    id="eircode"
                    name="eircode"
                    value={eircode}
                    onChange={handleChange}
                    className="inventory-form-input"
                    placeholder="D01 1234"
                    required
                />
                <label htmlFor="applianceType">Appliance Type</label>
                <select
                    id="applianceType"
                    name="applianceType"
                    value={applianceType}
                    onChange={handleChange}
                    className="inventory-form-select"
                    required
                >
                    <option value="">Select appliance type</option>
                    <option value="Refrigerator">Refrigerator</option>
                    <option value="Washing Machine">Washing Machine</option>
                    <option value="Oven">Oven</option>
                    <option value="Microwave">Microwave</option>
                    <option value="Dishwasher">Dishwasher</option>
                </select>
                <label htmlFor="brand">Brand</label>
                <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={brand}
                    onChange={handleChange}
                    className="inventory-form-input"
                    placeholder="Enter brand"
                    required
                />
                <label htmlFor="modelNumber">Model Number</label>
                <input
                    type="text"
                    pattern="^\d{3}-\d{3}-\d{4}$"
                    maxLength="12"
                    id="modelNumber"
                    name="modelNumber"
                    value={modelNumber}
                    onChange={handleChange}
                    className="inventory-form-input"
                    placeholder="123-456-7890"
                    required
                />
                <label htmlFor="serialNumber">Serial Number</label>
                <input
                    type="text" 
                    maxLength="14"
                    pattern="^\d{4}-\d{4}-\d{4}$"
                    id="serialNumber"
                    name="serialNumber"
                    value={serialNumber}
                    onChange={handleChange}
                    className="inventory-form-input"
                    placeholder="1234-5678-9012"
                    required
                />
                <label htmlFor="purchaseDate">Purchase Date</label>
                <input
                    type="text"
                    id="purchaseDate"
                    name="purchaseDate"
                    value={purchaseDate}
                    onChange={handleChange}
                    className="inventory-form-input"
                    placeholder="31/12/2020"
                    required
                />
                <label htmlFor="warrantyExpirationDate">Warranty Expiration Date</label>
                <input
                    type="text"
                    id="warrantyExpirationDate"
                    name="warrantyExpirationDate"
                    value={warrantyExpirationDate}
                    onChange={handleChange}
                    className="inventory-form-input"
                    placeholder="31/12/2023"
                    required
                />
                <button type="submit" className="inventory-form-button">
                    Add to inventory
                </button>
            </form>
            {errors && <p className="inventory-form-error">{errors}</p>}
            {success && <p className="inventory-form-success">{success}</p>}
            {submittedData && (
                <div className="submitted-data">
                    <h2>Submitted Appliance Information</h2>
                    <p><strong>Eircode:</strong> {submittedData.eircode}</p>
                    <p><strong>Appliance Type:</strong> {submittedData.applianceType}</p>
                    <p><strong>Brand:</strong> {submittedData.brand}</p>
                    <p><strong>Model Number:</strong> {submittedData.modelNumber}</p>
                    <p><strong>Serial Number:</strong> {submittedData.serialNumber}</p>
                    <p><strong>Purchase Date:</strong> {submittedData.purchaseDate}</p>
                    <p><strong>Warranty Expiration Date:</strong> {submittedData.warrantyExpirationDate}</p>
                </div>
            )}
        </div>
        </div>
    );

}