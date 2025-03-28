export const FooterLayout = () => {
    return (
        <footer>
            <div className="mx-auto px-4 pb-6 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex justify-center text-teal-600 sm:justify-start">
                        Monitoring System
                    </div>
                    <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-right">
                        Copyright &copy; {new Date().getFullYear()}. All rights
                        reserved.{" "}
                    </p>
                </div>
            </div>
        </footer>
    );
};
