import { Cross1Icon, PersonIcon } from '@radix-ui/react-icons';
import { Button, Callout, Card } from '@radix-ui/themes';
import { Dispatch, SetStateAction } from 'react';

const UserEnterAlert = (props: {
    enterAlertQueue: string[];
    setEnterAlertQueue: Dispatch<SetStateAction<string[]>>;
    content: string;
    index: number;
}) => {
    const onButtonClose = () => {
        props.setEnterAlertQueue(
            props.enterAlertQueue.filter((_, i) => i !== props.index)
        );
    };
    return (
        <Card className='shadow-lg'>
            <div className='flex items-center space-x-2'>
                <Callout.Root>
                    <Callout.Icon>
                        <PersonIcon />
                    </Callout.Icon>
                    <Callout.Text>
                        <span>
                            <b>{props.content}</b> has joined the room
                        </span>
                    </Callout.Text>
                </Callout.Root>
                <Button variant='ghost'>
                    <Cross1Icon onClick={onButtonClose}></Cross1Icon>
                </Button>
            </div>
        </Card>
    );
};

export default UserEnterAlert;
