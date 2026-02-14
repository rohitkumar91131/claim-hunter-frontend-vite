export default function Footer() {
    return (
        <footer className="border-t border-border-custom py-8 mt-20 transition-colors duration-300">
            <div className="container mx-auto px-6 text-center text-muted text-sm transition-colors duration-300">
                <p>&copy; {new Date().getFullYear()} Claim Hunter. Built for truth seekers.</p>
            </div>
        </footer>
    );
}
