export function DashboardGraph() {
    return (
        <div>
            <h1>Dashboard Graph</h1>

            <div className="grid grid-cols-6 grid-rows-4 gap-4 max-h-[80vh]">
                <div className="col-span-2 row-span-2 bg-amber-50">1</div>
                <div className="col-span-2 row-span-2 col-start-3 bg-blue-200">2</div>
                <div className="col-span-2 row-span-2 col-start-5 bg-green-300">3</div>
                <div className="col-span-6 row-span-2 row-start-3 bg-pink-200">4</div>
            </div>

        </div>
    )
}