'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function Search(){
    const [serialNumber, setSerialNumber] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setError('');
        setResult(null);

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
            setResult(data.data);
        }else{
            setError(data.message);
        }
    }

    return(
        <div>
            <nav className='nav-bar'>
                <Link href='/' className='nav-link home-link'>Home</Link>
            </nav>
            <div className='search-container'>
                <h1>Search Appliances</h1>
                <label htmlFor='serialNumber'>Serial Number</label>
                <input
                    type="text" 
                    maxLength="14"
                    pattern="^\d{4}-\d{4}-\d{4}$"
                    id="serialNumber"
                    name="serialNumber"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="inventory-form-input"
                    placeholder="1234-5678-9012"
                    required
                />
                <button onClick={handleSearch} className='search-button'>Search</button>
            </div>
            {error && <p className='search-error'>{error}</p>}
            {result && (
                <div className='submitted-data'>
                    <h2>Appliance Details</h2>
                    <p><strong>Appliance Type:</strong> {result.ApplianceType}</p>
                    <p><strong>Brand:</strong> {result.Brand}</p>
                    <p><strong>Model Number:</strong> {result.ModelNumber}</p>
                    <p><strong>Serial Number:</strong> {result.SerialNumber}</p>
                    <p><strong>Purchase Date:</strong> {result.PurchaseDate}</p>
                    <p><strong>Warranty Expiration Date:</strong> {result.WarrantyExpirationDate}</p>
                    <p><strong>Cost:</strong> €{result.CostOfAppliance}</p>
                </div>
            )}
        </div>
    )
}