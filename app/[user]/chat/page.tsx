'use client';

import FriendsWindow from '@/components/FriendsWindow';
import MessageWindow from '@/components/MessageWindow';
import { Card } from '@radix-ui/themes';
import { useRef } from 'react';
const UserPage = ({ params }: { params: { user: string } }) => {
    // const [selectedFriendId, setSelectedFriendId] = useState('');
    const selectedFriendId = useRef('');
    return (
        <div id='chat-page' className='grid grid-cols-5 h-screen space-x-4 p-4'>
            <div className='grid col-span-2 space-y-4'>
                <div id='chat-groups' className='row-span-1'>
                    <Card className='h-full shadow'></Card>
                </div>
                <div id='chat-friends' className='row-span-1'>
                    <Card className='h-full shadow'>
                        <FriendsWindow
                            selectedFriendId={selectedFriendId}
                        ></FriendsWindow>
                    </Card>
                </div>
            </div>
            <div id='chat-messaging' className='col-span-3'>
                <Card className='h-full shadow'>
                    {/* Enable for production */}
                    {/* {selectedFriendId !== '' && <MessageWindow></MessageWindow>} */}
                    <MessageWindow
                        selectedFriendId={selectedFriendId}
                    ></MessageWindow>
                </Card>
            </div>
        </div>
    );
};

export default UserPage;
