import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    borderColor: string;
    bg: string;
    className?: string;
}

export function StatCard({
    label,
    value,
    icon: Icon,
    color,
    borderColor,
    bg,
    className = "",
}: StatCardProps) {
    return (
        <div
            className={`bg-card rounded-xl p-5 shadow-sm border border-border border-l-4 ${borderColor} relative overflow-hidden ${className}`}
        >
            <div className={`p-2 rounded-lg ${bg} w-fit mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
        </div>
    );
}
