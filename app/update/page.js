'use client'
import {useState} from 'react';
import Link from 'next/link'

export default function Update(){
    const [serialNumber, setSerialNumber] = useState('');
    const [applianceType, setApplianceType] = useState('');
    const [brand, setBrand] = useState('');
    const [modelNumber, setModelNumber] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [warrantyExpirationDate, setWarrantyExpirationDate] = useState('');
    const [costOfAppliance, setCostOfAppliance] = useState('')
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [found, setFound] = useState(false);

    const handleSearch = async () => {
        setError('');
        setResult(null);
        setFound(false);

        const serialRegex = /^\d{4}-\d{4}-\d{4}$/;
        if (!serialNumber.trim()) {
            setError('Please enter a serial number.');
            return;
        }

        if (!serialRegex.test(serialNumber)) {
            setError('Invalid serial number format (e.g. 1234-5678-9012).');
            return;
        }

        const res = await fetch(`/api/search?serialNumber=${serialNumber}`);
        const data = await res.json();

        if (res.ok){
            setResult(data.data);
            setApplianceType(data.data.ApplianceType);
            setBrand(data.data.Brand);
            setCostOfAppliance(data.data.CostOfAppliance);
            setModelNumber(data.data.ModelNumber);
            setPurchaseDate(data.data.PurchaseDate);
            setWarrantyExpirationDate(data.data.WarrantyExpirationDate);
            setFound(true);
        } else{
            setError(data.message);
        }
    }

    const handleUpdate = async () => {
        setError('');
        if (!applianceType) {
            setError('Please select an appliance type.');
            return;
        }

        if (!brand.trim()) {
            setError('Please enter a brand.');
            return;
        }

        if (!/^\d{3}-\d{3}-\d{4}$/.test(modelNumber)) {
            setError('Invalid model number format. Please enter a valid model number (e.g., 123-456-7890).');
            return false;
        }

        if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(purchaseDate)) {
            setError('Invalid purchase date format. Please enter a valid date (e.g., 31/12/2020).');
            return false;
        }

        if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(warrantyExpirationDate)) {
            setError('Invalid warranty expiration date format. Please enter a valid date (e.g., 31/12/2023).');
            return false;
        }
        if (isNaN(costOfAppliance) || Number(costOfAppliance) <= 0) {   
            setError('Invalid cost. Please enter a valid number greater than 0 for the cost of the appliance.');
            return false;
        }

        const res = await fetch(`/api/update`, {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                serialNumber,
                applianceType,
                brand,
                modelNumber,
                purchaseDate,
                warrantyExpirationDate,
                costOfAppliance
            }),
        });

        const data = await res.json();
        if (res.ok){
            setSuccess('Appliance has been updated.');
        } else {
            setError(data.message);
        }
    }

    return (
    <div>
        <nav className="nav-bar">
            <Link href="/" className="nav-link home-link">Home</Link>
        </nav>
        <div className="search-container">
            <h1>Update Appliance</h1>
            <label htmlFor="serialNumber">Serial Number</label>
            <input
                type="text"
                maxLength="14"
                id="serialNumber"
                name="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="inventory-form-input"
                placeholder="1234-5678-9012"
            />
            <button onClick={handleSearch} className="search-button">Search</button>
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        {found && (
            <div className="inventory-form-container">
                <h2>Update Appliance Details</h2>
                <label htmlFor="applianceType">Appliance Type</label>
                <select
                    id="applianceType"
                    name="applianceType"
                    value={applianceType}
                    onChange={(e) => setApplianceType(e.target.value)}
                    className="inventory-form-select"
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
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="inventory-form-input"
                />
                <label htmlFor="modelNumber">Model Number</label>
                <input
                    type="text"
                    id="modelNumber"
                    value={modelNumber}
                    onChange={(e) => setModelNumber(e.target.value)}
                    className="inventory-form-input"
                />
                <label htmlFor="purchaseDate">Purchase Date</label>
                <input
                    type="text"
                    id="purchaseDate"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="inventory-form-input"
                />
                <label htmlFor="warrantyExpirationDate">Warranty Expiration Date</label>
                <input
                    type="text"
                    id="warrantyExpirationDate"
                    value={warrantyExpirationDate}
                    onChange={(e) => setWarrantyExpirationDate(e.target.value)}
                    className="inventory-form-input"
                />
                <label htmlFor="costOfAppliance">Cost of Appliance</label>
                <input
                    type="number"
                    id="costOfAppliance"
                    value={costOfAppliance}
                    onChange={(e) => setCostOfAppliance(e.target.value)}
                    className="inventory-form-input"
                />
                <button onClick={handleUpdate} className="inventory-form-button">Update</button>
            </div>
        )}
    </div>
);
}
