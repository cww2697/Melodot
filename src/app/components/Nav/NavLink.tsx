const NavLink = ({ title, route }: {
    title: string;
    route: string;
}) => {
    return (
        <button
            onClick={() => window.location.href = route}
            className="px-4 py-2 text-white hover:bg-gray-700 rounded-md"
        >
            {title}
        </button>
    )
}

export default NavLink