'use client';
import { ChatBubbleIcon, GearIcon, HomeIcon } from '@radix-ui/react-icons';
import classnames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
const links = [
    {
        label: 'Home',
        href: 'home',
        icon: <HomeIcon className='h-full w-full' />,
    },
    {
        label: 'Chat',
        href: 'chat',
        icon: <ChatBubbleIcon className='h-full w-full' />,
    },
    {
        label: 'Settings',
        href: 'settings',
        icon: <GearIcon className='h-full w-full' />,
    },
];

const NavBar = () => {
    const currentPath = usePathname().split('/').pop();
    useEffect(() => {
        console.log(currentPath);
    }, []);
    const ulClassName = `flex flex-col space-y-4 pt-4 justify-start items-center h-screen border-r shadow`;
    return (
        <nav>
            <ul className={ulClassName}>
                {links.map((val, key) => (
                    <Link
                        key={key}
                        href={val.href}
                        className='flex w-12 h-12 justify-center'
                    >
                        {/* {val.label} */}
                        <div
                            id='icon-container'
                            className={classnames({
                                'bg-gray-300': val.href === currentPath,
                                // 'text-zinc-500': val.href !== currentPath,
                                'flex-grow rounded-lg p-2 hover:bg-gray-300 transition-colors':
                                    true,
                            })}
                        >
                            {val.icon}
                        </div>
                    </Link>
                ))}
            </ul>
        </nav>
    );
};

export default NavBar;
