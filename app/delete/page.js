'use client'
import {useState} from 'react';
import Link from "next/link"

export default function Delete(){
    const [serialNumber, setSerialNumber] = useState('');
    const [error, setError] = useState('');
    const [found, setFound] = useState(false);
    const [success, setSuccess] = useState('');
    const [applianceData, setApplianceData] = useState(null);

    const handleSearch = async () => {
        setError('');
        setFound(false);
        setApplianceData(null);

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

        if(res.ok){
            setFound(true);
            setApplianceData(data.data);
        } else {
            setError(data.message);
        }
    }

    const handleDelete = async () => {
        setSuccess('');

        const res = await fetch(`/api/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serialNumber: applianceData.SerialNumber }),
        });
        const data = await res.json();

        if(res.ok){
            setFound(false);
            setSuccess('Appliance deleted.');
        } else {
            setError(data.message);
        }
    }

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div>
            <nav className="nav-bar">
                <Link href="/" className="nav-link home-link">Home</Link>
            </nav>
            <div className="search-container">
                <h1>Delete Appliance</h1>
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
                <div className="submitted-data">
                    <h2>Appliance Details</h2>
                    <p>Appliance Type: {applianceData.ApplianceType}</p>
                    <p>Brand: {applianceData.Brand}</p>
                    <p>Model Number: {applianceData.ModelNumber}</p>
                    <p>Serial Number: {applianceData.SerialNumber}</p>
                    <p>Purchase Date: {formatDate(applianceData.PurchaseDate)}</p>
                    <p>Warranty Expiration Date: {formatDate(applianceData.WarrantyExpirationDate)}</p>
                    <p>Cost: €{applianceData.CostOfAppliance}</p>
                    <p>Are you sure you want to delete this appliance?</p>
                    <button onClick={handleDelete} className="inventory-form-button">Confirm Delete</button>
                </div>
            )}
        </div>
    )
}