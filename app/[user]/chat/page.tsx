import { Card } from '@radix-ui/themes';

const UserPage = ({ params }: { params: { user: string } }) => {
    return (
        <div id='chat-page'>
            <div id='chat-friends'>
                <Card></Card>
            </div>
            <div id='chat-messaging'>
                <Card></Card>
            </div>
            <div id='chat-settings'>
                <Card></Card>
            </div>
        </div>
    );
};

export default UserPage;
