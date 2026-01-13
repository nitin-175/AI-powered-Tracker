


export default function StatCard({ title, value, subtitle }) {

    return (
        <div className="flex">
            <div className="h-28 w-60  bg-blue-300 rounded-xl p-5 ml-67 mt-15">
                <p className="text-sm text-gray-900">{title}</p>
                <h2 className="text-2xl font-semibold mt-2">{value}</h2>
                {subtitle && (
                    <p className="text-xs text-gray-900 mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    );
};

