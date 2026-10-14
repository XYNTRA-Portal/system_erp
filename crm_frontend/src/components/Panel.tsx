const Panel = ({
    children, className = ""}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <section
            className={`rounded-2xl border border-white/[0.07] bg-[#111722] ${className}`}
        >
            {children}
        </section>
    );
}

export default Panel;