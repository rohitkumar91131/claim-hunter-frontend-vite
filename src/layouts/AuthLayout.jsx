import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-primary/30 bg-background text-foreground transition-colors duration-300">
            <Outlet />
        </div>
    );
}
