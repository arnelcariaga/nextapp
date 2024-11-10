import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import Icon from './Icon';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevents hydration mismatch
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === "dark" ? <Icon name='Sun' className="h-5 w-5" /> : <Icon name='Moon' className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
