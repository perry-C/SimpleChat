'use client';

import { socket } from '@/socket';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import { Avatar, Card } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
const UserPage = ({ params }: { params: { user: string } }) => {
    const [friendsList, setFriendsList] = useState([
        { userName: 'zed', password: '', userId: '' },
    ]);
    useEffect(() => {
        handleFriendsQuery();
    }, []);

    useEffect(() => {
        socket.on('receive_friends_list', (data) => {
            console.log('receiving friend list');
            setFriendsList(data);
        });
    }, [socket]);

    const handleFriendsQuery = () => {
        socket.emit('query_friends_list');
    };

    const friendsDisplay = friendsList.map((friend) => (
        <li>
            <div className='border shadow  rounded-lg m-2 p-2'>
                <button className='hover:bg-gray-100 active:bg-gray-200 transition rounded-lg p-2 flex gap-2 items-center justify-around w-full'>
                    <Avatar fallback={friend.userName} />
                    <div>{friend.userName}</div>
                    <div className='ml-auto'>
                        <TriangleRightIcon />
                    </div>
                </button>
            </div>
        </li>
    ));

    return (
        <div id='chat-page' className='grid grid-cols-5 h-screen space-x-4 p-4'>
            {/* <Button onClick={handleFriendsQuery}>query friends</Button> */}
            <div className='grid col-span-2 space-y-4'>
                <div id='chat-groups' className='row-span-1'>
                    <Card className='h-full shadow'></Card>
                </div>
                <div id='chat-friends' className='row-span-1'>
                    <Card className='h-full shadow'>
                        <ul>{friendsDisplay}</ul>
                    </Card>
                </div>
            </div>
            <div id='chat-messaging' className='col-span-3'>
                <Card className='h-full shadow'></Card>
            </div>
        </div>
    );
};

export default UserPage;
