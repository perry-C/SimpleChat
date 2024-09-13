'use client';

import { socket } from '@/socket';
import { Button, Card, TextField } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
const Home = () => {
    // TODO: record user name and room id, (add password validation later)
    // const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignIn = () => {
        if (userName !== '' && password !== '') {
            router.prefetch(`/${userName}/chat`);
            socket.auth = { userName };
            socket.connect();
            router.push(`/${userName}/chat`);
        } else {
            alert('password and username pls');
        }
    };

    useEffect(() => {
        socket.on('session', ({ sessionId, userId }) => {
            // attach the session ID to the next reconnection attempts
            socket.auth = { sessionId };
            // store it in the localStorage
            localStorage.setItem('sessionId', sessionId);
            // save the ID of the user
            socket.userId = userId;
        });
        return () => {
            socket.off('session');
        };
    }, []);

    return (
        <div
            id='login-page'
            className='h-screen flex justify-center items-center'
        >
            <Card className='shadow'>
                <div
                    id='login-box'
                    className='flex flex-col h-full justify-center space-y-4'
                >
                    <TextField.Root
                        placeholder='User Name'
                        onChange={(e) => setUserName(e.target.value)}
                        size='3'
                    >
                        <TextField.Slot></TextField.Slot>
                    </TextField.Root>
                    <TextField.Root
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        size='3'
                    >
                        <TextField.Slot></TextField.Slot>
                    </TextField.Root>

                    <Button onClick={handleSignIn} size='3'>
                        Sign in
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Home;
