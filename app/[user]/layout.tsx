import NavBar from '@/components/NavBar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='grid grid-cols-12'>
            <div className='col-span-1'>
                <NavBar></NavBar>
            </div>
            <div className='col-span-11'>{children}</div>
        </div>
    );
}
