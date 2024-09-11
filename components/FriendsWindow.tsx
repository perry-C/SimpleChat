import { LoginInfo } from '@/common/type';
import { socket } from '@/socket';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import { Avatar } from '@radix-ui/themes';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
const FriendsWindow = (props: any) => {
    const [friendsList, setFriendsList] = useState([
        { userName: '', password: '', userId: '' },
    ]);

    useEffect(() => {
        handleFriendsQuery();
    }, []);

    socket.on('user_connected', (user) => {
        console.log('a new user has entered the chat');
        setFriendsList([...friendsList, user]);
    });
    socket.on('receive_friends_list', (users) => {
        console.log('receiving friend list');
        setFriendsList(users);
    });

    const handleFriendsQuery = () => {
        socket.emit('query_friends_list');
    };
    const handleFriendSelect = (friend: LoginInfo) => {
        props.selectedFriendId.current = friend.userId;
        console.log(friend.userId);
    };

    const friendsDisplay = friendsList.map((friend: LoginInfo) => (
        <li>
            <div className='border shadow rounded-lg m-2 p-2'>
                <button
                    onClick={() => handleFriendSelect(friend)}
                    className={classnames({
                        'hover:bg-gray-100 active:bg-gray-200 transition rounded-lg p-2 flex gap-2 items-center justify-around w-full':
                            true,
                    })}
                    disabled={socket.id === friend.userId}
                >
                    <Avatar fallback={friend.userName} />
                    <div>{friend.userName}</div>
                    {socket.id === friend.userId && (
                        <div className='opacity-50'>(yourself)</div>
                    )}
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
