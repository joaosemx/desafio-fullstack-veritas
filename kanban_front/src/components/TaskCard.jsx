export default function TaskCard({ title, description, status}) {
    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer">
            <h3 className="font-semibold text-white text-base mb-1">{title}</h3>
            {description && (
                <p className="text-slate-400 text-sm mb-3">{description}</p>
            )}
            <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-slate-700 text-slate-300"></span>
        </div>
    )
}