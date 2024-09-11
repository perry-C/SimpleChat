import { socket } from '@/socket';
import { Button, TextField } from '@radix-ui/themes';
import { ChangeEvent, useRef, useState } from 'react';

interface MessageData {
    content: string;
    fromSelf: boolean;
}

const MessageWindow = (props: any) => {
    const message = useRef('');
    const [messageLog, setMessageLog] = useState<MessageData[]>([]);

    socket.on('receive_message', (message) => {
        console.log('Client receiving message');
        console.log(messageLog);
        setMessageLog([...messageLog, { content: message, fromSelf: false }]);
    });

    const handleMessageUpdate = (e: ChangeEvent<HTMLInputElement>) => {
        message.current = e.target.value;
        console.log(message.current);
    };
    const handleMessageSend = () => {
        console.log('handle Message Send');

        if (message.current !== '') {
            socket.emit('send_message', {
                message,
                to: props.selectedFriendId,
            });

            setMessageLog([
                ...messageLog,
                { content: message.current, fromSelf: true },
            ]);
        }
    };

    const messageListMap = messageLog.map((m) => <ul>{m.content}</ul>);
    return (
        <div className='h-full flex flex-col justify-end'>
            <div id='message-display-window'>
                <ul>{messageListMap}</ul>
            </div>
            <div id='message-input-bar' className='flex space-x-2'>
                <TextField.Root
                    className='w-full'
                    variant='classic'
                    onChange={handleMessageUpdate}
                >
                    <TextField.Slot></TextField.Slot>
                </TextField.Root>
                <Button variant='soft' onClick={handleMessageSend}>
                    Send
                </Button>
            </div>
        </div>
    );
};

export default MessageWindow;
