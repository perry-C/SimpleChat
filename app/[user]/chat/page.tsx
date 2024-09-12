'use client';

import FriendsWindow from '@/components/FriendsWindow';
import MessageWindow from '@/components/MessageWindow';
import { socket } from '@/socket';
import { Card } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
const UserPage = ({ params }: { params: { user: string } }) => {
    const [selectedUserId, setSelectedUserId] = useState('');
    const [alertQueue, setAlertQueue] = useState([]);

    const [userList, setUserList] = useState([
        { userName: '', password: '', userId: '' },
    ]);

    useEffect(() => {
        handleFriendsQuery();
    }, []);

    socket.on('another_user_connected', (user) => {
        setUserList([...userList, user]);
    });

    socket.on('another_user_disconnected', (userId) => {
        setUserList(userList.filter((u) => u.userId != userId));
    });

    socket.on('receive_friends_list', (users) => {
        console.log('receiving friend list');
        setUserList(users);
    });

    const handleFriendsQuery = () => {
        socket.emit('query_friends_list');
    };

    // const alerts = alertQueue.map((a) => <Alert content={a?.content} />);

    return (
        <div
            id='chat-page'
            className='grid grid-cols-5 h-screen w-full space-x-4 p-4'
        >
            <div className='grid col-span-2 space-y-4'>
                <div id='chat-groups' className='row-span-1'>
                    <Card className='h-full shadow'></Card>
                </div>
                <div id='chat-friends' className='row-span-1'>
                    <Card className='h-full shadow'>
                        <FriendsWindow
                            userList={userList}
                            setSelectedUserId={setSelectedUserId}
                        ></FriendsWindow>
                    </Card>
                </div>
            </div>
            <div id='chat-messaging' className='col-span-3'>
                <Card className='h-full shadow'>
                    {/* Enable for production */}
                    {selectedUserId !== '' && (
                        <MessageWindow
                            selectedUserId={selectedUserId}
                        ></MessageWindow>
                    )}

                    {/* Enable for development */}
                    {/* <MessageWindow
                        selectedFriendId={selectedFriendId}
                    ></MessageWindow> */}
                </Card>
            </div>
        </div>
    );
};

export default UserPage;
