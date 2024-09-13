import { socket } from '@/socket';
import { TextField } from '@radix-ui/themes';
import classnames from 'classnames';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
interface MessageData {
    content: string;
    fromSelf: boolean;
}

const mockData = [
    { content: 'hi chen', fromSelf: true },
    { content: 'hi pai', fromSelf: false },
    { content: 'I dont know', fromSelf: true },
    { content: 'doesnt matter', fromSelf: false },
    { content: 'bye ', fromSelf: true },
    { content: 'bye ', fromSelf: false },
];

const MessageWindow = (props: any) => {
    const message = useRef('');
    const messageInputRef = useRef<HTMLInputElement>(null);
    // const [messageLog, setMessageLog] = useState<MessageData[]>(mockData);
    const [messageLog, setMessageLog] = useState(props.messages);

    socket.on('receive_message', (message) => {
        setMessageLog([...messageLog, { content: message, fromSelf: false }]);
    });

    const handleMessageUpdate = (e: ChangeEvent<HTMLInputElement>) => {
        message.current = e.target.value;
    };
    const handleMessageSend = (e: any) => {
        if (e.type === 'keydown' && e.key !== 'Enter') return;
        if (message.current !== '') {
            if (messageInputRef.current) messageInputRef.current.value = '';
            socket.emit('send_message', {
                content: message.current,
                to: props.selectedUserId,
            });

            setMessageLog([
                ...messageLog,
                { content: message.current, fromSelf: true },
            ]);
        }
    };

    const messageListMap = messageLog.map((m) => (
        <li className='flex'>
            <div
                className={classnames({
                    'ml-auto bg-compPri': m.from === socket.userId,
                    'ml-auto bg-compPri': m.to === socket.userId,
                    'mr-auto bg-compSec': m.from !== socket.userId,
                    'text-white text-2xl flex p-4 rounded-lg': true,
                })}
            >
                {m.content}
            </div>
        </li>
    ));
    return (
        <div className='flex flex-col justify-end space-y-4 h-full'>
            <div id='message-display-window'>
                <ul className='space-y-2'>{messageListMap}</ul>
            </div>
            <div id='message-input-bar' className='flex space-x-4 h-12'>
                <TextField.Root
                    className='w-full min-h-full'
                    variant='classic'
                    onChange={handleMessageUpdate}
                    onKeyDown={handleMessageSend}
                    size='3'
                    ref={messageInputRef}
                ></TextField.Root>
                <button
                    onClick={handleMessageSend}
                    className='border-compPri border p-2 text-compPri rounded-lg hover:bg-compSec hover:text-white active:bg-compPri transition'
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default MessageWindow;
