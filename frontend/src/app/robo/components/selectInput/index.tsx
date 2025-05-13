

interface SelectItem {
    id: string;
    value: string;
    onChange: (value: string) => void;
    options: any[];
    className?: string;
}


export const SelectInput = ({ id, value, onChange, options, className = ''}: SelectItem) => {



    return (
        <div className="flex flex-col p-1 ">
            <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-400 ">
                {id.toUpperCase()}
            </label>

            <select 
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-200 ${className}`}
            
            >
                {
                    options.map((item, index) => (
                        <option key={index} value={item} className="text-black text-sm">
                            {item}
                        </option>
                    ))
                }
            </select>
            
        </div>
    )
}


