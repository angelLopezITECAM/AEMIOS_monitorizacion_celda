export function Custom404() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl mb-8">Oops! Página no encontrada</p>
            <a
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            >
                Volver a inicio
            </a>
        </div>
    );
}