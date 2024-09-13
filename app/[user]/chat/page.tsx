'use client';

import FriendsWindow from '@/components/FriendsWindow';
import MessageWindow from '@/components/MessageWindow';
import UserEnterAlert from '@/components/UserEnterAlert';
import UserExitAlert from '@/components/UserExitAlert';
import { socket } from '@/socket';
import { Card } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
const UserPage = ({ params }: { params: { user: string } }) => {
    const [selectedUserId, setSelectedUserId] = useState('');
    const [enterAlertQueue, setEnterAlertQueue] = useState<string[]>([]);
    const [exitAlertQueue, setExitAlertQueue] = useState<string[]>([]);

    const [userList, setUserList] = useState([
        {
            userName: '',
            userId: '',
            connected: true,
            messages: [],
        },
    ]);

    useEffect(() => {
        socket.emit('get_users');
    }, []);

    socket.on('another_user_connected', (user) => {
        setUserList([...userList, user]);
        if (!enterAlertQueue.includes(user.userName))
            setEnterAlertQueue([...enterAlertQueue, user.userName]);
    });

    socket.on('another_user_disconnected', (user) => {
        setUserList(userList.filter((u) => u.userName != user.userName));
        if (!exitAlertQueue.includes(user.userName))
            setExitAlertQueue([...exitAlertQueue, user.userName]);
    });

    socket.on('users', (users) => {
        setUserList(users);
    });

    useEffect(() => {
        // Reconnect to the previous session after refreshing the page
        const sessionId = localStorage.getItem('sessionId');
        const userName = localStorage.getItem('userName');
        const userId = localStorage.getItem('userId');

        if (sessionId) {
            socket.auth = { sessionId };
            socket.userName = userName;
            socket.userId = userId;
            socket.connect();
        }
    }, []);

    const alerts = enterAlertQueue.map((a, i) => (
        <li>
            <UserEnterAlert
                content={a}
                index={i}
                enterAlertQueue={enterAlertQueue}
                setEnterAlertQueue={setEnterAlertQueue}
            />
        </li>
    ));
    const exitAlerts = exitAlertQueue.map((a, i) => (
        <li>
            <UserExitAlert
                content={a}
                index={i}
                exitAlertQueue={exitAlertQueue}
                setExitAlertQueue={setExitAlertQueue}
            />
        </li>
    ));
    return (
        <div>
            <ul className='flex flex-col w-1/4 items-center absolute m-auto mt-6 left-0 right-0 z-10 space-y-4'>
                {alerts}
                {exitAlerts}
            </ul>
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
                                userList={userList.filter(
                                    (user) => user.connected
                                )}
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
                                toMessages={
                                    userList.find(
                                        (user) => user.userId === selectedUserId
                                    )?.messages
                                }
                                fromMessages={
                                    userList.find(
                                        (user) => user.userId === socket.userId
                                    )?.messages
                                }
                            ></MessageWindow>
                        )}

                        {/* Enable for development */}
                        {/* <MessageWindow
                        selectedFriendId={selectedFriendId}
                    ></MessageWindow> */}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
