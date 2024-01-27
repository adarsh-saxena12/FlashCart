import Image from "next/image";
import Link from "next/link";

const navIcons = [
   {src: '/assets/icons/search.svg', alt: 'search'},
   {src: '/assets/icons/black-heart.svg', alt: 'heart'},
   {src: '/assets/icons/user.svg', alt: 'user'},
]

const Navbar = () => {
    return (
        <header className="w-full">
            <nav className="nav bg-slate-200 m-4 ">
            <Link 
            href="/"
            className="flex items-center gap-2"
            >
             <Image 
              src="/assets/icons/logo.svg"
              width={27}
              height={27}
              alt="logo"
             />

             <p className="nav-logo">
              Flash<span className="text-blue-600">Cart</span>
             </p>
            </Link>

            <div className="flex items-center gap-5">
                {
                    navIcons.map((icon) => (
                        <Image 
                          src={icon.src}
                          key={icon.alt}
                          alt={icon.alt}
                          width={30}
                          height={30}
                          className="object-contain"
                        />
                    ))
                }
            </div>
            </nav>
        </header>
    );
};

export default Navbar;