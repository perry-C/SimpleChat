const Alert = (props: { content: string }) => {
    return (
        <div
            className='p-4 my-4 text-lg text-compPri rounded-lg bg-compSec w-1/4 absolute m-auto left-0 right-0 z-10 flex justify-center space-x-2 transition shadow'
            role='alert'
        >
            <span className='font-medium'>Info alert!</span>
            <span>{props.content}</span>
        </div>
    );
};

export default Alert;
