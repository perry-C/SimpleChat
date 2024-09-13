import { LoginInfo } from '@/common/type';
import { socket } from '@/socket';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import { Avatar } from '@radix-ui/themes';
import classnames from 'classnames';
const FriendsWindow = (props: any) => {
    const handleUserSelect = (user: LoginInfo) => {
        props.setSelectedUserId(user.userId);
        console.log(user.userId);
    };

    const userDisplay = props.userList.map((user: LoginInfo) => (
        <li>
            <div className='border shadow rounded-lg m-2 p-2'>
                <button
                    onClick={() => handleUserSelect(user)}
                    className={classnames({
                        'hover:bg-gray-100 active:bg-gray-200 transition rounded-lg p-2 flex gap-2 items-center justify-around w-full':
                            true,
                    })}
                    // disabled={socket.id === user.userId}
                >
                    <Avatar fallback={user.userName[0]} />
                    <div>{user.userName}</div>
                    {socket.id === user.userId && (
                        <div className='opacity-50'>(yourself)</div>
                    )}
                    <div className='ml-auto'>
                        <TriangleRightIcon />
                    </div>
                </button>
            </div>
        </li>
    ));

    return <ul>{userDisplay}</ul>;
};

export default FriendsWindow;
