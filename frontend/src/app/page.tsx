
export default function Home() {


    return (

        <div className="mt-10 flex flex-col space-between items-center justify-center">
            
            <h1>
                Olá Mundo
            </h1>

            <div className="h-100 flex items-center">
                <a href="/login" className="font-bold hover:text-blue-400">
                    Login
                </a>

            </div>

        </div>
    );
}
