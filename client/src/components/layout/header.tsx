import { ModeToggle } from "../theme/theme-mode-toggle";

export const Header = () => {
    return (
        <header className="flex items-center justify-between px-4 py-2 border-b border-accent">
            <p>App Name</p>
            <div className="flex-1"></div>
            <ModeToggle />
        </header>
    );
};
