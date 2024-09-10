import { LoginInfo } from '@/common/type';
import { socket } from '@/socket';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import { Avatar } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

const FriendsWindow = () => {
    const [friendsList, setFriendsList] = useState([
        { userName: 'zed', password: '', userId: '' },
    ]);
    const [selectedFriendId, setSelectedFriendId] = useState('');

    useEffect(() => {
        handleFriendsQuery();
    }, []);

    useEffect(() => {
        socket.on('user_connected', (user) => {
            console.log('a new user has entered the chat');
            setFriendsList([...friendsList, user]);
        });
        socket.on('receive_friends_list', (users) => {
            console.log('receiving friend list');
            setFriendsList(users);
        });
    }, [socket]);

    const handleFriendsQuery = () => {
        socket.emit('query_friends_list');
    };
    const handleFriendSelect = (friend: LoginInfo) => {
        setSelectedFriendId(friend.userId);
        console.log(selectedFriendId);
    };

    // ===============================================

    const friendsDisplay = friendsList.map((friend: LoginInfo) => (
        <li>
            <div className='border shadow rounded-lg m-2 p-2'>
                <button
                    onClick={() => handleFriendSelect(friend)}
                    className='hover:bg-gray-100 active:bg-gray-200 transition rounded-lg p-2 flex gap-2 items-center justify-around w-full'
                >
                    <Avatar fallback={friend.userName} />
                    <div>{friend.userName}</div>
                    <div className='ml-auto'>
                        <TriangleRightIcon />
                    </div>
                </button>
            </div>
        </li>
    ));

    return <ul>{friendsDisplay}</ul>;
};

export default FriendsWindow;
