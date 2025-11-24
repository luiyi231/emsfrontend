export default function AuthLayout({ children }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-10">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-indigo-600 tracking-tight">
                        EMS<span className="text-gray-800"> System</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">Employee Management Portal</p>
                </div>
                {children}
            </div>
        </div>
    );
}
