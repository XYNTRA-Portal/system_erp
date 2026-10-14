const SectionHeading = ({
    title,
    subtitle,
    action,
}: {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}) => {
    return (
        <div className="mb-5 flex items-center justify-between gap-3">
            <div>
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                {subtitle && (
                    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                )}
            </div>
            {action}
        </div>
    );
}

export default SectionHeading;