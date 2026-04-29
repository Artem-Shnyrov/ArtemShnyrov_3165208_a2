import Link from 'next/link';
export default function Home() {
    return (
        <div>
            <div className="home-container">
                <h1>Welcome to the Home Appliance Inventory System</h1>
                <p>Please select an option below:</p>
                <div className="home-options">
                    <Link href="/part-b-c" className="home-button">Add Appliance</Link>
                    <Link href="/search" className="home-button">Search Appliance</Link>
                    <Link href="/update" className="home-button">Update Appliance</Link>
                    <Link href="/delete" className="home-button">Delete Appliance</Link>
                </div>
            </div>
        </div>
    );
}
